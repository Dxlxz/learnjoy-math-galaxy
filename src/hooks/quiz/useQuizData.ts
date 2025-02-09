
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSafeQuery } from '@/hooks/use-safe-query';
import { Question } from '@/types/explorer';

interface QuizQuestion {
  id: string;
  question: Question;
  difficulty_level: number;
  points: number;
}

export const useQuizData = (topicId: string | null, sessionId: string | null, difficultyLevel: number) => {
  // Query for checking quiz availability
  const availabilityQuery = useSafeQuery({
    queryKey: ['quiz-availability', topicId],
    queryFn: async () => {
      if (!topicId) throw new Error('No topic ID provided');
      
      const { data, error } = await supabase
        .rpc('check_questions_by_difficulty', {
          p_topic_id: topicId
        });

      if (error) throw error;
      return data;
    },
    enabled: !!topicId,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    errorMessage: "Failed to check quiz availability"
  });

  // Query for fetching next question
  const questionQuery = useQuery({
    queryKey: ['quiz-question', sessionId, topicId, difficultyLevel],
    queryFn: async (): Promise<QuizQuestion | null> => {
      if (!sessionId || !topicId) return null;

      const { data, error } = await supabase
        .rpc('get_next_quiz_question', {
          p_session_id: sessionId,
          p_topic_id: topicId,
          p_difficulty_level: difficultyLevel
        })
        .single();

      if (error) throw error;

      if (!data) return null;

      const questionData = data.question_data as unknown as Question;

      return {
        id: data.question_id,
        question: questionData,
        difficulty_level: data.difficulty_level,
        points: data.points
      };
    },
    enabled: !!sessionId && !!topicId,
    staleTime: 0, // Always fetch fresh question
    gcTime: 5 * 60 * 1000, // Cache for 5 minutes in case of network issues
    retry: false // Don't retry failed question fetches
  });

  return {
    availabilityQuery,
    questionQuery
  };
};
