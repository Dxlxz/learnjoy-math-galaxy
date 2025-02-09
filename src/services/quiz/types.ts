
import { Database } from '@/integrations/supabase/types';
import { QuestDetails, AchievementDetails, isQuestDetails, isAchievementDetails } from '@/pages/QuestChronicle/types';

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

// Re-export QuestDetails interface and type guard
export type { QuestDetails };
export { isQuestDetails };

export interface SessionAchievements {
  perfect_score: boolean;
  speed_bonus: boolean;
  difficulty_mastery: boolean;
}

// Re-export AchievementDetails interface and type guard
export type { AchievementDetails };
export { isAchievementDetails };

export interface AnalyticsData {
  user_id: string;
  metric_name: string;
  metric_value: number;
  category: string;
  recorded_at: string;
  quest_details: QuestDetails;
  achievement_details: AchievementDetails;
}

// Type-safe serialization utilities
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

// Validation utilities
export function validateQuestionHistory(history: any): QuestionHistory[] {
  if (!Array.isArray(history)) return [];
  return history;
}

export function validateSessionAnalytics(analytics: any): SessionAnalytics {
  if (!analytics) {
    return {
      average_time_per_question: 0,
      success_rate: 0,
      difficulty_progression: { final_difficulty: 1, time_spent: 0 },
      current_streak: 0
    };
  }
  return analytics;
}

