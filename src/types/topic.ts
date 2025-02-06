
import { MapStyle, MapCoordinates, MapRegion, PathStyle } from './map';

export interface Content {
  id: string;
  title: string;
  type: 'video' | 'worksheet' | 'interactive' | 'assessment';
  url: string;
  topic_id: string;
}

export interface MilestoneRequirements {
  type: string;
  topic_id?: string;
  requirement?: number;
  count?: number;
  days?: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string | null;
  icon_name: string;
  requirements: MilestoneRequirements;
  prerequisite_milestones: string[] | null;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface TopicPrerequisites {
  required_topics: string[];
  required_milestones: string[];
}

export interface Topic {
  id: string;
  title: string;
  description: string | null;
  content: Content[];
  milestones?: Milestone[];
  completedMilestones?: string[];
  prerequisites: TopicPrerequisites;
  prerequisites_met: boolean; // Changed from optional to required
  is_started?: boolean;
  order_index: number;
  map_coordinates: MapCoordinates | null;
  map_style: MapStyle | null;
  map_region?: MapRegion;
  path_style?: PathStyle;
}

