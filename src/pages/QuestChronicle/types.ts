
import { BaseEntity } from '@/types/shared';

export interface AnalyticsSummary {
  totalQuests: number;
  avgScore: number;
  timeSpent: number;
  completionRate: number;
}

export interface QuestDetails {
  topic_id: string | null;
  questions_answered: number;
  correct_answers: number;
  total_questions: number;
  difficulty_progression: any[];
  time_spent: number;
  start_time: string | null;
  end_time: string | null;
  session_id: string | null;
  difficulty_level: number;
}

export interface AchievementDetails {
  streak: number;
  max_streak: number;
  points_earned: number;
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

export interface PerformanceData {
  period: string;
  avgScore: number;
}

export interface ReportProgressData {
  date: string;
  score: number;
}

export interface ReportData {
  [key: string]: number | string[] | ReportProgressData[] | number[];
  achievements: number;
  totalQuests: number;
  averageScore: number;
  completionRate: number;
  strengths: string[];
  areasForImprovement: string[];
  recentProgress: ReportProgressData[];
}

export interface HeroReport extends BaseEntity {
  user_id: string;
  report_type: string;
  report_data: ReportData;
  generated_at: string;
}
