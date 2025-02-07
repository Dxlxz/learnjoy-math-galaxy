
import { LucideIcon } from 'lucide-react';
import { type Database } from '@/integrations/supabase/types';

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
}

export interface Milestone extends MetadataEntity {
  title: string;
  description: string | null;
  icon_name: string;
  requirements: MilestoneRequirements;
  prerequisite_milestones: string[] | null;
}

