
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
  topic_id: string;
}

export interface AchievementDetails {
  streak: number;
  max_streak: number;
  points_earned: number;
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
  status: 'in_progress' | 'completed';
  question_history: QuestionHistory[];
  analytics_data: SessionAnalytics;
  current_streak: number;
  max_streak: number;
  streak_data: StreakData;
}

export interface StreakData {
  lastStreak: number;
  maxStreak: number;
  streakHistory: Array<{ streak: number; timestamp: string }>;
}

export interface QuizSessionError extends Error {
  code?: string;
  details?: string;
}

export const isQuestDetails = (obj: any): obj is QuestDetails => {
  return obj 
    && typeof obj === 'object'
    && typeof obj.session_id === 'string'
    && typeof obj.questions_answered === 'number'
    && typeof obj.correct_answers === 'number'
    && typeof obj.total_questions === 'number'
    && typeof obj.difficulty_level === 'number'
    && typeof obj.time_spent === 'number'
    && typeof obj.start_time === 'string'
    && typeof obj.end_time === 'string'
    && typeof obj.topic_id === 'string';
};

export const isAchievementDetails = (obj: any): obj is AchievementDetails => {
  return obj 
    && typeof obj === 'object'
    && typeof obj.streak === 'number'
    && typeof obj.max_streak === 'number'
    && typeof obj.points_earned === 'number';
};
