
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { PathNode, PathGenerationResult, LearningPathError } from '@/types/learning-path';

type GradeLevel = Database['public']['Enums']['grade_level'];

const CACHE_KEY = 'learning_path_cache';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

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

export const generateLearningPath = async (userId: string, userGrade: GradeLevel): Promise<PathGenerationResult> => {
  try {
    // Check cache first
    const cachedPath = getFromCache(userId);
    if (cachedPath) {
      console.log('Retrieved learning path from cache');
      return { success: true, path: cachedPath };
    }

    // Validate user grade
    const gradeOrder: GradeLevel[] = ['K1', 'K2', 'G1', 'G2', 'G3', 'G4', 'G5'];
    if (!gradeOrder.includes(userGrade)) {
      throw createPathError('VALIDATION_ERROR', `Invalid grade level: ${userGrade}`);
    }

    // Batch fetch completion status and topics
    const [{ data: topicCompletions, error: completionsError }, { data: topics, error: topicsError }] = await Promise.all([
      supabase
        .from('topic_completion')
        .select('*')
        .eq('user_id', userId),
      supabase
        .from('topics')
        .select('*')
        .in('grade', gradeOrder.slice(0, gradeOrder.indexOf(userGrade) + 1))
        .order('grade')
        .order('order_index')
    ]);

    if (completionsError) {
      throw createPathError('DATABASE_ERROR', 'Failed to fetch topic completions', completionsError);
    }

    if (topicsError) {
      throw createPathError('DATABASE_ERROR', 'Failed to fetch topics', topicsError);
    }

    const completedTopicIds = new Set(
      topicCompletions?.filter(tc => tc.content_completed && tc.quest_completed).map(tc => tc.topic_id) || []
    );

    if (!topics) {
      return { success: true, path: [] };
    }

    // Create path nodes with batch processing
    const pathNodes: PathNode[] = topics.map(topic => ({
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
    const now = new Date().toISOString();
    const jsonPathData = pathNodes.map(node => ({
      ...node,
      metadata: {
        ...node.metadata,
        lastAccessed: now
      }
    }));

    // Batch check existing path and update
    const { data: existingPath, error: checkError } = await supabase
      .from('learning_paths')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw createPathError('DATABASE_ERROR', 'Failed to check existing path', checkError);
    }

    const { error } = await supabase
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

    if (error) {
      throw createPathError('DATABASE_ERROR', 'Failed to save learning path', error);
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

// New function to get last accessed node
export const getLastAccessedNode = async (userId: string): Promise<PathNode | null> => {
  try {
    const { data, error } = await supabase
      .from('learning_paths')
      .select('path_data, current_node_id')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching last accessed node:', error);
      return null;
    }

    if (!data?.path_data || !data.current_node_id) {
      return null;
    }

    const pathData = data.path_data as PathNode[];
    return pathData.find(node => node.id === data.current_node_id) || null;
  } catch (error) {
    console.error('Error getting last accessed node:', error);
    return null;
  }
};

