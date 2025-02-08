
import { Database } from '@/integrations/supabase/types';

type GradeLevel = Database['public']['Enums']['grade_level'];

export interface PathNode {
  id: string;
  topicId: string;
  title: string;
  status: 'locked' | 'available' | 'completed';
  prerequisites: string[];
  children: string[];
  grade: GradeLevel;
  version?: number;
  metadata?: {
    availableAt?: string;
    lastAccessed?: string;
  };
}

export interface LearningPathError extends Error {
  code: 'VALIDATION_ERROR' | 'DATABASE_ERROR' | 'GRADE_MISMATCH' | 'NETWORK_ERROR';
  details?: unknown;
}

export interface PathGenerationResult {
  success: boolean;
  path?: PathNode[];
  error?: LearningPathError;
}
