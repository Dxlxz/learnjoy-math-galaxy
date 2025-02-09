
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

// Update interface to match Supabase function return type
interface QuizData {
  question_data: {
    question_id: string;
    question_data: Question;
    difficulty_level: number;
    points: number;
  } | null;
  availability_data: {
    available: boolean;
    question_count: number;
    difficulty_levels: number[];
  };
}

export const useQuizData = (topicId: string | null, sessionId: string | null, difficultyLevel: number) => {
  // Query for getting both quiz data and availability in one call
  const quizDataQuery = useSafeQuery({
    queryKey: ['quiz-data', topicId, sessionId, difficultyLevel],
    queryFn: async () => {
      if (!topicId) throw new Error('No topic ID provided');
      
      const { data, error } = await supabase
        .rpc('get_quiz_data', {
          p_topic_id: topicId,
          p_session_id: sessionId,
          p_difficulty_level: difficultyLevel
        })
        .single();

      if (error) throw error;
      return data as QuizData;
    },
    enabled: !!topicId,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    errorMessage: "Failed to fetch quiz data"
  });

  // Transform the data into the expected format, handling null question_data properly
  const transformedData = {
    availabilityData: quizDataQuery.data?.availability_data,
    questionData: quizDataQuery.data?.question_data && 
                 typeof quizDataQuery.data.question_data === 'object' ? {
      id: quizDataQuery.data.question_data.question_id,
      question: quizDataQuery.data.question_data.question_data as Question,
      difficulty_level: quizDataQuery.data.question_data.difficulty_level,
      points: quizDataQuery.data.question_data.points
    } as QuizQuestion : null
  };

  return {
    availabilityQuery: {
      data: transformedData.availabilityData,
      isLoading: quizDataQuery.isLoading,
      error: quizDataQuery.error
    },
    questionQuery: {
      data: transformedData.questionData,
      isLoading: quizDataQuery.isLoading,
      error: quizDataQuery.error,
      refetch: quizDataQuery.refetch
    }
  };
};
