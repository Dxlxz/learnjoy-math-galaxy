
import { supabase } from '@/integrations/supabase/client';
import { analyticsQueue } from './analyticsQueue';

export interface QuestDetails {
  session_id: string;
  questions_answered: number;
  correct_answers: number;
  total_questions: number;
  difficulty_level: number;
  time_spent: number;
  start_time: string;
  end_time: string;
}

export interface SessionAchievements {
  perfect_score: boolean;
  speed_bonus: boolean;
  difficulty_mastery: boolean;
}

export interface AchievementDetails {
  streak: number;
  max_streak: number;
  points_earned: number;
  completion_status: string;
  accuracy_rate: number;
  levels_progressed: number;
  total_time: number;
  session_achievements: SessionAchievements;
}

export interface AnalyticsData {
  user_id: string;
  metric_name: string;
  metric_value: number;
  category: string;
  recorded_at: string;
  quest_details: QuestDetails;
  achievement_details: AchievementDetails;
}

