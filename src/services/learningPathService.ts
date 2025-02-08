
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { PathNode, PathGenerationResult, LearningPathError } from '@/types/learning-path';

type GradeLevel = Database['public']['Enums']['grade_level'];

const createPathError = (code: LearningPathError['code'], message: string, details?: unknown): LearningPathError => {
  const error = new Error(message) as LearningPathError;
  error.code = code;
  error.details = details;
  return error;
};

export const generateLearningPath = async (userId: string, userGrade: GradeLevel): Promise<PathGenerationResult> => {
  try {
    // Validate user grade
    const gradeOrder: GradeLevel[] = ['K1', 'K2', 'G1', 'G2', 'G3', 'G4', 'G5'];
    if (!gradeOrder.includes(userGrade)) {
      throw createPathError('VALIDATION_ERROR', `Invalid grade level: ${userGrade}`);
    }

    // Fetch topics completion status
    const { data: topicCompletions, error: completionsError } = await supabase
      .from('topic_completion')
      .select('*')
      .eq('user_id', userId);

    if (completionsError) {
      throw createPathError('DATABASE_ERROR', 'Failed to fetch topic completions', completionsError);
    }

    // Create a map of completed topics
    const completedTopicIds = new Set(
      topicCompletions?.filter(tc => tc.content_completed && tc.quest_completed).map(tc => tc.topic_id) || []
    );

    // Fetch topics for user's grade and previous grades
    const userGradeIndex = gradeOrder.indexOf(userGrade);
    const allowedGrades = gradeOrder.slice(0, userGradeIndex + 1);

    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('*')
      .in('grade', allowedGrades)
      .order('grade')
      .order('order_index');

    if (topicsError) {
      throw createPathError('DATABASE_ERROR', 'Failed to fetch topics', topicsError);
    }

    if (!topics) {
      return { success: true, path: [] };
    }

    // Create path nodes
    const pathNodes: PathNode[] = topics.map(topic => ({
      id: topic.id,
      topicId: topic.id,
      title: topic.title,
      grade: topic.grade,
      status: completedTopicIds.has(topic.id) 
        ? 'completed'
        : 'locked',
      prerequisites: (topic.prerequisites as { required_topics: string[] } | null)?.required_topics || [],
      children: [],
      metadata: {
        availableAt: new Date().toISOString(),
      }
    }));

    // Build relationships and determine availability
    const nodesMap = new Map(pathNodes.map(node => [node.id, node]));
    
    pathNodes.forEach(node => {
      if (node.grade === 'K1' || node.prerequisites.length === 0) {
        node.status = 'available';
      }
      
      node.prerequisites.forEach(prereqId => {
        const prereqNode = nodesMap.get(prereqId);
        if (prereqNode) {
          prereqNode.children.push(node.id);
        }
      });
    });

    // Update status based on prerequisites
    pathNodes.forEach(node => {
      if (node.status === 'locked') {
        const gradeIndex = gradeOrder.indexOf(node.grade);
        const prerequisitesMet = node.prerequisites.every(prereqId => 
          nodesMap.get(prereqId)?.status === 'completed'
        );

        if (gradeIndex <= userGradeIndex && prerequisitesMet) {
          node.status = 'available';
        }
      }
    });

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
    const jsonPathData = pathNodes.map(node => ({
      ...node,
      version: 1,
      metadata: {
        ...node.metadata,
        lastSaved: new Date().toISOString()
      }
    }));

    const { data: existingPath } = await supabase
      .from('learning_paths')
      .select('id')
      .eq('user_id', userId)
      .single();

    const { error } = await supabase
      .from('learning_paths')
      .upsert({
        user_id: userId,
        path_data: jsonPathData,
        updated_at: new Date().toISOString(),
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

    return { success: true, path: pathNodes };
  } catch (error) {
    console.error('Error saving learning path:', error);
    return {
      success: false,
      error: error as LearningPathError
    };
  }
};
