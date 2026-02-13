const express = require('express');
const router = express.Router();
const { supabase } = require('../index');

// Get all habits for user
router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError) return res.status(401).json({ error: 'Invalid token' });

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .eq('archived', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new habit
router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError) return res.status(401).json({ error: 'Invalid token' });

    const { name, category, difficulty, frequency } = req.body;

    const { data, error } = await supabase
      .from('habits')
      .insert([
        {
          user_id: user.id,
          name,
          category,
          difficulty,
          frequency: frequency || 'daily'
        }
      ])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Complete habit (log + award XP + update streak)
router.post('/:id/complete', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError) return res.status(401).json({ error: 'Invalid token' });

    const habitId = req.params.id;
    const { notes } = req.body;

    // Check if already completed today
    const today = new Date().toISOString().split('T')[0];
    const { data: existingLog } = await supabase
      .from('habit_logs')
      .select('id')
      .eq('habit_id', habitId)
      .eq('user_id', user.id)
      .gte('completed_at', `${today}T00:00:00Z`)
      .single();

    if (existingLog) {
      return res.status(400).json({ error: 'Habit already completed today' });
    }

    // Get habit details
    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .select('*')
      .eq('id', habitId)
      .eq('user_id', user.id)
      .single();

    if (habitError) throw habitError;

    // Update streak (call Postgres function)
    const { data: streakData, error: streakError } = await supabase
      .rpc('update_habit_streak', {
        p_habit_id: habitId,
        p_user_id: user.id
      });

    const newStreak = streakData || habit.current_streak + 1;

    // Calculate XP (base = difficulty * 10)
    const baseXP = habit.difficulty * 10;
    // TODO: Add streak multiplier in future

    // Create log
    const { data: log, error: logError } = await supabase
      .from('habit_logs')
      .insert([
        {
          habit_id: habitId,
          user_id: user.id,
          notes,
          xp_earned: baseXP,
          streak_at_completion: newStreak
        }
      ])
      .select()
      .single();

    if (logError) throw logError;

    // Update user stats
    const { data: stats, error: statsError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (statsError) throw statsError;

    const categoryXPField = `${habit.category}_xp`;
    const newCategoryXP = (stats[categoryXPField] || 0) + baseXP;
    const newTotalXP = (stats.total_xp || 0) + baseXP;

    // Calculate new level (level = floor(sqrt(xp / 100)))
    const newLevel = Math.floor(Math.sqrt(newCategoryXP / 100)) + 1;
    const categoryLevelField = `${habit.category}_level`;

    const { error: updateError } = await supabase
      .from('user_stats')
      .update({
        [categoryXPField]: newCategoryXP,
        total_xp: newTotalXP,
        [categoryLevelField]: newLevel,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (updateError) throw updateError;

    // Update character stats based on new levels
    await updateCharacterFromHabits(user.id, habit.category, newLevel);

    // Get updated habit with new streak
    const { data: updatedHabit } = await supabase
      .from('habits')
      .select('current_streak, longest_streak')
      .eq('id', habitId)
      .single();

    res.json({
      log,
      xp_earned: baseXP,
      new_total_xp: newTotalXP,
      category: habit.category,
      new_category_xp: newCategoryXP,
      new_level: newLevel,
      streak: updatedHabit?.current_streak || newStreak,
      longest_streak: updatedHabit?.longest_streak || newStreak
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update habit
router.patch('/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError) return res.status(401).json({ error: 'Invalid token' });

    const habitId = req.params.id;
    const updates = req.body;

    const { data, error } = await supabase
      .from('habits')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', habitId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Archive habit (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError) return res.status(401).json({ error: 'Invalid token' });

    const habitId = req.params.id;

    const { error } = await supabase
      .from('habits')
      .update({ archived: true })
      .eq('id', habitId)
      .eq('user_id', user.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper function to update character stats when habits level up
async function updateCharacterFromHabits(userId, category, newLevel) {
  // Get current character
  const { data: character } = await supabase
    .from('characters')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!character) return;

  // Map category to stat
  const statMapping = {
    health: 'strength',
    mind: 'intelligence',
    wealth: 'luck',
    social: 'charisma'
  };

  const statToUpdate = statMapping[category];
  if (!statToUpdate) return;

  // Base stat = level * 5
  const newStatValue = newLevel * 5;

  // Get equipped gear bonuses
  const { data: equippedGear } = await supabase
    .from('gear')
    .select('*')
    .eq('user_id', userId)
    .eq('equipped', true);

  let gearBonus = 0;
  equippedGear?.forEach(item => {
    const bonuses = item.stat_bonuses || {};
    gearBonus += bonuses[statToUpdate] || 0;
  });

  const finalStatValue = newStatValue + gearBonus;

  // Update character
  await supabase
    .from('characters')
    .update({
      [statToUpdate]: finalStatValue,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);
}

module.exports = router;
