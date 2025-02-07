
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type GradeLevel = Database['public']['Enums']['grade_level'];

interface Topic {
  id: string;
  title: string;
  grade: GradeLevel;
  prerequisites: {
    required_topics: string[];
    required_milestones: string[];
  } | null;
  order_index: number;
}

interface PathNode {
  id: string;
  topicId: string;
  title: string;
  status: 'locked' | 'available' | 'completed';
  prerequisites: string[];
  children: string[];
}

export const generateLearningPath = async (userId: string, userGrade: GradeLevel): Promise<PathNode[]> => {
  // Fetch topics completion status with an optimized query
  const { data: topicCompletions } = await supabase
    .from('topic_completion')
    .select('*')
    .eq('user_id', userId);

  // Create a map of completed topics
  const completedTopicIds = new Set(
    topicCompletions?.filter(tc => tc.content_completed && tc.quest_completed).map(tc => tc.topic_id) || []
  );

  // Fetch all topics for user's grade - no joins needed here
  const { data: topics } = await supabase
    .from('topics')
    .select('*')
    .eq('grade', userGrade)
    .order('order_index');

  if (!topics) return [];

  // Create path nodes
  const pathNodes: PathNode[] = topics.map(topic => ({
    id: topic.id,
    topicId: topic.id,
    title: topic.title,
    status: completedTopicIds.has(topic.id) 
      ? 'completed'
      : 'locked',
    prerequisites: (topic.prerequisites as { required_topics: string[] } | null)?.required_topics || [],
    children: []
  }));

  // Build relationships and determine availability
  const nodesMap = new Map(pathNodes.map(node => [node.id, node]));
  pathNodes.forEach(node => {
    // Mark nodes without prerequisites as available
    if (node.prerequisites.length === 0 && node.status === 'locked') {
      node.status = 'available';
    }
    
    // Set up children relationships
    node.prerequisites.forEach(prereqId => {
      const prereqNode = nodesMap.get(prereqId);
      if (prereqNode) {
        prereqNode.children.push(node.id);
      }
    });
  });

  // Update status based on prerequisites
  pathNodes.forEach(node => {
    if (node.status === 'locked' && 
        node.prerequisites.every(prereqId => 
          nodesMap.get(prereqId)?.status === 'completed'
        )) {
      node.status = 'available';
    }
  });

  return pathNodes;
};

export const saveLearningPath = async (userId: string, pathNodes: PathNode[]) => {
  const { error } = await supabase
    .from('learning_paths')
    .upsert({
      user_id: userId,
      path_data: pathNodes,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving learning path:', error);
    throw error;
  }
};
