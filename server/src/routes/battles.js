const express = require('express');
const router = express.Router();
const { supabase } = require('../index');

// Get battle log
router.get('/log', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError) return res.status(401).json({ error: 'Invalid token' });

    const limit = parseInt(req.query.limit) || 20;

    const { data, error } = await supabase
      .from('battle_log')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start a new battle (manual, for now - will be auto later)
router.post('/start', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError) return res.status(401).json({ error: 'Invalid token' });

    // Get character
    const { data: character, error: charError } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (charError) throw charError;

    if (character.in_battle) {
      return res.status(400).json({ error: 'Already in battle' });
    }

    // Find suitable monster (level based on character level)
    const { data: monsters, error: monsterError } = await supabase
      .from('monsters')
      .select('*')
      .gte('level', Math.max(1, character.level - 2))
      .lte('level', character.level + 3)
      .limit(5);

    if (monsterError) throw monsterError;

    // Pick random monster from suitable range
    const monster = monsters[Math.floor(Math.random() * monsters.length)];

    // Update character state
    await supabase
      .from('characters')
      .update({
        in_battle: true,
        current_enemy_id: monster.id,
        battle_started_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    res.json({
      monster,
      message: `Battle started against ${monster.name}!`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Process battle (auto-resolve for idle gameplay)
router.post('/resolve', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError) return res.status(401).json({ error: 'Invalid token' });

    // Get character
    const { data: character, error: charError } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (charError) throw charError;

    if (!character.in_battle) {
      return res.status(400).json({ error: 'Not in battle' });
    }

    // Get monster
    const { data: monster, error: monsterError } = await supabase
      .from('monsters')
      .select('*')
      .eq('id', character.current_enemy_id)
      .single();

    if (monsterError) throw monsterError;

    // Simple combat simulation
    const battleResult = simulateBattle(character, monster);

    // Update character
    const newHp = Math.max(0, character.current_hp - battleResult.damageTaken);
    const newGold = character.gold + battleResult.goldGained;

    await supabase
      .from('characters')
      .update({
        in_battle: false,
        current_enemy_id: null,
        battle_started_at: null,
        current_hp: newHp,
        gold: newGold,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    // Award XP to user_stats
    if (battleResult.victory) {
      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const newTotalXp = (stats.total_xp || 0) + battleResult.xpGained;

      await supabase
        .from('user_stats')
        .update({
          total_xp: newTotalXp,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
    }

    // Award loot
    let lootDropped = [];
    if (battleResult.victory && battleResult.loot.length > 0) {
      for (const item of battleResult.loot) {
        const { data: newGear } = await supabase
          .from('gear')
          .insert([{
            user_id: user.id,
            name: item.name,
            type: item.type,
            rarity: item.rarity,
            stat_bonuses: item.stat_bonuses
          }])
          .select()
          .single();

        lootDropped.push(newGear);
      }
    }

    // Log the battle
    await supabase
      .from('battle_log')
      .insert([{
        user_id: user.id,
        monster_id: monster.id,
        monster_name: monster.name,
        monster_level: monster.level,
        victory: battleResult.victory,
        damage_dealt: battleResult.damageDealt,
        damage_taken: battleResult.damageTaken,
        xp_gained: battleResult.xpGained,
        gold_gained: battleResult.goldGained,
        loot_dropped: lootDropped
      }]);

    res.json({
      ...battleResult,
      loot: lootDropped,
      new_hp: newHp,
      new_gold: newGold
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Simple battle simulation
function simulateBattle(character, monster) {
  let charHp = character.current_hp;
  let monsterHp = monster.hp;
  let damageDealt = 0;
  let damageTaken = 0;

  // Simple turn-based combat (auto-resolve)
  while (charHp > 0 && monsterHp > 0) {
    // Character attacks
    const charDamage = Math.max(1, character.attack_power - monster.defense);
    monsterHp -= charDamage;
    damageDealt += charDamage;

    if (monsterHp <= 0) break;

    // Monster attacks
    const monsterDamage = Math.max(1, monster.attack_power - character.defense);
    charHp -= monsterDamage;
    damageTaken += monsterDamage;
  }

  const victory = monsterHp <= 0;
  let xpGained = 0;
  let goldGained = 0;
  let loot = [];

  if (victory) {
    xpGained = monster.xp_reward;
    goldGained = Math.floor(Math.random() * (monster.gold_max - monster.gold_min + 1)) + monster.gold_min;

    // Loot roll
    const lootTable = monster.loot_table || [];
    lootTable.forEach(item => {
      if (Math.random() < item.chance) {
        loot.push(item);
      }
    });
  }

  return {
    victory,
    damageDealt,
    damageTaken,
    xpGained,
    goldGained,
    loot
  };
}

// Get available monsters (for UI display)
router.get('/monsters', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('monsters')
      .select('*')
      .order('level', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
