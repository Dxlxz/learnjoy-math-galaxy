
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { PathNode, PathGenerationResult, LearningPathError } from '@/types/learning-path';
import { PostgrestResponse, PostgrestSingleResponse, PostgrestError } from '@supabase/supabase-js';

type GradeLevel = Database['public']['Enums']['grade_level'];
type TopicCompletion = Database['public']['Tables']['topic_completion']['Row'];
type Topic = Database['public']['Tables']['topics']['Row'];
type LearningPath = Database['public']['Tables']['learning_paths']['Row'];

const CACHE_KEY = 'learning_path_cache';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const REQUEST_TIMEOUT = 10000; // 10 seconds

interface CacheEntry {
  data: PathNode[];
  timestamp: number;
}

const createPathError = (code: LearningPathError['code'], message: string, details?: unknown): LearningPathError => {
  const error = new Error(message) as LearningPathError;
  error.code = code;
  error.details = details;
  return error;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const validatePathNode = (node: PathNode): boolean => {
  return (
    typeof node.id === 'string' &&
    typeof node.topicId === 'string' &&
    typeof node.title === 'string' &&
    ['locked', 'available', 'completed'].includes(node.status) &&
    Array.isArray(node.prerequisites) &&
    Array.isArray(node.children) &&
    typeof node.grade === 'string' &&
    typeof node.version === 'number' &&
    typeof node.metadata === 'object' &&
    (node.metadata.availableAt === null || typeof node.metadata.availableAt === 'string') &&
    (node.metadata.lastAccessed === null || typeof node.metadata.lastAccessed === 'string')
  );
};

const validatePathData = (pathData: PathNode[]): boolean => {
  return Array.isArray(pathData) && pathData.every(validatePathNode);
};

const getFromCache = (userId: string): PathNode[] | null => {
  const cached = localStorage.getItem(`${CACHE_KEY}_${userId}`);
  if (cached) {
    const { data, timestamp }: CacheEntry = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_EXPIRY) {
      return data;
    }
    localStorage.removeItem(`${CACHE_KEY}_${userId}`);
  }
  return null;
};

const setCache = (userId: string, data: PathNode[]) => {
  const cacheEntry: CacheEntry = {
    data,
    timestamp: Date.now()
  };
  localStorage.setItem(`${CACHE_KEY}_${userId}`, JSON.stringify(cacheEntry));
};

const retryOperation = async <T>(
  operation: () => Promise<PostgrestResponse<T> | PostgrestSingleResponse<T>>,
  maxRetries: number = MAX_RETRIES
): Promise<PostgrestResponse<T> | PostgrestSingleResponse<T>> => {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await Promise.race([
        operation(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), REQUEST_TIMEOUT)
        )
      ]);
      return result;
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt < maxRetries) {
        await delay(RETRY_DELAY * attempt); // Exponential backoff
      }
    }
  }
  
  throw lastError || new Error('Operation failed after retries');
};

