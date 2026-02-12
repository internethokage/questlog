const express = require('express');
const router = express.Router();
const { supabase } = require('../index');

// Get user stats
router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError) return res.status(401).json({ error: 'Invalid token' });

    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    // Calculate XP needed for next level per category
    const categories = ['health', 'mind', 'wealth', 'social'];
    const progress = {};

    categories.forEach(cat => {
      const currentLevel = data[`${cat}_level`];
      const currentXP = data[`${cat}_xp`];
      const xpForCurrentLevel = (currentLevel - 1) ** 2 * 100;
      const xpForNextLevel = currentLevel ** 2 * 100;
      const xpIntoLevel = currentXP - xpForCurrentLevel;
      const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;

      progress[cat] = {
        level: currentLevel,
        xp: currentXP,
        xp_into_level: xpIntoLevel,
        xp_needed_for_next: xpNeededForLevel,
        progress_percent: Math.floor((xpIntoLevel / xpNeededForLevel) * 100)
      };
    });

    res.json({
      ...data,
      progress
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
