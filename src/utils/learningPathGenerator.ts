
import { supabase } from '@/integrations/supabase/client';

interface Topic {
  id: string;
  title: string;
  grade: string;
  prerequisites: {
    required_topics: string[];
    required_milestones: string[];
  };
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

export const generateLearningPath = async (userId: string, userGrade: string): Promise<PathNode[]> => {
  // Fetch user's completed content
  const { data: completedContent } = await supabase
    .from('learning_progress')
    .select('content_id, content(topic_id)')
    .eq('user_id', userId);

  // Get completed topic IDs
  const completedTopicIds = new Set(
    completedContent?.map(item => item.content?.topic_id).filter(Boolean) || []
  );

  // Fetch all topics for user's grade
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
    prerequisites: topic.prerequisites?.required_topics || [],
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
    }, {
      onConflict: 'user_id'
    });

  if (error) {
    console.error('Error saving learning path:', error);
    throw error;
  }
};
