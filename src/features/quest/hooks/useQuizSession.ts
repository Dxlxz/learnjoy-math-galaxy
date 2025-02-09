import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuizState } from './useQuizState';
import { useQuizProgress } from './useQuizProgress';
import { useQuizDifficulty } from './useQuizDifficulty';
import { useSearchParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useEffect } from 'react';
import { Question } from '@/types/explorer';

interface UseQuizSessionReturn {
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
  score: number;
  difficultyLevel: number;
  timeSpent: number;
  showOverview: boolean;
  sessionStats: any;
  streak: number;
  handleAnswer: (selectedAnswer: string) => Promise<void>;
  handleExit: () => Promise<void>;
}

export const useQuizSession = (): UseQuizSessionReturn => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const {
    loading,
    currentQuestion,
    showFeedback,
    isCorrect,
    currentIndex,
    sessionId,
    setSessionId,
    fetchNextQuestion
  } = useQuizState();

  const {
    score,
    timeSpent,
    showOverview,
    sessionStats,
    streak,
    updateProgress,
    finishQuiz
  } = useQuizProgress();

  const {
    difficultyLevel,
    updateDifficultyLevel
  } = useQuizDifficulty();

  const handleAnswer = async (selectedAnswer: string) => {
    console.log('[QuizSession] Handling answer:', {
      currentQuestion,
      sessionId,
      selectedAnswer
    });

    if (!currentQuestion || !sessionId) {
      console.error('[QuizSession] Missing required data:', { currentQuestion, sessionId });
      return;
    }

    const correct = selectedAnswer === currentQuestion.question.correct_answer;
    const questionPoints = correct ? currentQuestion.points : 0;

    console.log('[QuizSession] Answer evaluation:', {
      correct,
      questionPoints,
      currentIndex
    });

    try {
      await updateProgress(sessionId, correct, questionPoints, currentQuestion, currentIndex);
      await updateDifficultyLevel(correct, currentIndex, score + questionPoints);

      if (currentIndex < 9) {
        await fetchNextQuestion(difficultyLevel, sessionId);
      } else {
        console.log('[QuizSession] Quiz complete, finalizing...');
        await finishQuiz(sessionId, currentIndex, score + questionPoints, difficultyLevel);
      }
    } catch (error) {
      console.error('[QuizSession] Error handling answer:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem processing your answer. Please try again.",
      });
    }
  };

  const handleExit = async () => {
    try {
      if (sessionId) {
        const { error } = await supabase
          .from('quiz_sessions')
          .update({
            end_time: new Date().toISOString(),
            final_score: -1,
            status: 'interrupted',
            questions_answered: currentIndex
          })
          .eq('id', sessionId);

        if (error) throw error;
      }

      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      navigate('/explorer-map');
    } catch (error) {
      console.error('Error exiting quiz:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem saving your progress. Your session may not be properly saved.",
      });
      navigate('/explorer-map');
    }
  };

  useEffect(() => {
    const initialize = async () => {
      console.log('Initializing quiz session...');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const topicId = searchParams.get('topic');
      if (!topicId) {
        console.error('No topic ID provided');
        toast({
          variant: "destructive",
          title: "Error",
          description: "No topic was selected. Please try again.",
        });
        navigate('/explorer-map');
        return;
      }

      try {
        console.log('Creating new quiz session...');
        const { data: sessionData, error: sessionError } = await supabase
          .from('quiz_sessions')
          .insert({
            user_id: session.user.id,
            topic_id: topicId,
            start_time: new Date().toISOString(),
            total_questions: 10,
            correct_answers: 0,
            final_score: 0,
            max_questions: 10
          })
          .select()
          .single();

        if (sessionError) throw sessionError;

        if (sessionData) {
          console.log('Session created:', sessionData);
          setSessionId(sessionData.id);
          await fetchNextQuestion(difficultyLevel, sessionData.id);
        }
      } catch (error) {
        console.error('Error creating session:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to initialize quiz session. Please try again.",
        });
        navigate('/explorer-map');
      }
    };

    initialize();
  }, []);

  return {
    loading,
    currentQuestion,
    showFeedback,
    isCorrect,
    currentIndex,
    score,
    difficultyLevel,
    timeSpent,
    showOverview,
    sessionStats,
    streak,
    handleAnswer,
    handleExit
  };
};
