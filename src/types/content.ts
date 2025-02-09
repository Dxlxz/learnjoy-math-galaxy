
import { Grade, MetadataEntity } from './shared';

export interface Content {
  id: string;
  title: string;
  type: 'video' | 'worksheet' | 'interactive' | 'assessment';
  url: string;
  topic_id?: string;
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

export interface MilestoneRequirements {
  type: string;
  topic_id?: string;
  requirement?: number;
  count?: number;
  days?: number;
}

export interface Milestone extends MetadataEntity {
  title: string;
  description: string | null;
  icon_name: string;
  requirements: MilestoneRequirements;
  prerequisite_milestones: string[] | null;
}
