
import { BaseEntity } from './shared';

export interface Topic extends BaseEntity {
  title: string;
  description: string;
  content: Content[];
  order_index: number;
  grade: string;
}

export interface Content extends BaseEntity {
  title: string;
  type: 'video' | 'worksheet' | 'interactive' | 'assessment';
  url: string;
  topic_id?: string;
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
