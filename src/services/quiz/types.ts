
import { Question } from '@/types/explorer';
import { Json } from '@/integrations/supabase/types';

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
  streak_data: StreakData;
}

export interface QuestionHistory {
  question_id: string;
  difficulty_level: number;
  points_possible: number;
  points_earned: number;
  time_taken: number;
  is_correct: boolean;
  selected_answer: string;
}

export interface SessionAnalytics {
  average_time_per_question: number;
  success_rate: number;
  difficulty_progression: {
    final_difficulty: number;
    time_spent: number;
  };
  current_streak: number;
}

export interface StreakData {
  streakHistory: StreakEntry[];
  lastStreak: number;
}

export interface StreakEntry {
  streak: number;
  timestamp: string;
}

export interface QuizSessionError extends Error {
  code?: string;
  details?: any;
}

// Type validation and conversion utilities
export function validateQuestionHistory(data: Json | null): QuestionHistory[] {
  if (!data || !Array.isArray(data)) return [];
  
  return data.filter((entry): entry is QuestionHistory => {
    return (
      typeof entry === 'object' &&
      typeof entry.question_id === 'string' &&
      typeof entry.difficulty_level === 'number' &&
      typeof entry.points_possible === 'number' &&
      typeof entry.points_earned === 'number' &&
      typeof entry.time_taken === 'number' &&
      typeof entry.is_correct === 'boolean' &&
      typeof entry.selected_answer === 'string'
    );
  });
}

export function validateSessionAnalytics(data: Json | null): SessionAnalytics {
  const defaultAnalytics: SessionAnalytics = {
    average_time_per_question: 0,
    success_rate: 0,
    difficulty_progression: {
      final_difficulty: 1,
      time_spent: 0
    },
    current_streak: 0
  };

  if (!data || typeof data !== 'object') return defaultAnalytics;

  const analytics = data as Record<string, any>;
  
  return {
    average_time_per_question: typeof analytics.average_time_per_question === 'number' 
      ? analytics.average_time_per_question 
      : 0,
    success_rate: typeof analytics.success_rate === 'number' 
      ? analytics.success_rate 
      : 0,
    difficulty_progression: {
      final_difficulty: typeof analytics.difficulty_progression?.final_difficulty === 'number'
        ? analytics.difficulty_progression.final_difficulty
        : 1,
      time_spent: typeof analytics.difficulty_progression?.time_spent === 'number'
        ? analytics.difficulty_progression.time_spent
        : 0
    },
    current_streak: typeof analytics.current_streak === 'number'
      ? analytics.current_streak
      : 0
  };
}

export function validateStreakData(data: Json | null): StreakData {
  const defaultStreakData: StreakData = {
    streakHistory: [],
    lastStreak: 0
  };

  if (!data || typeof data !== 'object') return defaultStreakData;

  const streakData = data as Record<string, any>;
  
  return {
    streakHistory: Array.isArray(streakData.streakHistory)
      ? streakData.streakHistory.filter((entry: any): entry is StreakEntry => 
          typeof entry === 'object' &&
          typeof entry.streak === 'number' &&
          typeof entry.timestamp === 'string'
        )
      : [],
    lastStreak: typeof streakData.lastStreak === 'number' ? streakData.lastStreak : 0
  };
}
