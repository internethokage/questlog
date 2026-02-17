'use strict';

const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// ─── GET /api/battles/log ─────────────────────────────────────────────────────

/**
 * Get the user's battle history.
 * Query params: ?limit=20 (max 100)
 */
router.get('/log', async (req, res) => {
  try {
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));

    const { data, error } = await supabase
      .from('battle_log')
      .select('*')
      .eq('user_id', req.user.id)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return res.json({ battles: data || [], count: data?.length || 0 });
  } catch (err) {
    console.error('[GET /battles/log]', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── GET /api/battles/monsters ────────────────────────────────────────────────

/**
 * Get all available monsters (global data, no auth needed but keeping consistent).
 * Query params: ?realm=helheim (optional filter by realm)
 */
router.get('/monsters', async (req, res) => {
  try {
    let query = supabase.from('monsters').select('*').order('level', { ascending: true });

    if (req.query.realm) {
      query = query.eq('realm_key', req.query.realm);
    }

    const { data, error } = await query;
    if (error) throw error;

    return res.json({ monsters: data || [] });
  } catch (err) {
    console.error('[GET /battles/monsters]', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── POST /api/battles/start ──────────────────────────────────────────────────

/**
 * Start a new battle (manual trigger for idle combat).
 */
router.post('/start', async (req, res) => {
  try {
    const { data: character, error: charError } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (charError || !character) {
      return res.status(404).json({ error: 'Not Found', message: 'Character not found' });
    }

    if (character.in_battle) {
      return res.status(409).json({
        error: 'Already In Battle',
        message: 'Resolve your current battle before starting a new one',
      });
    }

    // Find monsters appropriate for current character level
    const minLevel = Math.max(1, character.level - 2);
    const maxLevel = character.level + 3;

    const { data: monsters, error: monsterError } = await supabase
      .from('monsters')
      .select('*')
      .gte('level', minLevel)
      .lte('level', maxLevel);

    if (monsterError) throw monsterError;

    if (!monsters || monsters.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: 'No suitable monsters found for your level' });
    }

    const monster = monsters[Math.floor(Math.random() * monsters.length)];

    await supabase
      .from('characters')
      .update({
        in_battle: true,
        current_enemy_id: monster.id,
        battle_started_at: new Date().toISOString(),
      })
      .eq('user_id', req.user.id);

    return res.json({
      monster,
      message: `⚔️ Battle started against ${monster.name} (Lv. ${monster.level})!`,
    });
  } catch (err) {
    console.error('[POST /battles/start]', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── POST /api/battles/resolve ────────────────────────────────────────────────

/**
 * Auto-resolve the current battle (idle mechanic).
 */
router.post('/resolve', async (req, res) => {
  try {
    const { data: character, error: charError } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (charError || !character) {
      return res.status(404).json({ error: 'Not Found', message: 'Character not found' });
    }

    if (!character.in_battle) {
      return res.status(409).json({
        error: 'Not In Battle',
        message: 'Start a battle first',
      });
    }

    const { data: monster, error: monsterError } = await supabase
      .from('monsters')
      .select('*')
      .eq('id', character.current_enemy_id)
      .single();

    if (monsterError || !monster) {
      // Clean up bad state
      await supabase
        .from('characters')
        .update({ in_battle: false, current_enemy_id: null, battle_started_at: null })
        .eq('user_id', req.user.id);
      return res.status(404).json({ error: 'Not Found', message: 'Battle monster not found; battle cancelled' });
    }

    const result = simulateBattle(character, monster);

    const newHp = Math.max(0, character.current_hp - result.damageTaken);
    const newGold = character.gold + result.goldGained;

    // Update character
    await supabase
      .from('characters')
      .update({
        in_battle: false,
        current_enemy_id: null,
        battle_started_at: null,
        current_hp: newHp,
        gold: newGold,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', req.user.id);

    // Award XP to user_stats on victory
    if (result.victory) {
      const { data: stats } = await supabase
        .from('user_stats')
        .select('total_xp')
        .eq('user_id', req.user.id)
        .single();

      await supabase
        .from('user_stats')
        .update({
          total_xp: (stats?.total_xp || 0) + result.xpGained,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', req.user.id);
    }

    // Drop loot
    const lootDropped = [];
    if (result.victory && result.loot.length > 0) {
      for (const item of result.loot) {
        const { data: newGear } = await supabase
          .from('gear')
          .insert([{
            user_id: req.user.id,
            name: item.name,
            type: item.type,
            rarity: item.rarity,
            stat_bonuses: item.stat_bonuses || {},
          }])
          .select()
          .single();

        if (newGear) lootDropped.push(newGear);
      }
    }

    // Log the battle
    await supabase.from('battle_log').insert([{
      user_id: req.user.id,
      monster_id: monster.id,
      monster_name: monster.name,
      monster_level: monster.level,
      victory: result.victory,
      damage_dealt: result.damageDealt,
      damage_taken: result.damageTaken,
      xp_gained: result.xpGained,
      gold_gained: result.goldGained,
      loot_dropped: lootDropped,
    }]);

    return res.json({
      victory: result.victory,
      damage_dealt: result.damageDealt,
      damage_taken: result.damageTaken,
      xp_gained: result.xpGained,
      gold_gained: result.goldGained,
      loot: lootDropped,
      new_hp: newHp,
      new_gold: newGold,
      message: result.victory
        ? `🏆 Victory! Defeated ${monster.name} for ${result.xpGained} XP and ${result.goldGained} gold.`
        : `💀 Defeated by ${monster.name}. Better luck next time.`,
    });
  } catch (err) {
    console.error('[POST /battles/resolve]', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── Combat Simulation ────────────────────────────────────────────────────────

function simulateBattle(character, monster) {
  let charHp = character.current_hp;
  let monsterHp = monster.hp;
  let damageDealt = 0;
  let damageTaken = 0;
  const MAX_ROUNDS = 100; // prevent infinite loops
  let round = 0;

  while (charHp > 0 && monsterHp > 0 && round < MAX_ROUNDS) {
    round++;
    // Character attacks first
    const charDamage = Math.max(1, character.attack_power - monster.defense);
    monsterHp -= charDamage;
    damageDealt += charDamage;
    if (monsterHp <= 0) break;

    // Monster retaliates
    const monsterDamage = Math.max(1, monster.attack_power - character.defense);
    charHp -= monsterDamage;
    damageTaken += monsterDamage;
  }

  const victory = monsterHp <= 0;
  let xpGained = 0;
  let goldGained = 0;
  const loot = [];

  if (victory) {
    xpGained = monster.xp_reward;
    goldGained =
      Math.floor(Math.random() * (monster.gold_max - monster.gold_min + 1)) + monster.gold_min;

    const lootTable = monster.loot_table || [];
    for (const item of lootTable) {
      if (Math.random() < item.chance) {
        loot.push(item);
      }
    }
  }

  return { victory, damageDealt, damageTaken, xpGained, goldGained, loot };
}

module.exports = router;
