
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Question } from '@/types/explorer';

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
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const fetchNextQuestion = async (currentDifficultyLevel: number, currentSessionId: string) => {
    console.log('fetchNextQuestion called with:', { currentDifficultyLevel, currentSessionId });
    const topicId = searchParams.get('topic');
    if (!currentSessionId || !topicId) {
      console.error('Missing sessionId or topicId:', { currentSessionId, topicId });
      return;
    }

    try {
      console.log('Checking question availability...');
      const { data: availabilityData, error: availabilityError } = await supabase
        .rpc('check_questions_by_difficulty', {
          p_topic_id: topicId
        });

      if (availabilityError) {
        console.error('Error checking question availability:', availabilityError);
        toast({
          variant: "destructive",
          title: "Error checking questions",
          description: "There was a problem checking question availability.",
        });
        return;
      }

      if (!availabilityData || availabilityData.length === 0) {
        console.error('No questions available for this topic');
        toast({
          variant: "destructive",
          title: "No questions available",
          description: "There are no questions available for this topic.",
        });
        return;
      }

      const { data: questionData, error } = await supabase
        .rpc('get_next_quiz_question', {
          p_session_id: currentSessionId,
          p_topic_id: topicId,
          p_difficulty_level: currentDifficultyLevel
        })
        .single();

      if (error) {
        console.error('Error fetching next question:', error);
        toast({
          variant: "destructive",
          title: "Error fetching question",
          description: "There was a problem loading the next question.",
        });
        return;
      }

      if (questionData) {
        const question = questionData.question_data as unknown as Question;
        
        if (!question.tool_type) {
          setCurrentQuestion({
            id: questionData.question_id,
            question,
            difficulty_level: questionData.difficulty_level,
            points: questionData.points
          });
        } else {
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
      console.error('Unexpected error fetching question:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    }
  };

  return {
    loading,
    currentQuestion,
    showFeedback,
    isCorrect,
    currentIndex,
    sessionId,
    setSessionId,
    fetchNextQuestion
  };
};
