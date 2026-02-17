-- QuestLog Idle RPG System
-- Add character, gear, battles, and monsters

-- Characters (one per user, auto-created on signup)
CREATE TABLE characters (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Adventurer',
  level INT DEFAULT 1,
  total_xp INT DEFAULT 0,
  
  -- Stats (boosted by habit categories)
  strength INT DEFAULT 10,      -- Health habits
  intelligence INT DEFAULT 10,  -- Mind habits
  luck INT DEFAULT 10,          -- Wealth habits
  charisma INT DEFAULT 10,      -- Social habits
  
  -- Combat stats
  current_hp INT DEFAULT 100,
  max_hp INT DEFAULT 100,
  attack_power INT DEFAULT 10,
  defense INT DEFAULT 5,
  
  -- Resources
  gold INT DEFAULT 0,
  
  -- Current battle state
  in_battle BOOLEAN DEFAULT FALSE,
  current_enemy_id UUID,
  battle_started_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own character"
  ON characters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own character"
  ON characters FOR UPDATE
  USING (auth.uid() = user_id);

-- Gear items
CREATE TABLE gear (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('weapon', 'armor', 'helmet', 'boots', 'accessory')),
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  
  -- Stat bonuses (JSON for flexibility)
  stat_bonuses JSONB DEFAULT '{}'::jsonb,
  -- Example: {"strength": 10, "attack_power": 5}
  
  equipped BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  acquired_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE gear ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own gear"
  ON gear FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own gear"
  ON gear FOR UPDATE
  USING (auth.uid() = user_id);

-- Monster templates (global, not user-specific)
CREATE TABLE monsters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  level INT NOT NULL,
  
  -- Combat stats
  hp INT NOT NULL,
  attack_power INT NOT NULL,
  defense INT NOT NULL,
  
  -- Rewards
  xp_reward INT NOT NULL,
  gold_min INT DEFAULT 0,
  gold_max INT DEFAULT 0,
  
  -- Loot table (JSON array of possible drops)
  loot_table JSONB DEFAULT '[]'::jsonb,
  -- Example: [{"name": "Iron Sword", "type": "weapon", "rarity": "common", "chance": 0.3}]
  
  -- Visual
  sprite_key TEXT, -- Reference to pixel art asset
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- No RLS on monsters (global read-only data)
ALTER TABLE monsters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view monsters"
  ON monsters FOR SELECT
  TO authenticated
  USING (true);

-- Battle log (record of completed battles)
CREATE TABLE battle_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Battle details
  monster_id UUID REFERENCES monsters(id),
  monster_name TEXT NOT NULL,
  monster_level INT NOT NULL,
  
  -- Outcome
  victory BOOLEAN NOT NULL,
  damage_dealt INT DEFAULT 0,
  damage_taken INT DEFAULT 0,
  
  -- Rewards
  xp_gained INT DEFAULT 0,
  gold_gained INT DEFAULT 0,
  loot_dropped JSONB DEFAULT '[]'::jsonb,
  
  -- Timestamp
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE battle_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own battle log"
  ON battle_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create battle log entries"
  ON battle_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_gear_user_id ON gear(user_id);
CREATE INDEX idx_gear_equipped ON gear(user_id, equipped);
CREATE INDEX idx_battle_log_user_id ON battle_log(user_id);
CREATE INDEX idx_battle_log_completed_at ON battle_log(completed_at DESC);
CREATE INDEX idx_monsters_level ON monsters(level);

-- Update handle_new_user function to create character
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'avatar_url');
  
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  
  INSERT INTO public.characters (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'Adventurer'));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed some starter monsters
INSERT INTO monsters (name, level, hp, attack_power, defense, xp_reward, gold_min, gold_max, loot_table, sprite_key) VALUES
('Slime', 1, 30, 5, 2, 10, 1, 5, '[{"name": "Rusty Dagger", "type": "weapon", "rarity": "common", "stat_bonuses": {"attack_power": 2}, "chance": 0.1}]', 'slime'),
('Goblin', 2, 50, 8, 3, 20, 5, 15, '[{"name": "Leather Armor", "type": "armor", "rarity": "common", "stat_bonuses": {"defense": 3}, "chance": 0.15}]', 'goblin'),
('Wolf', 3, 70, 12, 5, 35, 10, 25, '[{"name": "Sharp Claws", "type": "weapon", "rarity": "uncommon", "stat_bonuses": {"attack_power": 5}, "chance": 0.2}]', 'wolf'),
('Orc Warrior', 5, 120, 18, 8, 60, 20, 50, '[{"name": "Iron Sword", "type": "weapon", "rarity": "uncommon", "stat_bonuses": {"attack_power": 8, "strength": 3}, "chance": 0.25}]', 'orc'),
('Dark Knight', 8, 200, 30, 15, 120, 50, 100, '[{"name": "Steel Armor", "type": "armor", "rarity": "rare", "stat_bonuses": {"defense": 10, "max_hp": 20}, "chance": 0.3}]', 'dark_knight'),
('Dragon', 15, 500, 60, 25, 300, 200, 500, '[{"name": "Dragon Scale Shield", "type": "armor", "rarity": "epic", "stat_bonuses": {"defense": 25, "max_hp": 50}, "chance": 0.4}]', 'dragon');
