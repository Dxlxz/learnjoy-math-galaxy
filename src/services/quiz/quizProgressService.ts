
import { supabase } from '@/integrations/supabase/client';
import { 
  QuestionHistory, 
  SessionAnalytics, 
  questionHistoryToJson,
  sessionAnalyticsToJson 
} from './types';

class QuizProgressService {
  async updateProgress(
    sessionId: string,
    currentIndex: number,
    isCorrect: boolean,
    questionPoints: number,
    timeSpent: number,
    currentStreak: number,
    currentDifficulty: number,
    score: number,
    questionData: {
      id: string;
      difficulty_level: number;
      points: number;
    }
  ) {
    console.log('[QuizProgressService] Updating progress:', {
      sessionId,
      currentIndex,
      isCorrect,
      score
    });

    try {
      const questionHistory: QuestionHistory = {
        question_id: questionData.id,
        difficulty_level: questionData.difficulty_level,
        points_possible: questionData.points,
        points_earned: questionPoints,
        time_taken: timeSpent,
        is_correct: isCorrect,
        selected_answer: ''
      };

      const analyticsData: SessionAnalytics = {
        average_time_per_question: timeSpent / (currentIndex + 1),
        success_rate: ((score + questionPoints) / ((currentIndex + 1) * questionData.points)) * 100,
        difficulty_progression: {
          final_difficulty: currentDifficulty,
          time_spent: timeSpent
        },
        current_streak: currentStreak
      };

      const { error: sessionError } = await supabase
        .from('quiz_sessions')
        .update({
          questions_answered: Math.min(currentIndex + 1, 10),
          correct_answers: score + (isCorrect ? 1 : 0),
          final_score: Math.max(0, score + questionPoints),
          status: 'in_progress',
          question_history: questionHistoryToJson(questionHistory),
          analytics_data: sessionAnalyticsToJson(analyticsData),
          current_streak: currentStreak,
          max_streak: Math.max(currentStreak, 0)
        })
        .eq('id', sessionId);

      if (sessionError) throw sessionError;
      console.log('[QuizProgressService] Progress updated successfully');

      return {
        updatedScore: score + questionPoints,
        analyticsData
      };
    } catch (error) {
      console.error('[QuizProgressService] Error updating progress:', error);
      throw error;
    }
  }

  async finishQuiz(
    sessionId: string,
    finalScore: number,
    currentIndex: number,
    timeSpent: number,
    difficultyLevel: number
  ) {
    console.log('[QuizProgressService] Finishing quiz:', {
      sessionId,
      finalScore,
      currentIndex,
      difficultyLevel
    });

    try {
      const analyticsData: SessionAnalytics = {
        average_time_per_question: timeSpent / (currentIndex + 1),
        success_rate: (finalScore / (currentIndex + 1)) * 100,
        difficulty_progression: {
          final_difficulty: difficultyLevel,
          time_spent: timeSpent
        },
        current_streak: 0
      };

      const { error: completionError } = await supabase
        .from('quiz_sessions')
        .update({
          final_score: Math.max(0, finalScore),
          status: 'completed',
          end_time: new Date().toISOString(),
          analytics_data: sessionAnalyticsToJson(analyticsData)
        })
        .eq('id', sessionId);

      if (completionError) throw completionError;
      console.log('[QuizProgressService] Quiz finished successfully');

      return analyticsData;
    } catch (error) {
      console.error('[QuizProgressService] Error finishing quiz:', error);
      throw error;
    }
  }
}

export const quizProgressService = new QuizProgressService();
