
import { BaseEntity } from '@/types/shared';

export interface AnalyticsSummary {
  totalQuests: number;
  avgScore: number;
  timeSpent: number;
  completionRate: number;
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

// Single source of truth for QuestDetails type guard
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

// Type guard for AchievementDetails
export const isAchievementDetails = (obj: any): obj is AchievementDetails => {
  return obj 
    && typeof obj === 'object'
    && typeof obj.streak === 'number'
    && typeof obj.max_streak === 'number'
    && typeof obj.points_earned === 'number';
};
