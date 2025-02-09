
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuizState } from './quiz/useQuizState';
import { useQuizProgress } from './quiz/useQuizProgress';
import { useQuizDifficulty } from './quiz/useQuizDifficulty';

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
    if (!currentQuestion || !sessionId) return;

    const correct = selectedAnswer === currentQuestion.question.correct_answer;
    const questionPoints = correct ? currentQuestion.points : 0;

    await updateProgress(sessionId, correct, questionPoints, currentQuestion, currentIndex);
    await updateDifficultyLevel(correct, currentIndex, score + questionPoints);

    await new Promise(resolve => setTimeout(resolve, 2000));

    if (currentIndex < 9) {
      await fetchNextQuestion(difficultyLevel, sessionId);
    } else {
      await finishQuiz(sessionId, currentIndex, score + questionPoints, difficultyLevel);
    }
  };

  const handleExit = async () => {
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

      if (error) {
        console.error('Error marking session as interrupted:', error);
      }
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    navigate('/explorer-map');
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
        return;
      }

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

      if (sessionError) {
        console.error('Error creating session:', sessionError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to initialize quiz session.",
        });
        return;
      }

      if (sessionData) {
        console.log('Session created:', sessionData);
        setSessionId(sessionData.id);
        await fetchNextQuestion(difficultyLevel, sessionData.id);
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
