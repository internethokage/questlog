-- QuestLog Skill Tree Data
-- Four main branches + prestige-locked hybrid branches

-- ============================================
-- THE IRON BRANCH (Health → Strength)
-- ============================================

INSERT INTO skills (skill_key, name, branch, tier, description, lore_text, effect_type, effect_data, required_prestige, required_skill_key, cost) VALUES

-- Tier 1
('iron_unbreakable_oath', 'Unbreakable Oath', 'iron', 1,
  '+10% Max HP',
  'The first Keepers swore oaths in blood. Those who kept them could not fall.',
  'stat_boost',
  '{"max_hp_percent": 10}'::jsonb,
  0, NULL, 1),

('iron_warrior_resolve', 'Warrior''s Resolve', 'iron', 1,
  '+5 Defense',
  'A warrior who shows up daily is harder to break than the strongest blade.',
  'stat_boost',
  '{"defense": 5}'::jsonb,
  0, NULL, 1),

-- Tier 2
('iron_battle_fury', 'Battle Fury', 'iron', 2,
  '+15% Attack Damage when HP < 50%',
  'A cornered warrior fights with the strength of ten.',
  'passive',
  '{"attack_boost_percent": 15, "hp_threshold": 50}'::jsonb,
  0, 'iron_unbreakable_oath', 2),

('iron_endurance_training', 'Endurance Training', 'iron', 2,
  'Regenerate 1% HP per 10 minutes',
  'The body heals when given time and discipline.',
  'passive',
  '{"hp_regen_percent_per_10min": 1}'::jsonb,
  0, 'iron_warrior_resolve', 2),

-- Tier 3
('iron_titan_grip', 'Titan''s Grip', 'iron', 3,
  'Dual-wield weapons (equip 2 at once)',
  'The giants taught us: if one blade is not enough, wield two.',
  'ability_unlock',
  '{"ability": "dual_wield"}'::jsonb,
  0, 'iron_battle_fury', 3),

-- ============================================
-- THE CRYSTAL BRANCH (Mind → Intelligence)
-- ============================================

('crystal_rune_knowledge', 'Rune Knowledge', 'crystal', 1,
  '+10% XP from all sources',
  'The runes hold the secrets of the world. Read them, and grow wiser.',
  'stat_boost',
  '{"xp_gain_percent": 10}'::jsonb,
  0, NULL, 1),

('crystal_scholars_focus', 'Scholar''s Focus', 'crystal', 1,
  '+5 Intelligence',
  'The mind sharpens with daily practice, like any blade.',
  'stat_boost',
  '{"intelligence": 5}'::jsonb,
  0, NULL, 1),

-- Tier 2
('crystal_sight_beyond', 'Sight Beyond Sight', 'crystal', 2,
  'See enemy stats before battle',
  'Odin traded his eye for wisdom. You need only close yours to see.',
  'ability_unlock',
  '{"ability": "enemy_inspect"}'::jsonb,
  0, 'crystal_rune_knowledge', 2),

('crystal_memory_keeper', 'Memory Keeper', 'crystal', 2,
  'Unlock Lore Codex hints',
  'The wise remember their mistakes. The disciplined do not repeat them.',
  'ability_unlock',
  '{"ability": "lore_hints"}'::jsonb,
  0, 'crystal_scholars_focus', 2),

-- Tier 3
('crystal_seidr_mastery', 'Seidr Mastery', 'crystal', 3,
  'Unlock magic attacks (future)',
  'The Vanir taught the Æsir the art of Seidr. Now, you wield it.',
  'ability_unlock',
  '{"ability": "magic_attacks"}'::jsonb,
  0, 'crystal_sight_beyond', 3),

-- ============================================
-- THE GOLDEN BRANCH (Wealth → Luck)
-- ============================================

('golden_midas_touch', 'Midas Touch', 'golden', 1,
  '+20% Gold from battles',
  'The dwarves say: gold flows to those who seek it.',
  'stat_boost',
  '{"gold_gain_percent": 20}'::jsonb,
  0, NULL, 1),

('golden_treasure_sense', 'Treasure Sense', 'golden', 1,
  '+5 Luck',
  'Fortune favors those who show up daily.',
  'stat_boost',
  '{"luck": 5}'::jsonb,
  0, NULL, 1),

-- Tier 2
('golden_gambler_favor', 'Gambler''s Favor', 'golden', 2,
  '+10% Rare loot drop chance',
  'Luck is a fickle mistress. But the disciplined earn her favor.',
  'stat_boost',
  '{"rare_drop_chance_percent": 10}'::jsonb,
  0, 'golden_midas_touch', 2),

