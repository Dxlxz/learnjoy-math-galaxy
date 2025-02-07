
import { BaseEntity } from './shared';

export interface Topic extends BaseEntity {
  title: string;
  description: string;
  content: Content[];
  order_index: number;
  grade: string;
  prerequisites_met?: boolean;
  is_started?: boolean;
  is_completed?: boolean;
  content_completed?: boolean;
  quest_completed?: boolean;
  milestones?: Milestone[];
  completedMilestones?: string[];
  prerequisites: TopicPrerequisites;
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

export interface Question {
  id: string;
  text: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
  image_url?: string;
  tool_type?: string;
  metadata?: Record<string, any>;
}

export interface QuestionBankEntry {
  id: string;
  question: Question;
  difficulty_level: number;
  points: number;
}

export interface QuizSession {
  id: string;
  user_id: string;
  topic_id: string;
  start_time: string;
  end_time?: string;
  total_questions: number;
  correct_answers: number;
  final_score: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'interrupted';
  questions_answered: number;
  points_possible: number;
  question_history: QuestionHistory[];
  analytics_data: SessionAnalytics;
  difficulty_progression: DifficultyProgression;
}

export interface QuestionHistory {
  question_id: string;
  difficulty_level: number;
  points_possible: number;
  points_earned: number;
  time_taken: number;
  is_correct: boolean;
  selected_answer: string;
}

export interface SessionAnalytics {
  average_time_per_question: number;
  success_rate: number;
  difficulty_progression: {
    final_difficulty: number;
    time_spent: number;
  };
}

export interface DifficultyProgression {
  final_difficulty: number;
  time_spent: number;
  difficulty_changes: number;
}
