
import { Question } from '@/types/explorer';

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
