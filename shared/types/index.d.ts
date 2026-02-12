export type HabitCategory = 'health' | 'mind' | 'wealth' | 'social';
export type HabitFrequency = 'daily' | 'weekly' | 'custom';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  category: HabitCategory;
  difficulty: number; // 1-5
  frequency: HabitFrequency;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string;
  notes?: string;
  xp_earned: number;
  created_at: string;
}

export interface UserStats {
  user_id: string;
  total_xp: number;
  health_xp: number;
  mind_xp: number;
  wealth_xp: number;
  social_xp: number;
  health_level: number;
  mind_level: number;
  wealth_level: number;
  social_level: number;
  updated_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: string;
  unlocked_at: string;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryProgress {
  level: number;
  xp: number;
  xp_into_level: number;
  xp_needed_for_next: number;
  progress_percent: number;
}

export interface StatsResponse extends UserStats {
  progress: {
    health: CategoryProgress;
    mind: CategoryProgress;
    wealth: CategoryProgress;
    social: CategoryProgress;
  };
}

// RPG System Types

export type GearType = 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory';
export type GearRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Character {
  user_id: string;
  name: string;
  level: number;
  total_xp: number;
  strength: number;
  intelligence: number;
  luck: number;
  charisma: number;
  current_hp: number;
  max_hp: number;
  attack_power: number;
  defense: number;
  gold: number;
  in_battle: boolean;
  current_enemy_id?: string;
  battle_started_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Gear {
  id: string;
  user_id: string;
  name: string;
  type: GearType;
  rarity: GearRarity;
  stat_bonuses: Record<string, number>;
  equipped: boolean;
  acquired_at: string;
}

export interface Monster {
  id: string;
  name: string;
  level: number;
  hp: number;
  attack_power: number;
  defense: number;
  xp_reward: number;
  gold_min: number;
  gold_max: number;
  loot_table: LootDrop[];
  sprite_key?: string;
  created_at: string;
}

export interface LootDrop {
  name: string;
  type: GearType;
  rarity: GearRarity;
  stat_bonuses: Record<string, number>;
  chance: number;
}

export interface BattleLog {
  id: string;
  user_id: string;
  monster_id?: string;
  monster_name: string;
  monster_level: number;
  victory: boolean;
  damage_dealt: number;
  damage_taken: number;
  xp_gained: number;
  gold_gained: number;
  loot_dropped: Gear[];
  completed_at: string;
}

export interface BattleResult {
  victory: boolean;
  damageDealt: number;
  damageTaken: number;
  xpGained: number;
  goldGained: number;
  loot: Gear[];
  new_hp: number;
  new_gold: number;
}
