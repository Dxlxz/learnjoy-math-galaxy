
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Question, QuestionHistory, SessionAnalytics } from '@/types/explorer';

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
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveIncorrect, setConsecutiveIncorrect] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showOverview, setShowOverview] = useState(false);
  const [sessionStats, setSessionStats] = useState<any>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(new Date());
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

      console.log('Question availability response:', { availabilityData, availabilityError });

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

      console.log('Available questions by difficulty:', availabilityData);

      const { data: questionData, error } = await supabase
        .rpc('get_next_quiz_question', {
          p_session_id: currentSessionId,
          p_topic_id: topicId,
          p_difficulty_level: currentDifficultyLevel
        })
        .single();

      console.log('Question data response:', { questionData, error });

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
        console.log('Processing question:', question);
        
        if (!question.tool_type) {
          setCurrentQuestion({
            id: questionData.question_id,
            question,
            difficulty_level: questionData.difficulty_level,
            points: questionData.points
          });
          console.log('Question set successfully');
        } else {
          console.log('Question has tool_type, fetching next question');
          await fetchNextQuestion(currentDifficultyLevel, currentSessionId);
        }
      } else {
        console.log('No question data received');
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

  const updateDifficultyLevel = async (correct: boolean) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const topicId = searchParams.get('topic');
    if (!topicId) return;

    let newDifficultyLevel = difficultyLevel;
    let newConsecutiveCorrect = correct ? consecutiveCorrect + 1 : 0;
    let newConsecutiveIncorrect = correct ? 0 : consecutiveIncorrect + 1;

    if (newConsecutiveCorrect >= 3) {
      newDifficultyLevel = Math.min(3, difficultyLevel + 1);
      newConsecutiveCorrect = 0;
      toast({
        title: "Level Up! 🎉",
        description: "You've advanced to a higher difficulty level!",
      });
    } else if (newConsecutiveIncorrect >= 2) {
      newDifficultyLevel = Math.max(1, difficultyLevel - 1);
      newConsecutiveIncorrect = 0;
      toast({
        title: "Adjusting Difficulty",
        description: "Let's try some easier questions to build confidence.",
      });
    }

    const { error } = await supabase
      .from('user_difficulty_levels')
      .upsert({
        user_id: session.user.id,
        topic_id: topicId,
        current_difficulty_level: newDifficultyLevel,
        consecutive_correct: newConsecutiveCorrect,
        consecutive_incorrect: newConsecutiveIncorrect,
        total_questions_attempted: currentIndex + 1,
        success_rate: (score / (currentIndex + 1)) * 100,
      }, {
        onConflict: 'user_id,topic_id'
      });

    if (!error) {
      setDifficultyLevel(newDifficultyLevel);
      setConsecutiveCorrect(newConsecutiveCorrect);
      setConsecutiveIncorrect(newConsecutiveIncorrect);
    }
  };

  const finishQuiz = async () => {
    if (!sessionId) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    const stats = {
      totalQuestions: currentIndex + 1,
      correctAnswers: score,
      finalScore: score,
      timeSpent: duration,
      accuracy: (score / (currentIndex + 1)) * 100
    };

    try {
      // First update the quiz session
      const { error: updateError } = await supabase
        .from('quiz_sessions')
        .update({
          end_time: endTime.toISOString(),
          total_questions: stats.totalQuestions,
          correct_answers: stats.correctAnswers,
          final_score: score,
          status: 'completed',
          questions_answered: currentIndex + 1,
          difficulty_progression: {
            final_difficulty: difficultyLevel,
            time_spent: duration,
            difficulty_changes: difficultyLevel
          },
          analytics_data: {
            ...stats,
            average_time_per_question: duration / (currentIndex + 1),
            final_difficulty_level: difficultyLevel
          }
        })
        .eq('id', sessionId);

      if (updateError) {
        console.error('Error updating session:', updateError);
        toast({
          variant: "destructive",
          title: "Error Saving Results",
          description: "There was a problem saving your quiz results.",
        });
        return;
      }

      // Then create the analytics entry with all required fields
      const { error: analyticsError } = await supabase
        .from('quest_analytics')
        .insert({
          user_id: sessionId,
          metric_name: 'Quest Score',
          metric_value: score,
          category: 'Learning Progress',
          recorded_at: endTime.toISOString(),
          quest_details: {
            topic_id: searchParams.get('topic'),
            session_id: sessionId,
            questions_answered: currentIndex + 1,
            correct_answers: stats.correctAnswers,
            total_questions: stats.totalQuestions,
            difficulty_level: difficultyLevel,
            time_spent: duration,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            difficulty_progression: []
          },
          achievement_details: {
            streak: streak,
            max_streak: Math.max(streak, currentQuestion?.max_streak || 0),
            points_earned: score
          }
        });

      if (analyticsError) {
        console.error('Error saving analytics:', analyticsError);
        toast({
          variant: "destructive",
          title: "Error Saving Analytics",
          description: "Your progress was saved but we couldn't record analytics.",
        });
      }

      setSessionStats(stats);
      setShowOverview(true);
    } catch (error) {
      console.error('Error in finishQuiz:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while saving your results.",
      });
    }
  };

  const handleAnswer = async (selectedAnswer: string) => {
    if (!currentQuestion || !sessionId) return;

    const correct = selectedAnswer === currentQuestion.question.correct_answer;
    setIsCorrect(correct);
    setShowFeedback(true);

    const questionPoints = correct ? currentQuestion.points : 0;
    const newScore = score + questionPoints;
    setScore(newScore);

    try {
      let newStreak = correct ? streak + 1 : 0;
      setStreak(newStreak);

      await updateDifficultyLevel(correct);

      const questionHistory: QuestionHistory = {
        question_id: currentQuestion.id,
        difficulty_level: currentQuestion.difficulty_level,
        points_possible: currentQuestion.points,
        points_earned: questionPoints,
        time_taken: timeSpent,
        is_correct: correct,
        selected_answer: selectedAnswer
      };

      const analyticsData: SessionAnalytics & { [key: string]: any } = {
        average_time_per_question: timeSpent / (currentIndex + 1),
        success_rate: (newScore / ((currentIndex + 1) * currentQuestion.points)) * 100,
        difficulty_progression: {
          final_difficulty: difficultyLevel,
          time_spent: timeSpent
        },
        current_streak: newStreak
      };

      if (sessionId) {
        const { error: sessionError } = await supabase
          .from('quiz_sessions')
          .update({ 
            questions_answered: currentIndex + 1,
            correct_answers: score + (correct ? 1 : 0),
            final_score: newScore,
            status: 'in_progress',
            question_history: [...(currentQuestion.question_history || []), questionHistory],
            analytics_data: analyticsData,
            current_streak: newStreak,
            max_streak: Math.max(newStreak, currentQuestion.max_streak || 0),
            streak_data: {
              streakHistory: [
                ...(currentQuestion.streak_data?.streakHistory || []),
                { streak: newStreak, timestamp: new Date().toISOString() }
              ],
              lastStreak: newStreak
            },
            difficulty_progression: {
              final_difficulty: difficultyLevel,
              time_spent: timeSpent,
              difficulty_changes: difficultyLevel
            }
          })
          .eq('id', sessionId)
          .select()
          .single();

        if (sessionError) {
          console.error('Error updating session:', sessionError);
          throw sessionError;
        }
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowFeedback(false);

      if (currentIndex < 9) {
        setCurrentIndex(currentIndex + 1);
        await fetchNextQuestion(difficultyLevel, sessionId);
      } else {
        await finishQuiz();
      }

    } catch (error: any) {
      console.error('Error updating progress:', error);
      toast({
        variant: "destructive",
        title: "Error updating progress",
        description: "Your progress may not have been saved correctly.",
      });
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

      setLoading(false);
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
