
import { Database } from '@/integrations/supabase/types';
import {
  QuestionHistory,
  DifficultyProgression,
  SessionAnalytics,
  QuestDetails,
  AchievementDetails,
  QuizSession,
  StreakData,
  QuizSessionError,
  isQuestDetails,
  isAchievementDetails
} from '@/types/quiz';

export type {
  QuestionHistory,
  DifficultyProgression,
  SessionAnalytics,
  QuestDetails,
  AchievementDetails,
  QuizSession,
  StreakData,
  QuizSessionError
};

export { isQuestDetails, isAchievementDetails };

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

export function validateStreakData(data: any): StreakData {
  if (!data) {
    return {
      lastStreak: 0,
      maxStreak: 0,
      streakHistory: []
    };
  }
  return data;
}
