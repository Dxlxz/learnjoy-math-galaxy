
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSafeQuery } from '@/hooks/use-safe-query';
import { Question } from '@/types/explorer';
import { Json } from '@/integrations/supabase/types';

interface QuizQuestion {
  id: string;
  question: Question;
  difficulty_level: number;
  points: number;
}

// Define interface to match exact Supabase function return type
interface RawQuizData {
  question_data: Json;
  availability_data: {
    available: boolean;
    question_count: number;
    difficulty_levels: number[];
  };
}

// Interface for transformed data
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
      
      console.log('Fetching quiz data with:', { topicId, sessionId, difficultyLevel });

      const { data, error } = await supabase
        .rpc('get_quiz_data', {
          p_topic_id: topicId,
          p_session_id: sessionId,
          p_difficulty_level: difficultyLevel
        });

      if (error) {
        console.error('Error fetching quiz data:', error);
        throw error;
      }

      console.log('Raw quiz data response:', data);

      // Transform raw data into expected format
      const rawData = data as RawQuizData[];
      if (!rawData?.[0]) {
        console.error('No data returned from quiz_data function');
        throw new Error('No data returned from quiz_data function');
      }

      const result = rawData[0];
      console.log('Processing quiz data result:', result);
      
      // Transform into QuizData format
      const transformedData: QuizData = {
        availability_data: result.availability_data,
        question_data: result.question_data && result.question_data !== 'null' && typeof result.question_data === 'object'
          ? {
              question_id: (result.question_data as any).question_id,
              question_data: (result.question_data as any).question_data,
              difficulty_level: (result.question_data as any).difficulty_level,
              points: (result.question_data as any).points
            }
          : null
      };

      console.log('Transformed quiz data:', transformedData);
      return transformedData;
    },
    enabled: !!topicId,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    errorMessage: "Failed to fetch quiz data"
  });

  // Transform the data into the expected format, handling null question_data properly
  const transformedData = {
    availabilityData: quizDataQuery.data?.availability_data,
    questionData: quizDataQuery.data?.question_data ? {
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
