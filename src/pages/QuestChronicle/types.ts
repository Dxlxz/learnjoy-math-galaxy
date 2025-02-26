
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

export interface ReportData {
  achievements: number;
  totalQuests: number;
  averageScore: number;
  completionRate: number;
  strengths: string[];
  areasForImprovement: string[];
  recentProgress: { date: string; score: number; }[];
}

export interface HeroReport {
  id: string;
  user_id: string;
  generated_at: string;
  report_data: ReportData;
  report_type: string;
  metadata?: Record<string, any>;
  validity_period?: [string, string] | null;
}

// Add this new type to handle Supabase JSON responses
export interface SupabaseJsonData {
  generated_at: string;
  id: string;
  metadata: Record<string, any>;
  report_data: Record<string, any>;
  report_type: string;
  user_id: string;
  validity_period?: [string, string] | null;
}
