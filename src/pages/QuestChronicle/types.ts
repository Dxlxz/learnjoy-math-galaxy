
import { Json } from '@/integrations/supabase/types';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  earned?: boolean;
  earned_at?: string;
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
  recentProgress: {
    date: string;
    score: number;
  }[];
}

export interface HeroReport {
  id: string;
  generated_at: string;
  report_type: string;
  report_data: ReportData;
  user_id: string;
  metadata?: unknown;
  validity_period?: unknown;
}
