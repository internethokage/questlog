'use strict';

const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// ─── GET /api/ai/insight ──────────────────────────────────────────────────────

/**
 * Get a daily AI coaching insight based on the user's habit activity.
 * For MVP: uses canned responses. Replace with real LLM call in v2.
 */
router.get('/insight', async (req, res) => {
  try {
    const { data: habits } = await supabase
      .from('habits')
      .select('id, name, category, current_streak')
      .eq('user_id', req.user.id)
      .eq('archived', false);

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: recentLogs } = await supabase
      .from('habit_logs')
      .select('completed_at, xp_earned, habit_id')
      .eq('user_id', req.user.id)
      .gte('completed_at', sevenDaysAgo)
      .order('completed_at', { ascending: false });

    const insight = generateInsight(habits || [], recentLogs || []);

    return res.json({
      insight: insight.message,
      tone: insight.tone,
      habits_count: habits?.length || 0,
      completions_last_7_days: recentLogs?.length || 0,
      generated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[GET /ai/insight]', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateInsight(habits, recentLogs) {
  const completionCount = recentLogs.length;
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.current_streak || 0), 0);

  if (habits.length === 0) {
    return {
      tone: 'welcoming',
      message: "Your adventure begins with a single quest. Add your first habit to start earning XP! 🔷",
    };
  }

  if (completionCount === 0) {
    return {
      tone: 'encouraging',
      message: "The path to Asgard is paved with daily action. Complete a habit today to start your streak! ⚔️",
    };
  }

  if (longestStreak >= 30) {
    return {
      tone: 'celebratory',
      message: `A ${longestStreak}-day streak?! The gods themselves take notice. You are becoming legend. 🏆`,
    };
  }

  if (longestStreak >= 7) {
    return {
      tone: 'proud',
      message: `${longestStreak} days in a row. The dwarves of Svartalfheim would forge you a weapon for such discipline. 🔨`,
    };
  }

  if (completionCount >= 10) {
    return {
      tone: 'fired_up',
      message: "You're on fire this week! Keep the momentum — consistency is what separates warriors from legends. 🔥",
    };
  }

  if (completionCount >= 5) {
    return {
      tone: 'steady',
      message: "Solid week. The XP is stacking. Every completion chips away at the darkness ahead. Keep going. 💎",
    };
  }

  return {
    tone: 'motivating',
    message: "Every quest starts with a single step. Complete your habits today and watch your stats climb. ⚡",
  };
}

module.exports = router;
