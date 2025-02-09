
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
  
  // Pass the sessionId to useQuizData only after it's been set
  const { availabilityQuery, questionQuery } = useQuizData(
    topicId,
    sessionId, // This will trigger a new query when sessionId changes
    currentQuestion?.difficulty_level || 1
  );

  const fetchNextQuestion = async (currentDifficultyLevel: number, currentSessionId: string) => {
    console.log('fetchNextQuestion called with:', { currentDifficultyLevel, currentSessionId });
    
    if (!currentSessionId || !topicId) {
      console.error('Missing sessionId or topicId:', { currentSessionId, topicId });
      return;
    }

    try {
      // Update session ID first to ensure proper data fetching
      setSessionId(currentSessionId);

      // Check availability using cached data
      const availabilityData = availabilityQuery.data;
      
      if (!availabilityData || !availabilityData.available) {
        toast({
          variant: "destructive",
          title: "No questions available",
          description: "There are no questions available for this topic.",
        });
        navigate('/explorer-map');
        return;
      }

      // Fetch next question using cached query
      const result = await questionQuery.refetch();
      
      if (result.data?.question_data) {
        const questionData = result.data.question_data;
        if (!questionData.question_data.tool_type) {
          setCurrentQuestion({
            id: questionData.question_id,
            question: questionData.question_data,
            difficulty_level: questionData.difficulty_level,
            points: questionData.points
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
