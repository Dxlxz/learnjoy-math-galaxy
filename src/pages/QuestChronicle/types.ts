
import { BaseEntity } from '@/types/shared';
import { QuestDetails, AchievementDetails, isQuestDetails, isAchievementDetails } from '@/types/quiz';

export interface AnalyticsSummary {
  totalQuests: number;
  avgScore: number;
  timeSpent: number;
  completionRate: number;
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

// Re-export shared types and type guards for convenience
export type { QuestDetails, AchievementDetails };
export { isQuestDetails, isAchievementDetails };
