'use strict';

const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

// All routes require authentication
router.use(requireAuth);

// ─── Constants ────────────────────────────────────────────────────────────────

const FREE_HABIT_LIMIT = 3;
const VALID_CATEGORIES = ['health', 'mind', 'wealth', 'social'];
const VALID_FREQUENCIES = ['daily', 'weekly'];

// Category → RPG stat mapping (for response metadata)
const CATEGORY_STAT = {
  health: 'strength',
  mind: 'intelligence',
  wealth: 'luck',
  social: 'charisma',
};

// ─── GET /api/habits ──────────────────────────────────────────────────────────

/**
 * Get all active (non-archived) habits for the current user.
 * Includes today's completion status for each habit.
 *
 * Query params:
 *   ?category=health|mind|wealth|social  (optional filter)
 *   ?include_archived=true               (include archived habits)
 */
router.get('/', async (req, res) => {
  try {
    const { category, include_archived } = req.query;

    let query = supabase
      .from('habits')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (include_archived !== 'true') {
      query = query.eq('archived', false);
    }

    if (category && VALID_CATEGORIES.includes(category)) {
      query = query.eq('category', category);
    }

    const { data: habits, error } = await query;
    if (error) throw error;

    // Check which habits were completed today
    const today = new Date().toISOString().split('T')[0];
    const { data: todayLogs } = await supabase
      .from('habit_logs')
      .select('habit_id')
      .eq('user_id', req.user.id)
      .gte('completed_at', `${today}T00:00:00Z`)
      .lt('completed_at', `${today}T23:59:59Z`);

    const completedTodaySet = new Set((todayLogs || []).map((l) => l.habit_id));

    const enriched = habits.map((h) => ({
      ...h,
      completed_today: completedTodaySet.has(h.id),
      stat_affected: CATEGORY_STAT[h.category] || null,
    }));

    return res.json({
      habits: enriched,
      count: enriched.length,
    });
  } catch (err) {
    console.error('[GET /habits]', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── POST /api/habits ─────────────────────────────────────────────────────────

/**
 * Create a new habit.
 * Body: { name, category, difficulty, frequency?, reminder_enabled?, reminder_time?, reminder_days? }
 *
 * Free tier: max 3 active habits.
 */
router.post('/', async (req, res) => {
  const { name, category, difficulty, frequency, reminder_enabled, reminder_time, reminder_days } =
    req.body;

  // ── Validation ──
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 1 || name.trim().length > 80) {
    errors.push('name must be a string between 1–80 characters');
  }

  if (!category || !VALID_CATEGORIES.includes(category)) {
    errors.push(`category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  if (!difficulty || !Number.isInteger(Number(difficulty)) || difficulty < 1 || difficulty > 5) {
    errors.push('difficulty must be an integer between 1–5');
  }

  if (frequency && !VALID_FREQUENCIES.includes(frequency)) {
    errors.push(`frequency must be one of: ${VALID_FREQUENCIES.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Bad Request', messages: errors });
  }

  try {
    // ── Free tier check ──
    const { count, error: countError } = await supabase
      .from('habits')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', req.user.id)
      .eq('archived', false);

    if (countError) throw countError;

    // TODO: Replace with subscription check (e.g., user_metadata.plan === 'pro')
    const isPro = req.user.user_metadata?.plan === 'pro';

    if (!isPro && count >= FREE_HABIT_LIMIT) {
      return res.status(403).json({
        error: 'Free Tier Limit Reached',
        message: `Free accounts are limited to ${FREE_HABIT_LIMIT} active habits. Upgrade to Pro for unlimited habits.`,
        limit: FREE_HABIT_LIMIT,
        current_count: count,
        upgrade_url: '/api/billing/upgrade',
      });
    }

    // ── Insert ──
    const { data, error } = await supabase
      .from('habits')
      .insert([
        {
          user_id: req.user.id,
          name: name.trim(),
          category,
          difficulty: Number(difficulty),
          frequency: frequency || 'daily',
          reminder_enabled: reminder_enabled || false,
          reminder_time: reminder_time || null,
          reminder_days: reminder_days || [1, 2, 3, 4, 5, 6, 7],
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      habit: {
        ...data,
        completed_today: false,
        stat_affected: CATEGORY_STAT[data.category] || null,
      },
    });
  } catch (err) {
    console.error('[POST /habits]', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── GET /api/habits/:id ──────────────────────────────────────────────────────

/**
 * Get a single habit by ID (with recent log history).
 */
router.get('/:id', async (req, res) => {
  try {
    const { data: habit, error } = await supabase
      .from('habits')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !habit) {
      return res.status(404).json({ error: 'Not Found', message: 'Habit not found' });
    }

    // Fetch last 30 logs for sparkline / history
    const { data: logs } = await supabase
      .from('habit_logs')
      .select('completed_at, xp_earned, streak_at_completion, notes')
      .eq('habit_id', req.params.id)
      .eq('user_id', req.user.id)
      .order('completed_at', { ascending: false })
      .limit(30);

    const today = new Date().toISOString().split('T')[0];
    const completedToday = (logs || []).some(
      (l) => l.completed_at.startsWith(today),
    );

    return res.json({
      habit: {
        ...habit,
        completed_today: completedToday,
        stat_affected: CATEGORY_STAT[habit.category] || null,
      },
      recent_logs: logs || [],
    });
  } catch (err) {
    console.error('[GET /habits/:id]', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── POST /api/habits/:id/complete ───────────────────────────────────────────

/**
 * Mark a habit as complete for today.
 * Awards XP, updates streak, updates character stats.
 *
 * Body (optional): { notes }
 */
router.post('/:id/complete', async (req, res) => {
  const { notes } = req.body || {};
  const habitId = req.params.id;

  try {
    // ── Verify ownership ──
    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .select('*')
      .eq('id', habitId)
      .eq('user_id', req.user.id)
      .eq('archived', false)
      .single();

    if (habitError || !habit) {
      return res.status(404).json({ error: 'Not Found', message: 'Habit not found' });
    }

    // ── Idempotency: already completed today? ──
    const today = new Date().toISOString().split('T')[0];
    const { data: existingLog } = await supabase
      .from('habit_logs')
      .select('id')
      .eq('habit_id', habitId)
      .eq('user_id', req.user.id)
      .gte('completed_at', `${today}T00:00:00Z`)
      .maybeSingle();

    if (existingLog) {
      return res.status(409).json({
        error: 'Already Completed',
        message: 'This habit has already been completed today. Come back tomorrow!',
      });
    }

    // ── Update streak via Postgres function ──
    const { data: newStreak, error: streakError } = await supabase.rpc('update_habit_streak', {
      p_habit_id: habitId,
      p_user_id: req.user.id,
    });

    if (streakError) {
      console.warn('[complete] streak RPC error (non-fatal):', streakError.message);
    }

    const currentStreak = typeof newStreak === 'number' ? newStreak : habit.current_streak + 1;

    // ── XP calculation ──
    // Base: difficulty * 10
    // Streak bonus: +10% per 7-day streak milestone (capped at 50%)
    const baseXP = habit.difficulty * 10;
    const streakMultiplier = 1 + Math.min(0.5, Math.floor(currentStreak / 7) * 0.1);
    const xpEarned = Math.round(baseXP * streakMultiplier);

    // ── Create habit log ──
    const { data: log, error: logError } = await supabase
      .from('habit_logs')
      .insert([
        {
          habit_id: habitId,
          user_id: req.user.id,
          notes: notes || null,
          xp_earned: xpEarned,
          streak_at_completion: currentStreak,
        },
      ])
      .select()
      .single();

    if (logError) throw logError;

    // ── Update user_stats ──
    const { data: stats, error: statsError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (statsError) throw statsError;

    const categoryXPField = `${habit.category}_xp`;
    const categoryLevelField = `${habit.category}_level`;
    const newCategoryXP = (stats[categoryXPField] || 0) + xpEarned;
    const newTotalXP = (stats.total_xp || 0) + xpEarned;

    // Level formula: floor(sqrt(xp / 100)) + 1
    const prevLevel = stats[categoryLevelField] || 1;
    const newLevel = Math.floor(Math.sqrt(newCategoryXP / 100)) + 1;
    const leveledUp = newLevel > prevLevel;

    const { error: statsUpdateError } = await supabase
      .from('user_stats')
      .update({
        [categoryXPField]: newCategoryXP,
        [categoryLevelField]: newLevel,
        total_xp: newTotalXP,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', req.user.id);

    if (statsUpdateError) throw statsUpdateError;

    // ── Update character stats (non-fatal) ──
    try {
      await syncCharacterStats(req.user.id);
    } catch (charErr) {
      console.warn('[complete] character sync error (non-fatal):', charErr.message);
    }

    // ── Fetch updated habit for fresh streak values ──
    const { data: freshHabit } = await supabase
      .from('habits')
      .select('current_streak, longest_streak')
      .eq('id', habitId)
      .single();

    return res.json({
      success: true,
      log,
      xp_earned: xpEarned,
      streak_bonus: streakMultiplier > 1,
      streak_multiplier: streakMultiplier,
      streak: freshHabit?.current_streak ?? currentStreak,
      longest_streak: freshHabit?.longest_streak ?? currentStreak,
      category: habit.category,
      stat_affected: CATEGORY_STAT[habit.category],
      new_category_xp: newCategoryXP,
      new_total_xp: newTotalXP,
      new_level: newLevel,
      leveled_up: leveledUp,
    });
  } catch (err) {
    console.error('[POST /habits/:id/complete]', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── PATCH /api/habits/:id ────────────────────────────────────────────────────

/**
 * Update a habit's properties.
 * Body: { name?, category?, difficulty?, frequency?, reminder_enabled?, reminder_time?, reminder_days? }
 */
router.patch('/:id', async (req, res) => {
  const allowed = ['name', 'category', 'difficulty', 'frequency', 'reminder_enabled', 'reminder_time', 'reminder_days'];
  const updates = {};

  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'Bad Request', message: 'No valid fields to update' });
  }

  // Validate if present
  if (updates.category && !VALID_CATEGORIES.includes(updates.category)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: `category must be one of: ${VALID_CATEGORIES.join(', ')}`,
    });
  }

  if (updates.difficulty !== undefined) {
    const d = Number(updates.difficulty);
    if (!Number.isInteger(d) || d < 1 || d > 5) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'difficulty must be an integer between 1–5',
      });
    }
    updates.difficulty = d;
  }

  updates.updated_at = new Date().toISOString();

  try {
    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Not Found', message: 'Habit not found' });

    return res.json({ habit: { ...data, stat_affected: CATEGORY_STAT[data.category] || null } });
  } catch (err) {
    console.error('[PATCH /habits/:id]', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── DELETE /api/habits/:id ───────────────────────────────────────────────────

/**
 * Archive (soft-delete) a habit.
 */
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('habits')
      .update({ archived: true, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    return res.json({ success: true, message: 'Habit archived' });
  } catch (err) {
    console.error('[DELETE /habits/:id]', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Sync character stats from current user_stats + equipped gear.
 * Called after XP changes so character combat stats stay fresh.
 */
async function syncCharacterStats(userId) {
  const { data: stats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!stats) return;

  const { data: equippedGear } = await supabase
    .from('gear')
    .select('stat_bonuses')
    .eq('user_id', userId)
    .eq('equipped', true);

  // Base stats from habit category levels (each level = 5 stat points)
  let strength = (stats.health_level || 1) * 5;
  let intelligence = (stats.mind_level || 1) * 5;
  let luck = (stats.wealth_level || 1) * 5;
  let charisma = (stats.social_level || 1) * 5;
  let attackPower = 10;
  let defense = 5;
  let maxHp = 100;

  // Apply gear bonuses
  (equippedGear || []).forEach((item) => {
    const b = item.stat_bonuses || {};
    strength += b.strength || 0;
    intelligence += b.intelligence || 0;
    luck += b.luck || 0;
    charisma += b.charisma || 0;
    attackPower += b.attack_power || 0;
    defense += b.defense || 0;
    maxHp += b.max_hp || 0;
  });

  const totalXp = stats.total_xp || 0;
  const characterLevel = Math.floor(Math.sqrt(totalXp / 100)) + 1;

  await supabase
    .from('characters')
    .update({
      level: characterLevel,
      total_xp: totalXp,
      strength,
      intelligence,
      luck,
      charisma,
      attack_power: attackPower,
      defense,
      max_hp: maxHp,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);
}

module.exports = router;