export const generateLearningPath = async (userId: string, userGrade: GradeLevel): Promise<PathGenerationResult> => {
  try {
    // Check cache first
    const cachedPath = getFromCache(userId);
    if (cachedPath) {
      console.log('Retrieved learning path from cache');
      return { success: true, path: cachedPath, fromCache: true };
    }

    // Validate user grade
    const gradeOrder: GradeLevel[] = ['K1', 'K2', 'G1', 'G2', 'G3', 'G4', 'G5'];
    if (!gradeOrder.includes(userGrade)) {
      throw createPathError('VALIDATION_ERROR', `Invalid grade level: ${userGrade}`);
    }

    // Batch fetch completion status and topics with retry mechanism
    const [completionsResult, topicsResult] = await Promise.all([
      retryOperation<TopicCompletion>(() =>
        supabase
          .from('topic_completion')
          .select('*')
          .eq('user_id', userId)
      ),
      retryOperation<Topic>(() =>
        supabase
          .from('topics')
          .select('*')
          .in('grade', gradeOrder.slice(0, gradeOrder.indexOf(userGrade) + 1))
          .order('grade')
          .order('order_index')
      )
    ]);

    if (completionsResult.error) {
      throw createPathError('DATABASE_ERROR', 'Failed to fetch topic completions', completionsResult.error);
    }

    if (topicsResult.error) {
      throw createPathError('DATABASE_ERROR', 'Failed to fetch topics', topicsResult.error);
    }

    const completedTopicIds = new Set(
      (completionsResult.data as TopicCompletion[])
        ?.filter(tc => tc.content_completed && tc.quest_completed)
        .map(tc => tc.topic_id) || []
    );

    if (!topicsResult.data) {
      return { success: true, path: [] };
    }

    // Create path nodes with batch processing
    const pathNodes: PathNode[] = (topicsResult.data as Topic[]).map(topic => ({
      id: topic.id,
      topicId: topic.id,
      title: topic.title,
      grade: topic.grade,
      status: completedTopicIds.has(topic.id) ? 'completed' : 'locked',
      prerequisites: (topic.prerequisites as { required_topics: string[] } | null)?.required_topics || [],
      children: [],
      version: 1,
      metadata: {
        availableAt: null,
        lastAccessed: null
      }
    }));

    // Validate generated path data
    if (!validatePathData(pathNodes)) {
      throw createPathError('VALIDATION_ERROR', 'Invalid path data structure');
    }

    // Optimize prerequisite checking with Map
    const nodesMap = new Map(pathNodes.map(node => [node.id, node]));
    
    // Batch process relationships and availability
    pathNodes.forEach(node => {
      if (node.grade === 'K1' || node.prerequisites.length === 0) {
        node.status = 'available';
        node.metadata.availableAt = new Date().toISOString();
      }
      
      node.prerequisites.forEach(prereqId => {
        const prereqNode = nodesMap.get(prereqId);
        if (prereqNode) {
          prereqNode.children.push(node.id);
        }
      });
    });

    // Batch update status based on prerequisites
    pathNodes.forEach(node => {
      if (node.status === 'locked') {
        const gradeIndex = gradeOrder.indexOf(node.grade);
        const prerequisitesMet = node.prerequisites.every(prereqId => 
          nodesMap.get(prereqId)?.status === 'completed'
        );

        if (gradeIndex <= gradeOrder.indexOf(userGrade) && prerequisitesMet) {
          node.status = 'available';
          node.metadata.availableAt = new Date().toISOString();
        }
      }
    });

    // Cache the generated path
    setCache(userId, pathNodes);

    return { success: true, path: pathNodes };
  } catch (error) {
    console.error('Error generating learning path:', error);
    return {
      success: false,
      error: error as LearningPathError
    };
  }
};

export const saveLearningPath = async (userId: string, pathNodes: PathNode[]): Promise<PathGenerationResult> => {
  try {
    // Validate path data before saving
    if (!validatePathData(pathNodes)) {
      throw createPathError('VALIDATION_ERROR', 'Invalid path data structure');
    }

    const now = new Date().toISOString();
    const jsonPathData = pathNodes.map(node => ({
      ...node,
      metadata: {
        ...node.metadata,
        lastAccessed: now
      }
    }));

    // Implement retry mechanism for database operations
    const result = await retryOperation<LearningPath>(async () => {
      // Batch check existing path and update
      const { data: existingPath, error: checkError } = await supabase
        .from('learning_paths')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw createPathError('DATABASE_ERROR', 'Failed to check existing path', checkError);
      }

      return await supabase
        .from('learning_paths')
        .upsert({
          user_id: userId,
          path_data: jsonPathData,
          updated_at: now,
          version: 1,
          id: existingPath?.id
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();
    });

    if (result.error) {
      throw createPathError('DATABASE_ERROR', 'Failed to save learning path', result.error);
    }

    // Update cache with saved data
    setCache(userId, jsonPathData);

    return { success: true, path: pathNodes };
  } catch (error) {
    console.error('Error saving learning path:', error);
    return {
      success: false,
      error: error as LearningPathError
    };
  }
};

export const getLastAccessedNode = async (userId: string): Promise<PathNode | null> => {
  try {
    const result = await retryOperation<Pick<LearningPath, 'path_data' | 'current_node_id'>>(async () => {
      return await supabase
        .from('learning_paths')
        .select('path_data, current_node_id')
        .eq('user_id', userId)
        .maybeSingle();
    });

    if (result.error) {
      throw createPathError('DATABASE_ERROR', 'Failed to fetch last accessed node', result.error);
    }

    if (!result.data?.path_data || !result.data.current_node_id) {
      return null;
    }

    // Validate and type-cast path data
    const pathData = result.data.path_data as PathNode[];
    if (!validatePathData(pathData)) {
      throw createPathError('VALIDATION_ERROR', 'Invalid path data structure in database');
    }

    return pathData.find(node => node.id === result.data?.current_node_id) || null;
  } catch (error) {
    console.error('Error getting last accessed node:', error);
    return null;
  }
};
