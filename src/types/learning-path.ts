
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
  version: number;
  metadata: {
    availableAt: string | null;
    lastAccessed: string | null;
  };
}

export interface LearningPathError extends Error {
  code: 'VALIDATION_ERROR' | 'DATABASE_ERROR' | 'GRADE_MISMATCH' | 'NETWORK_ERROR' | 'CACHE_ERROR';
  details?: unknown;
}

export interface PathGenerationResult {
  success: boolean;
  path?: PathNode[];
  error?: LearningPathError;
  fromCache?: boolean;
}

export interface PathCacheConfig {
  enabled: boolean;
  ttl: number;
}

