
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type GradeLevel = Database['public']['Enums']['grade_level'];

interface PathNode {
  [key: string]: any; // Make compatible with Json type
  id: string;
  topicId: string;
  title: string;
  status: 'locked' | 'available' | 'completed';
  prerequisites: string[];
  children: string[];
  grade: GradeLevel;
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

  // Fetch all topics for user's grade and previous grades
  const gradeOrder: GradeLevel[] = ['K1', 'K2', 'G1', 'G2', 'G3', 'G4', 'G5'];
  const userGradeIndex = gradeOrder.indexOf(userGrade);
  const allowedGrades = gradeOrder.slice(0, userGradeIndex + 1);

  const { data: topics } = await supabase
    .from('topics')
    .select('*')
    .in('grade', allowedGrades)
    .order('grade')
    .order('order_index');

  if (!topics) return [];

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
    children: []
  }));

  // Build relationships and determine availability
  const nodesMap = new Map(pathNodes.map(node => [node.id, node]));
  
  pathNodes.forEach(node => {
    // Mark K1 nodes or nodes without prerequisites as available
    if (node.grade === 'K1' || node.prerequisites.length === 0) {
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

  // Update status based on prerequisites and grade level
  pathNodes.forEach(node => {
    if (node.status === 'locked') {
      const gradeIndex = gradeOrder.indexOf(node.grade);
      const userGradeIndex = gradeOrder.indexOf(userGrade);
      
      // Check if prerequisites are met
      const prerequisitesMet = node.prerequisites.every(prereqId => 
        nodesMap.get(prereqId)?.status === 'completed'
      );

      // Node becomes available if:
      // 1. It's in a grade level accessible to the user
      // 2. All its prerequisites are completed
      if (gradeIndex <= userGradeIndex && prerequisitesMet) {
        node.status = 'available';
      }
    }
  });

  return pathNodes;
};

export const saveLearningPath = async (userId: string, pathNodes: PathNode[]) => {
  // Convert PathNode[] to a JSON-compatible format
  const jsonPathData = pathNodes.map(node => ({
    ...node,
    prerequisites: node.prerequisites,
    children: node.children,
    grade: node.grade
  }));

  const { error } = await supabase
    .from('learning_paths')
    .upsert({
      user_id: userId,
      path_data: jsonPathData,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving learning path:', error);
    throw error;
  }
};
