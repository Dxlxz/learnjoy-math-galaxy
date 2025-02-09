
import { supabase } from '@/integrations/supabase/client';
import { analyticsQueue } from './analyticsQueue';

export interface QuestionHistory {
  question_id: string;
  difficulty_level: number;
  points_possible: number;
  points_earned: number;
  time_taken: number;
  is_correct: boolean;
  selected_answer: string;
}

export interface DifficultyProgression {
  final_difficulty: number;
  time_spent: number;
}

export interface SessionAnalytics {
  average_time_per_question: number;
  success_rate: number;
  difficulty_progression: DifficultyProgression;
  current_streak: number;
}

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

export interface QuizSession {
  id: string;
  user_id: string;
  topic_id: string;
  questions_answered: number;
  correct_answers: number;
  final_score: number;
  status: 'in_progress' | 'completed' | 'interrupted';
  question_history: QuestionHistory[];
  analytics_data: SessionAnalytics;
  current_streak: number;
  max_streak: number;
  streak_data?: {
    streakHistory: Array<{ streak: number; timestamp: string }>;
    lastStreak: number;
  };
}

export interface QuizSessionError extends Error {
  code?: string;
  details?: string;
}

// Utility functions to safely convert data to JSON strings
export function serializeQuestionHistory(history: QuestionHistory[]): string {
  try {
    return JSON.stringify(history);
  } catch (error) {
    console.error('[Quiz Types] Error serializing question history:', error);
    return '[]';
  }
}

export function serializeSessionAnalytics(analytics: SessionAnalytics): string {
  try {
    return JSON.stringify(analytics);
  } catch (error) {
    console.error('[Quiz Types] Error serializing session analytics:', error);
    return JSON.stringify({
      average_time_per_question: 0,
      success_rate: 0,
      difficulty_progression: { final_difficulty: 1, time_spent: 0 },
      current_streak: 0
    });
  }
}

export const validateQuestionHistory = (history: any): QuestionHistory[] => {
  if (!history) return [];
  try {
    return Array.isArray(history) ? history : [];
  } catch {
    return [];
  }
};

export const validateSessionAnalytics = (analytics: any): SessionAnalytics => {
  if (!analytics) {
    return {
      average_time_per_question: 0,
      success_rate: 0,
      difficulty_progression: {
        final_difficulty: 1,
        time_spent: 0
      },
      current_streak: 0
    };
  }
  return analytics;
};

export const validateStreakData = (data: any): { streakHistory: Array<{ streak: number; timestamp: string }>; lastStreak: number } => {
  if (!data) {
    return {
      streakHistory: [],
      lastStreak: 0
    };
  }
  return data;
};
