
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

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  hasMore: boolean;
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

