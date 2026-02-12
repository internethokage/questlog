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
