
import { LucideIcon } from 'lucide-react';
import { type Database } from '@/integrations/supabase/types';
import { TEvent } from 'fabric';

// Common shared interfaces
export type Grade = Database['public']['Enums']['grade_level'];

export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

export interface MetadataEntity extends BaseEntity {
  metadata?: Record<string, any> | null;
}

export interface UserEntity extends BaseEntity {
  user_id: string;
}

export interface Tool {
  name: string;
  icon: LucideIcon;
  description: string;
  comingSoon: boolean;
  route?: string;
}

export interface GradeSection {
  grade: Grade;
  title: string;
  bgColor: string;
  tools: Tool[];
}

export interface Content {
  id: string;
  title: string;
  type: 'video' | 'worksheet' | 'interactive' | 'assessment';
  url: string;
  topic_id?: string;
}

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

export interface MilestoneRequirements {
  type: string;
  topic_id?: string;
  requirement?: number;
  count?: number;
  days?: number;
}

export interface TopicPrerequisites {
  required_topics: string[];
  required_milestones: string[];
}

export interface Topic extends MetadataEntity {
  title: string;
  description: string | null;
  content: Content[];
  milestones?: Milestone[];
  completedMilestones?: string[];
  prerequisites: TopicPrerequisites;
  prerequisites_met?: boolean;
  is_started?: boolean;
  order_index: number;
  grade: Grade;
}

export interface Milestone extends MetadataEntity {
  title: string;
  description: string | null;
  icon_name: string;
  requirements: MilestoneRequirements;
  prerequisite_milestones: string[] | null;
}

// Quest Chronicle Types
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

// Canvas Events
export interface CanvasEvent extends TEvent {
  pointer: {
    x: number;
    y: number;
  };
}

export interface DrawingData {
  points: Array<{ x: number; y: number }>;
  stroke: string;
  strokeWidth: number;
}