('golden_merchant_eye', 'Merchant''s Eye', 'golden', 2,
  'Sell gear for 50% more gold',
  'The dwarves know: true value is earned, not given.',
  'passive',
  '{"sell_price_bonus_percent": 50}'::jsonb,
  0, 'golden_treasure_sense', 2),

-- Tier 3
('golden_dragon_hoard', 'Dragon''s Hoard', 'golden', 3,
  'Find hidden treasure chests (rare battle rewards)',
  'Dragons guard their gold jealously. But they respect a worthy thief.',
  'ability_unlock',
  '{"ability": "treasure_chests"}'::jsonb,
  0, 'golden_gambler_favor', 3),

-- ============================================
-- THE SILVER BRANCH (Social → Charisma)
-- ============================================

('silver_oath_kinship', 'Oath of Kinship', 'silver', 1,
  'Gain +5% XP when guild members complete habits',
  'No warrior climbs Yggdrasil alone. The bonds we forge light the path.',
  'passive',
  '{"guild_xp_bonus_percent": 5}'::jsonb,
  0, NULL, 1),

('silver_diplomat_tongue', 'Diplomat''s Tongue', 'silver', 1,
  '+5 Charisma',
  'Words, like habits, gain power through repetition.',
  'stat_boost',
  '{"charisma": 5}'::jsonb,
  0, NULL, 1),

-- Tier 2
('silver_inspiring_presence', 'Inspiring Presence', 'silver', 2,
  'Guild members gain +5% stats when you are active',
  'A true leader lifts those around them.',
  'passive',
  '{"guild_stat_bonus_percent": 5}'::jsonb,
  0, 'silver_oath_kinship', 2),

('silver_blood_pact', 'Blood Pact', 'silver', 2,
  'Share 10% of loot with guild members',
  'The Einherjar share their spoils. So do you.',
  'passive',
  '{"guild_loot_share_percent": 10}'::jsonb,
  0, 'silver_diplomat_tongue', 2),

-- Tier 3
('silver_valhalla_call', 'Valhalla''s Call', 'silver', 3,
  'Summon NPC allies in boss fights (future)',
  'The Einherjar answer the call of the worthy.',
  'ability_unlock',
  '{"ability": "summon_allies"}'::jsonb,
  0, 'silver_inspiring_presence', 3),

-- ============================================
-- PRESTIGE-LOCKED HYBRID BRANCHES
-- ============================================

-- THE TWILIGHT BRANCH (Strength + Intelligence)
('twilight_spellblade', 'Spellblade', 'twilight', 1,
  'Attacks deal bonus magic damage equal to 50% Intelligence',
  'Where blade and rune meet, legends are born.',
  'passive',
  '{"magic_damage_from_int_percent": 50}'::jsonb,
  1, NULL, 2),

('twilight_runic_strikes', 'Runic Strikes', 'twilight', 2,
  'Melee attacks have 10% chance to stun',
  'Each swing carries the weight of ancient words.',
  'passive',
  '{"stun_chance_percent": 10}'::jsonb,
  1, 'twilight_spellblade', 3),

-- THE EMBER BRANCH (Strength + Luck)
('ember_critical_edge', 'Critical Edge', 'ember', 1,
  '+10% Critical Hit Chance',
  'Luck sharpens the blade as surely as discipline.',
  'stat_boost',
  '{"crit_chance_percent": 10}'::jsonb,
  1, NULL, 2),

('ember_blood_gold', 'Blood & Gold', 'ember', 2,
  'Critical hits drop extra gold',
  'The dwarves say: a perfect strike is worth more than gold. Unless it drops gold.',
  'passive',
  '{"crit_gold_bonus": true}'::jsonb,
  1, 'ember_critical_edge', 3),

-- THE FROSTBOUND BRANCH (Intelligence + Luck)
('frost_ice_shard', 'Ice Shard Mastery', 'frostbound', 1,
  'Magic attacks have 15% chance to freeze enemies',
  'The frost of Niflheim never truly left you.',
  'passive',
  '{"freeze_chance_percent": 15}'::jsonb,
  1, NULL, 2),

('frost_lucky_freeze', 'Fortune''s Frost', 'frostbound', 2,
  'Frozen enemies drop guaranteed loot',
  'When the world stops moving, opportunity appears.',
  'passive',
  '{"frozen_loot_guaranteed": true}'::jsonb,
  1, 'frost_ice_shard', 3);
