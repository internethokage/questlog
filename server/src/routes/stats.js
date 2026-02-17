'use strict';

const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

const CATEGORIES = ['health', 'mind', 'wealth', 'social'];

const CATEGORY_STAT = {
  health: 'strength',
  mind: 'intelligence',
  wealth: 'luck',
  social: 'charisma',
};

// ─── GET /api/stats ───────────────────────────────────────────────────────────

/**
 * Get full stats for the current user.
 * Includes per-category XP progress + character overview.
 */
router.get('/', async (req, res) => {
  try {
    const { data: stats, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error) throw error;
    if (!stats) {
      return res.status(404).json({ error: 'Not Found', message: 'Stats not found' });
    }

    // Calculate per-category XP progress to next level
    const progress = {};
    for (const cat of CATEGORIES) {
      const currentLevel = stats[`${cat}_level`] || 1;
      const currentXP = stats[`${cat}_xp`] || 0;
      const xpForCurrentLevel = (currentLevel - 1) ** 2 * 100;
      const xpForNextLevel = currentLevel ** 2 * 100;
      const xpIntoLevel = currentXP - xpForCurrentLevel;
      const xpNeeded = xpForNextLevel - xpForCurrentLevel;

      progress[cat] = {
        level: currentLevel,
        xp: currentXP,
        stat: CATEGORY_STAT[cat],
        xp_into_level: Math.max(0, xpIntoLevel),
        xp_needed_for_next: xpNeeded,
        progress_percent: Math.min(100, Math.floor((Math.max(0, xpIntoLevel) / xpNeeded) * 100)),
      };
    }

    return res.json({ stats, progress });
  } catch (err) {
    console.error('[GET /stats]', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

module.exports = router;
