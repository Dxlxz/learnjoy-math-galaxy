
import { BaseEntity } from './shared';

export interface Topic extends BaseEntity {
  title: string;
  description: string;
  content: Content[];
  order_index: number;
  grade: string;
  prerequisites_met?: boolean;
  is_started?: boolean;
  milestones?: Milestone[];
  completedMilestones?: string[];
}

export interface Content extends BaseEntity {
  title: string;
  type: 'video' | 'worksheet' | 'interactive' | 'assessment';
  url: string;
  topic_id?: string;
}

export interface Milestone extends BaseEntity {
  title: string;
  description: string | null;
  icon_name: string;
  requirements: MilestoneRequirements;
  prerequisite_milestones: string[] | null;
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

export interface VideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export interface TopicCardProps {
  topic: Topic;
  onClick?: (topic: Topic) => void;
  isActive?: boolean;
}
