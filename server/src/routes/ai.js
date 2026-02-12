const express = require('express');
const router = express.Router();
const { supabase } = require('../index');

// Get AI daily insight
router.get('/insight', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError) return res.status(401).json({ error: 'Invalid token' });

    // Get user's habits and recent logs
    const { data: habits } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .eq('archived', false);

    const { data: recentLogs } = await supabase
      .from('habit_logs')
      .select('*, habits(name, category)')
      .eq('user_id', user.id)
      .gte('completed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('completed_at', { ascending: false });

    // TODO: Call AI API (OpenAI/Anthropic) to generate insight
    // For MVP, return canned responses based on simple logic

    let insight = '';
    
    if (!recentLogs || recentLogs.length === 0) {
      insight = "Ready to start your quest? Complete your first habit today! 🔷";
    } else if (recentLogs.length >= 5) {
      insight = "You're on fire! Keep up the momentum and watch your XP soar! 🔥";
    } else {
      insight = "Every quest starts with a single step. Keep pushing forward! ⚔️";
    }

    res.json({
      insight,
      habits_count: habits?.length || 0,
      completions_last_7_days: recentLogs?.length || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
