
export interface QuestDetails {
  topic_id: string;
  session_id: string;
  questions_answered: number;
  correct_answers: number;
  total_questions: number;
  difficulty_level: number;
  time_spent: number;
  start_time: string | null;
  end_time: string | null;
}

export interface AchievementDetails {
  streak: number;
  max_streak: number;
  points_earned: number;
  completion_status: string;
  accuracy_rate: number;
}

export interface AnalyticsData {
  date: string;
  value: number;
  name: string;
  quest_details: QuestDetails;
  achievement_details: AchievementDetails;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface AnalyticsSummary {
  totalQuests: number;
  avgScore: number;
  timeSpent: number;
  completionRate: number;
}
