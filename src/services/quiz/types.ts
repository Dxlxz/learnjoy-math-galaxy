
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

// Convert database JSON to QuestionHistory array with type safety
export function validateQuestionHistory(data: Json): QuestionHistory[] {
  if (!data || !Array.isArray(data)) return [];
  
  return data.filter((entry): entry is QuestionHistory => {
    if (typeof entry !== 'object' || entry === null) return false;
    
    return (
      typeof (entry as any).question_id === 'string' &&
      typeof (entry as any).difficulty_level === 'number' &&
      typeof (entry as any).points_possible === 'number' &&
      typeof (entry as any).points_earned === 'number' &&
      typeof (entry as any).time_taken === 'number' &&
      typeof (entry as any).is_correct === 'boolean' &&
      typeof (entry as any).selected_answer === 'string'
    );
  });
}

// Convert database JSON to SessionAnalytics with type safety
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

// Convert database JSON to StreakData with type safety
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

// Convert SessionAnalytics to database JSON format
export function sessionAnalyticsToJson(analytics: SessionAnalytics): Json {
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

