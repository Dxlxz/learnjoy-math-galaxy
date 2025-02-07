
import { BaseEntity } from '@/types/shared';

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
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface PerformanceData {
  period: string;
  avgScore: number;
}

export interface ReportData {
  achievements: number;
  totalQuests: number;
  averageScore: number;
  completionRate: number;
  strengths: string[];
  areasForImprovement: string[];
  recentProgress: {
    date: string;
    score: number;
  }[];
}

export interface HeroReport extends BaseEntity {
  user_id: string;
  report_type: string;
  report_data: ReportData;
  generated_at: string;
}
