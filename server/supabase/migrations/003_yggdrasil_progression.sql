-- QuestLog Yggdrasil Progression System
-- Realms, Prestige, Skill Trees, Lore Codex

-- Update characters table with realm progression
ALTER TABLE characters ADD COLUMN current_realm TEXT DEFAULT 'helheim';
ALTER TABLE characters ADD COLUMN realm_level INT DEFAULT 1;
ALTER TABLE characters ADD COLUMN prestige_count INT DEFAULT 0;
ALTER TABLE characters ADD COLUMN skill_points INT DEFAULT 0;

-- Realms reference (static data, for UI/logic)
CREATE TABLE realms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  realm_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tier INT NOT NULL, -- 1=roots, 2=trunk, 3=canopy, 4=crown
  min_level INT NOT NULL,
  max_level INT NOT NULL,
  description TEXT,
  lore_intro TEXT,
  theme_color TEXT, -- hex color for UI
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed realms (The Nine Realms)
INSERT INTO realms (realm_key, name, tier, min_level, max_level, description, lore_intro, theme_color) VALUES
-- Tier 1: The Roots
('helheim', 'Helheim', 1, 1, 3, 'Realm of the Dead', 'You awaken in the mists of Helheim. You were once a Keeper, but you fell. This is your purgatory. Prove yourself worthy to climb.', '#1a1a2e'),
('niflheim', 'Niflheim', 1, 4, 5, 'Realm of Mist & Ice', 'The mists part. You have proven you are not dead... yet. But Niflheim tests endurance. Many freeze here, mid-climb.', '#2d4059'),

-- Tier 2: The Trunk
('svartalfheim', 'Svartalfheim', 2, 6, 9, 'Realm of the Dwarves', 'The dwarves once forged weapons for the gods. Now they hoard their secrets. Prove your worth, and they may share.', '#6b4423'),
('midgard', 'Midgard', 2, 10, 13, 'Realm of Mortals', 'You have reached the mortal realm. This is where you fell before. Will you fall again?', '#4a7c59'),
('jotunheim', 'Jotunheim', 2, 14, 17, 'Realm of Giants', 'The giants test strength. Discipline alone will not save you here. You must be strong.', '#596e79'),

-- Tier 3: The Canopy
('alfheim', 'Alfheim', 3, 18, 22, 'Realm of the Light Elves', 'The light elves demand perfection. They do not forgive failure. Many climbers turn back here, blinded by their own inadequacy.', '#f4e4c1'),
('vanaheim', 'Vanaheim', 3, 23, 27, 'Realm of the Vanir', 'The Vanir remember the old alliances. They test your bonds, your word. A lone warrior cannot pass here.', '#3a5a40'),
('muspelheim', 'Muspelheim', 3, 28, 32, 'Realm of Fire', 'At the top of Yggdrasil, fire rages. This is the forge where gods are tempered. Only the disciplined survive.', '#d62828'),

-- Tier 4: The Crown
('asgard', 'Asgard', 4, 33, 40, 'Realm of the Gods', 'You have reached the Hall of the Gods. But you are not yet worthy of Valhalla. Face the final trials.', '#ffd700');

-- Skill Tree System
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  branch TEXT NOT NULL, -- iron, crystal, golden, silver, twilight, ember, frostbound
  tier INT NOT NULL, -- 1, 2, 3
  description TEXT,
  lore_text TEXT,
  effect_type TEXT, -- stat_boost, ability_unlock, passive
  effect_data JSONB, -- e.g., {"max_hp_percent": 10} or {"attack_damage_percent": 15}
  required_prestige INT DEFAULT 0, -- 0 = available from start, 1+ = prestige locked
  required_skill_key TEXT, -- prerequisite skill (for tree progression)
  cost INT DEFAULT 1, -- skill points needed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User skill unlocks
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_key TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_key)
);

ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own skills"
  ON user_skills FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock their own skills"
  ON user_skills FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Lore Codex (collected fragments)
CREATE TABLE lore_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lore_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT, -- gear, battle, realm, achievement, hidden
  text TEXT NOT NULL,
  unlock_trigger TEXT, -- e.g., 'defeat_dragon', 'equip_gungir_echo', 'reach_asgard'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_lore (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lore_key TEXT NOT NULL,
  discovered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lore_key)
);

ALTER TABLE user_lore ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own lore"
  ON user_lore FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can discover lore"
  ON user_lore FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update gear table with lore
ALTER TABLE gear ADD COLUMN lore_text TEXT;

-- Update battle_log with lore drops
ALTER TABLE battle_log ADD COLUMN lore_fragment TEXT;

-- Update monsters with realm assignment
ALTER TABLE monsters ADD COLUMN realm_key TEXT DEFAULT 'helheim';

-- Update existing monsters to assign realms
UPDATE monsters SET realm_key = 'helheim' WHERE level <= 3;
UPDATE monsters SET realm_key = 'niflheim' WHERE level > 3 AND level <= 5;
UPDATE monsters SET realm_key = 'svartalfheim' WHERE level > 5 AND level <= 9;
UPDATE monsters SET realm_key = 'midgard' WHERE level > 9 AND level <= 13;
UPDATE monsters SET realm_key = 'jotunheim' WHERE level > 13 AND level <= 17;
UPDATE monsters SET realm_key = 'alfheim' WHERE level > 17 AND level <= 22;
UPDATE monsters SET realm_key = 'vanaheim' WHERE level > 22 AND level <= 27;
UPDATE monsters SET realm_key = 'muspelheim' WHERE level > 27 AND level <= 32;
UPDATE monsters SET realm_key = 'asgard' WHERE level > 32;

-- Indexes
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_lore_user_id ON user_lore(user_id);
CREATE INDEX idx_realms_tier ON realms(tier);
CREATE INDEX idx_monsters_realm ON monsters(realm_key);

-- Function to check and update realm progression
CREATE OR REPLACE FUNCTION check_realm_progression(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_character RECORD;
  v_new_realm TEXT;
BEGIN
  -- Get current character
  SELECT * INTO v_character FROM characters WHERE user_id = p_user_id;
  
  -- Check if level qualifies for new realm
  SELECT realm_key INTO v_new_realm
  FROM realms
  WHERE v_character.level >= min_level
    AND v_character.level <= max_level
  ORDER BY tier DESC, min_level DESC
  LIMIT 1;
  
  -- Update if changed
  IF v_new_realm IS NOT NULL AND v_new_realm != v_character.current_realm THEN
    UPDATE characters
    SET current_realm = v_new_realm,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    RETURN v_new_realm;
  END IF;
  
  RETURN v_character.current_realm;
END;
$$ LANGUAGE plpgsql;

-- Trigger prestige (called when defeating final Asgard boss)
CREATE OR REPLACE FUNCTION trigger_prestige(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  -- Increment prestige count
  UPDATE characters
  SET prestige_count = prestige_count + 1,
      current_realm = 'helheim',
      level = 1,
      realm_level = 1,
      current_hp = max_hp,
      skill_points = skill_points + 5, -- Award 5 skill points per prestige
      updated_at = NOW()
  WHERE user_id = p_user_id
  RETURNING jsonb_build_object(
    'prestige_count', prestige_count,
    'skill_points_awarded', 5
  ) INTO v_result;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;
