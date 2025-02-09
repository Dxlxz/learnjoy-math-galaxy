import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Question } from '@/types/explorer';

interface UseQuizStateReturn {
  loading: boolean;
  error: Error | null;
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
  setSessionId: React.Dispatch<React.SetStateAction<string | null>>;
  fetchNextQuestion: (difficultyLevel: number, sessionId: string) => Promise<void>;
}

export const useQuizState = (): UseQuizStateReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<{
    id: string;
    question: Question;
    difficulty_level: number;
    points: number;
  } | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchNextQuestion = async (difficultyLevel: number, sessionId: string) => {
    console.log('[useQuizState] Fetching next question with difficulty:', difficultyLevel);
    setLoading(true);
    setError(null);
    setShowFeedback(false);

    try {
      const { data, error } = await supabase.rpc('get_next_question', {
        p_session_id: sessionId,
        p_difficulty_level: difficultyLevel
      });

      if (error) {
        console.error('Error fetching question:', error);
        setError(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load the next question. Please try again.",
        });
        return;
      }

      if (data) {
        console.log('[useQuizState] Question data:', data);
        setCurrentQuestion({
          id: data.id,
          question: data.question,
          difficulty_level: data.difficulty_level,
          points: data.points
        });
        setCurrentIndex(prevIndex => prevIndex + 1);
      } else {
        console.warn('No question returned from function');
        setCurrentQuestion(null);
      }
    } catch (err) {
      console.error('Unexpected error fetching question:', err);
      setError(err as Error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showFeedback) {
      const timer = setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showFeedback]);

  return {
    loading,
    error,
    currentQuestion,
    showFeedback,
    isCorrect,
    currentIndex,
    sessionId,
    setSessionId,
    fetchNextQuestion
  };
};
