'use strict';

const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

// All routes require authentication
router.use(requireAuth);

// ─── GET /api/character ───────────────────────────────────────────────────────

/**
 * Get the current user's character with equipped gear.
 */
router.get('/', async (req, res) => {
  try {
    const { data: character, error } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error) throw error;
    if (!character) {
      return res.status(404).json({ error: 'Not Found', message: 'Character not found. Try signing out and back in.' });
    }

    const { data: equippedGear } = await supabase
      .from('gear')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('equipped', true);

    // Fetch realm info
    const { data: realm } = await supabase
      .from('realms')
      .select('name, tier, description, theme_color')
      .eq('realm_key', character.current_realm || 'helheim')
      .single();

    return res.json({
      character,
      equipped_gear: equippedGear || [],
      realm: realm || null,
    });
  } catch (err) {
    console.error('[GET /character]', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── PATCH /api/character/name ────────────────────────────────────────────────

/**
 * Update character name.
 * Body: { name }
 */
router.patch('/name', async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 1 || name.trim().length > 20) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'name must be a string between 1–20 characters',
    });
  }

  try {
    const { data, error } = await supabase
      .from('characters')
      .update({ name: name.trim(), updated_at: new Date().toISOString() })
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    return res.json({ character: data });
  } catch (err) {
    console.error('[PATCH /character/name]', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── GET /api/character/gear ──────────────────────────────────────────────────

/**
 * Get all gear in the user's inventory.
 * Query params: ?equipped=true|false (optional filter)
 */
router.get('/gear', async (req, res) => {
  try {
    let query = supabase
      .from('gear')
      .select('*')
      .eq('user_id', req.user.id)
      .order('acquired_at', { ascending: false });

    if (req.query.equipped === 'true') query = query.eq('equipped', true);
    if (req.query.equipped === 'false') query = query.eq('equipped', false);

    const { data, error } = await query;
    if (error) throw error;

    return res.json({ gear: data || [], count: data?.length || 0 });
  } catch (err) {
    console.error('[GET /character/gear]', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── POST /api/character/gear/:id/equip ──────────────────────────────────────

/**
 * Toggle equip state for a gear item.
 * Unequips any other gear of the same type first.
 */
router.post('/gear/:id/equip', async (req, res) => {
  const gearId = req.params.id;

  try {
    const { data: gear, error: gearError } = await supabase
      .from('gear')
      .select('*')
      .eq('id', gearId)
      .eq('user_id', req.user.id)
      .single();

    if (gearError || !gear) {
      return res.status(404).json({ error: 'Not Found', message: 'Gear item not found' });
    }

    // If equipping, unequip other items of same slot first
    if (!gear.equipped) {
      await supabase
        .from('gear')
        .update({ equipped: false })
        .eq('user_id', req.user.id)
        .eq('type', gear.type);
    }

    const { data: updated, error: updateError } = await supabase
      .from('gear')
      .update({ equipped: !gear.equipped })
      .eq('id', gearId)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Recalculate character stats
    await recalculateCharacterStats(req.user.id);

    return res.json({ gear: updated });
  } catch (err) {
    console.error('[POST /character/gear/:id/equip]', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function recalculateCharacterStats(userId) {
  const { data: userStats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!userStats) return;

  const { data: equippedGear } = await supabase
    .from('gear')
    .select('stat_bonuses')
    .eq('user_id', userId)
    .eq('equipped', true);

  let strength = (userStats.health_level || 1) * 5;
  let intelligence = (userStats.mind_level || 1) * 5;
  let luck = (userStats.wealth_level || 1) * 5;
  let charisma = (userStats.social_level || 1) * 5;
  let attackPower = 10;
  let defense = 5;
  let maxHp = 100;

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

  const totalXp = userStats.total_xp || 0;
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
