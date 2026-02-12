const express = require('express');
const router = express.Router();
const { supabase } = require('../index');

// Get user's character
router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError) return res.status(401).json({ error: 'Invalid token' });

    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    // Get equipped gear
    const { data: gear } = await supabase
      .from('gear')
      .select('*')
      .eq('user_id', user.id)
      .eq('equipped', true);

    res.json({
      character: data,
      equipped_gear: gear || []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update character name
router.patch('/name', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError) return res.status(401).json({ error: 'Invalid token' });

    const { name } = req.body;
    if (!name || name.length < 1 || name.length > 20) {
      return res.status(400).json({ error: 'Name must be 1-20 characters' });
    }

    const { data, error } = await supabase
      .from('characters')
      .update({ name, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's gear inventory
router.get('/gear', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError) return res.status(401).json({ error: 'Invalid token' });

    const { data, error } = await supabase
      .from('gear')
      .select('*')
      .eq('user_id', user.id)
      .order('acquired_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Equip/unequip gear
router.post('/gear/:id/equip', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError) return res.status(401).json({ error: 'Invalid token' });

    const gearId = req.params.id;

    // Get the gear item
    const { data: gear, error: gearError } = await supabase
      .from('gear')
      .select('*')
      .eq('id', gearId)
      .eq('user_id', user.id)
      .single();

    if (gearError) throw gearError;

    // If equipping, unequip any gear of same type first
    if (!gear.equipped) {
      await supabase
        .from('gear')
        .update({ equipped: false })
        .eq('user_id', user.id)
        .eq('type', gear.type);
    }

    // Toggle equip state
    const { data, error } = await supabase
      .from('gear')
      .update({ equipped: !gear.equipped })
      .eq('id', gearId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    // Recalculate character stats based on equipped gear
    await recalculateCharacterStats(user.id);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper function to recalculate character stats from equipped gear
async function recalculateCharacterStats(userId) {
  // Get base stats from user_stats (XP-based levels)
  const { data: userStats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  // Get equipped gear
  const { data: equippedGear } = await supabase
    .from('gear')
    .select('*')
    .eq('user_id', userId)
    .eq('equipped', true);

  // Base stats from habit levels
  let strength = userStats.health_level * 5;
  let intelligence = userStats.mind_level * 5;
  let luck = userStats.wealth_level * 5;
  let charisma = userStats.social_level * 5;
  let attackPower = 10;
  let defense = 5;
  let maxHp = 100;

  // Apply gear bonuses
  equippedGear?.forEach(item => {
    const bonuses = item.stat_bonuses || {};
    strength += bonuses.strength || 0;
    intelligence += bonuses.intelligence || 0;
    luck += bonuses.luck || 0;
    charisma += bonuses.charisma || 0;
    attackPower += bonuses.attack_power || 0;
    defense += bonuses.defense || 0;
    maxHp += bonuses.max_hp || 0;
  });

  // Calculate character level from total XP
  const totalXp = userStats.total_xp || 0;
  const characterLevel = Math.floor(Math.sqrt(totalXp / 100)) + 1;

  // Update character
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
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);
}

module.exports = router;
