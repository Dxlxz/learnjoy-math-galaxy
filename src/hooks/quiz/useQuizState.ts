
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Question } from '@/types/explorer';
import { useQuizData } from './useQuizData';

interface UseQuizStateReturn {
  loading: boolean;
  currentQuestion: {
    id: string;
    question: Question;
    difficulty_level: number;
    points: number;
  } | null;
  showFeedback: boolean;
  isCorrect: boolean;
  currentIndex: number;
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
  fetchNextQuestion: (currentDifficultyLevel: number, currentSessionId: string) => Promise<void>;
}

export const useQuizState = (): UseQuizStateReturn => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const topicId = searchParams.get('topic');

  const { availabilityQuery, questionQuery } = useQuizData(
    topicId,
    sessionId,
    currentQuestion?.difficulty_level || 1
  );

  const fetchNextQuestion = async (currentDifficultyLevel: number, currentSessionId: string) => {
    console.log('fetchNextQuestion called with:', { currentDifficultyLevel, currentSessionId });
    
    if (!currentSessionId || !topicId) {
      console.error('Missing sessionId or topicId:', { currentSessionId, topicId });
      return;
    }

    try {
      // Set session ID first
      setSessionId(currentSessionId);

      // Check availability
      const availabilityData = await supabase
        .rpc('check_quiz_availability', { p_topic_id: topicId })
        .single();

      if (!availabilityData.data?.available) {
        toast({
          variant: "destructive",
          title: "No questions available",
          description: "There are no questions available for this topic.",
        });
        navigate('/explorer-map');
        return;
      }

      // Fetch next question using direct RPC call to ensure fresh data
      const { data: questionData, error: questionError } = await supabase
        .rpc('get_quiz_data', {
          p_topic_id: topicId,
          p_session_id: currentSessionId,
          p_difficulty_level: currentDifficultyLevel
        })
        .single();

      if (questionError) throw questionError;

      if (questionData?.question_data && typeof questionData.question_data === 'object') {
        const question = questionData.question_data as any;
        if (!question.question_data.tool_type) {
          setCurrentQuestion({
            id: question.question_id,
            question: question.question_data,
            difficulty_level: question.difficulty_level,
            points: question.points
          });
          setCurrentIndex(prev => prev + 1);
        } else {
          // Skip tool-type questions by recursively calling fetchNextQuestion
          await fetchNextQuestion(currentDifficultyLevel, currentSessionId);
        }
      } else {
        toast({
          variant: "destructive",
          title: "No questions available",
          description: "There are no more questions available at this level.",
        });
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem loading the next question.",
      });
    }
  };

  return {
    loading: availabilityQuery.isLoading || questionQuery.isLoading,
    currentQuestion,
    showFeedback,
    isCorrect,
    currentIndex,
    sessionId,
    setSessionId,
    fetchNextQuestion
  };
};
