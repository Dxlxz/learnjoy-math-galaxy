
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

export function questionHistoryToJson(history: QuestionHistory): Record<string, Json> {
  return {
    question_id: history.question_id,
    difficulty_level: history.difficulty_level,
    points_possible: history.points_possible,
    points_earned: history.points_earned,
    time_taken: history.time_taken,
    is_correct: history.is_correct,
    selected_answer: history.selected_answer
  };
}

export function validateQuestionHistory(data: Json | Json[]): QuestionHistory[] {
  if (!Array.isArray(data)) return [];
  
  return data.filter((entry): entry is QuestionHistory => {
    if (typeof entry !== 'object' || entry === null) return false;
    
    const e = entry as Record<string, unknown>;
    return (
      typeof e.question_id === 'string' &&
      typeof e.difficulty_level === 'number' &&
      typeof e.points_possible === 'number' &&
      typeof e.points_earned === 'number' &&
      typeof e.time_taken === 'number' &&
      typeof e.is_correct === 'boolean' &&
      typeof e.selected_answer === 'string'
    );
  });
}

export function validateSessionAnalytics(data: Json): SessionAnalytics {
  const defaultAnalytics: SessionAnalytics = {
    average_time_per_question: 0,
    success_rate: 0,
    difficulty_progression: {
      final_difficulty: 1,
      time_spent: 0
    },
    current_streak: 0
  };

  if (!data || typeof data !== 'object' || data === null) return defaultAnalytics;

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

export function sessionAnalyticsToJson(analytics: SessionAnalytics): Record<string, Json> {
  return {
    average_time_per_question: analytics.average_time_per_question,
    success_rate: analytics.success_rate,
    difficulty_progression: {
      final_difficulty: analytics.difficulty_progression.final_difficulty,
      time_spent: analytics.difficulty_progression.time_spent
    },
    current_streak: analytics.current_streak
  };
}

export function streakDataToJson(data: StreakData): Record<string, Json> {
  return {
    streakHistory: data.streakHistory.map(entry => ({
      streak: entry.streak,
      timestamp: entry.timestamp
    })),
    lastStreak: data.lastStreak
  };
}

export function validateStreakData(data: Json): StreakData {
  const defaultStreakData: StreakData = {
    streakHistory: [],
    lastStreak: 0
  };

  if (!data || typeof data !== 'object' || data === null) return defaultStreakData;

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
