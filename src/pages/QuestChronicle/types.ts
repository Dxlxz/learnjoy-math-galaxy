
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

export interface ReportProgressData {
  date: string;
  score: number;
}

// Make ReportData compatible with Supabase's Json type by making it an object with string keys
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
