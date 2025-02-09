import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { SessionAnalytics, QuestionHistory } from '@/types/explorer';

interface UseQuizProgressReturn {
  score: number;
  timeSpent: number;
  showOverview: boolean;
  sessionStats: any;
  streak: number;
  updateProgress: (
    sessionId: string,
    isCorrect: boolean,
    questionPoints: number,
    currentQuestion: any,
    currentIndex: number
  ) => Promise<void>;
  finishQuiz: (sessionId: string, currentIndex: number, score: number, difficultyLevel: number) => Promise<void>;
}

export const useQuizProgress = (): UseQuizProgressReturn => {
  const { toast } = useToast();
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showOverview, setShowOverview] = useState(false);
  const [sessionStats, setSessionStats] = useState<any>(null);
  const [streak, setStreak] = useState(0);
  const [startTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const updateProgress = async (
    sessionId: string,
    isCorrect: boolean,
    questionPoints: number,
    currentQuestion: any,
    currentIndex: number
  ) => {
    console.log('[QuizProgress] Updating progress:', {
      sessionId,
      isCorrect,
      questionPoints,
      currentIndex
    });

    try {
      let newStreak = isCorrect ? streak + 1 : 0;
      setStreak(newStreak);

      const questionHistory: QuestionHistory = {
        question_id: currentQuestion.id,
        difficulty_level: currentQuestion.difficulty_level,
        points_possible: currentQuestion.points,
        points_earned: questionPoints,
        time_taken: timeSpent,
        is_correct: isCorrect,
        selected_answer: ''
      };

      const analyticsData: SessionAnalytics = {
        average_time_per_question: timeSpent / (currentIndex + 1),
        success_rate: ((score + questionPoints) / ((currentIndex + 1) * currentQuestion.points)) * 100,
        difficulty_progression: {
          final_difficulty: currentQuestion.difficulty_level,
          time_spent: timeSpent
        },
        current_streak: newStreak
      };

      const { error: sessionError } = await supabase
        .from('quiz_sessions')
        .update({
          questions_answered: Math.min(currentIndex + 1, 10),
          correct_answers: score + (isCorrect ? 1 : 0),
          final_score: Math.max(0, score + questionPoints),
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
          }
        })
        .eq('id', sessionId);

      if (sessionError) throw sessionError;
      console.log('[QuizProgress] Session updated successfully');
      setScore(score + questionPoints);

    } catch (error) {
      console.error('[QuizProgress] Error updating progress:', error);
      toast({
        variant: "destructive",
        title: "Error updating progress",
        description: "Your progress may not have been saved correctly.",
      });
      throw error;
    }
  };

  const finishQuiz = async (sessionId: string, currentIndex: number, score: number, difficultyLevel: number) => {
    console.log('[QuizProgress] Starting finishQuiz:', {
      sessionId,
      currentIndex,
      score,
      difficultyLevel
    });

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    // Get auth session
    const { data: { session } } = await supabase.auth.getSession();
    console.log('[QuizProgress] Current auth session:', session);

    if (!session?.user) {
      console.error('[QuizProgress] No auth session found');
      throw new Error('No authenticated user found');
    }

    const stats = {
      totalQuestions: currentIndex + 1,
      correctAnswers: score,
      finalScore: score,
      timeSpent: duration,
      accuracy: (score / (currentIndex + 1)) * 100,
      difficultyLevel
    };

    try {
      console.log('[QuizProgress] Updating quiz session:', {
        endTime,
        stats
      });

      const { error: updateError } = await supabase
        .from('quiz_sessions')
        .update({
          end_time: endTime.toISOString(),
          total_questions: stats.totalQuestions,
          correct_answers: stats.correctAnswers,
          final_score: Math.max(0, score),
          status: 'completed',
          questions_answered: Math.min(currentIndex + 1, 10),
          difficulty_progression: {
            final_difficulty: difficultyLevel,
            time_spent: duration,
            difficulty_changes: []
          },
          analytics_data: {
            ...stats,
            average_time_per_question: duration / (currentIndex + 1),
            final_difficulty_level: difficultyLevel,
            success_rate: stats.accuracy
          }
        })
        .eq('id', sessionId);

      if (updateError) throw updateError;

      console.log('[QuizProgress] Preparing analytics data with user_id:', session.user.id);
      
      const analyticsData = {
        user_id: session.user.id,
        metric_name: 'Quest Score',
        metric_value: Math.max(0, score),
        category: 'Learning Progress',
        recorded_at: endTime.toISOString(),
        quest_details: {
          topic_id: null,
          session_id: sessionId,
          questions_answered: stats.totalQuestions,
          correct_answers: stats.correctAnswers,
          total_questions: stats.totalQuestions,
          difficulty_level: difficultyLevel,
          time_spent: duration,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString()
        },
        achievement_details: {
          streak,
          max_streak: Math.max(streak, 0),
          points_earned: Math.max(0, score),
          completion_status: 'completed',
          accuracy_rate: (score / (currentIndex + 1)) * 100,
          levels_progressed: difficultyLevel,
          total_time: duration,
          session_achievements: {
            perfect_score: (score / (currentIndex + 1)) * 100 === 100,
            speed_bonus: duration < (currentIndex + 1) * 30,
            difficulty_mastery: difficultyLevel >= 3
          }
        }
      };

      console.log('[QuizProgress] Inserting quest analytics:', analyticsData);

      const { error: analyticsError } = await supabase
        .from('quest_analytics')
        .insert(analyticsData);

      if (analyticsError) {
        console.error('[QuizProgress] Analytics insert error:', analyticsError);
        throw analyticsError;
      }

      console.log('[QuizProgress] Quiz finished successfully');
      setSessionStats(stats);
      setShowOverview(true);
    } catch (error) {
      console.error('[QuizProgress] Error in finishQuiz:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while saving your results.",
      });
      throw error;
    }
  };

  return {
    score,
    timeSpent,
    showOverview,
    sessionStats,
    streak,
    updateProgress,
    finishQuiz
  };
};
