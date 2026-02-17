-- QuestLog Habit Tracking Fundamentals
-- Streak tracking, flexible scheduling, notifications

-- Add streak tracking to habits
ALTER TABLE habits ADD COLUMN current_streak INT DEFAULT 0;
ALTER TABLE habits ADD COLUMN longest_streak INT DEFAULT 0;
ALTER TABLE habits ADD COLUMN last_completed_at TIMESTAMPTZ;

-- Add notification settings
ALTER TABLE habits ADD COLUMN reminder_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE habits ADD COLUMN reminder_time TIME; -- e.g., '09:00:00' for 9 AM
ALTER TABLE habits ADD COLUMN reminder_days INT[] DEFAULT ARRAY[1,2,3,4,5,6,7]; -- 1=Monday, 7=Sunday

-- Update habit_logs to track streak increments
ALTER TABLE habit_logs ADD COLUMN streak_at_completion INT DEFAULT 0;

-- Function to update streaks when habit is completed
CREATE OR REPLACE FUNCTION update_habit_streak(p_habit_id UUID, p_user_id UUID)
RETURNS INT AS $$
DECLARE
  v_habit RECORD;
  v_last_log RECORD;
  v_new_streak INT;
  v_streak_broken BOOLEAN := FALSE;
BEGIN
  -- Get habit details
  SELECT * INTO v_habit FROM habits WHERE id = p_habit_id AND user_id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  -- Get last completion (excluding today)
  SELECT * INTO v_last_log 
  FROM habit_logs 
  WHERE habit_id = p_habit_id 
    AND user_id = p_user_id
    AND DATE(completed_at) < CURRENT_DATE
  ORDER BY completed_at DESC 
  LIMIT 1;
  
  -- Calculate new streak
  IF v_habit.frequency = 'daily' THEN
    -- Daily habits: check if last completion was yesterday
    IF v_last_log.completed_at IS NULL THEN
      -- First completion ever
      v_new_streak := 1;
    ELSIF DATE(v_last_log.completed_at) = CURRENT_DATE - INTERVAL '1 day' THEN
      -- Completed yesterday, increment streak
      v_new_streak := v_habit.current_streak + 1;
    ELSE
      -- Streak broken, start over
      v_new_streak := 1;
      v_streak_broken := TRUE;
    END IF;
  ELSIF v_habit.frequency = 'weekly' THEN
    -- Weekly habits: check if last completion was within the last week
    IF v_last_log.completed_at IS NULL THEN
      v_new_streak := 1;
    ELSIF v_last_log.completed_at >= CURRENT_DATE - INTERVAL '7 days' THEN
      v_new_streak := v_habit.current_streak + 1;
    ELSE
      v_new_streak := 1;
      v_streak_broken := TRUE;
    END IF;
  ELSE
    -- Custom frequency: just increment (TODO: implement custom logic)
    v_new_streak := v_habit.current_streak + 1;
  END IF;
  
  -- Update habit streaks
  UPDATE habits
  SET 
    current_streak = v_new_streak,
    longest_streak = GREATEST(longest_streak, v_new_streak),
    last_completed_at = NOW(),
    updated_at = NOW()
  WHERE id = p_habit_id;
  
  RETURN v_new_streak;
END;
$$ LANGUAGE plpgsql;

-- Update habit completion endpoint to call streak function
-- (This will be called from the API route after creating habit_log)

-- Create index for streak lookups
CREATE INDEX idx_habits_last_completed ON habits(last_completed_at);
CREATE INDEX idx_habit_logs_date ON habit_logs(user_id, DATE(completed_at));
