
import { BaseEntity, UserEntity } from './shared';

export interface LeaderboardEntry extends UserEntity {
  game_type: string;
  score: number;
  achieved_at: string;
  profiles: {
    hero_name: string;
  } | null;
}

export interface Achievement extends BaseEntity {
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

export interface HeroReport extends BaseEntity {
  user_id: string;
  report_type: string;
  report_data: ReportData;
  generated_at: string;
}
