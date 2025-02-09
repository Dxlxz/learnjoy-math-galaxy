
import { supabase } from '@/integrations/supabase/client';
import { 
  QuizSession, 
  QuizSessionError, 
  QuestionHistory, 
  SessionAnalytics,
  validateQuestionHistory,
  validateSessionAnalytics,
  validateStreakData
} from './types';

class QuizSessionService {
  private async getAuthUserId(): Promise<string> {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session?.user) {
      throw new Error('No authenticated user found');
    }
    return session.user.id;
  }

  async createSession(topicId: string): Promise<QuizSession> {
    try {
      console.log('[QuizSessionService] Creating new session for topic:', topicId);
      const userId = await this.getAuthUserId();

      const { data: sessionData, error: sessionError } = await supabase
        .from('quiz_sessions')
        .insert({
          user_id: userId,
          topic_id: topicId,
          total_questions: 10,
          correct_answers: 0,
          final_score: 0,
          status: 'in_progress',
          questions_answered: 0,
          max_questions: 10
        })
        .select()
        .single();

      if (sessionError) {
        console.error('[QuizSessionService] Error creating session:', sessionError);
        throw this.handleError(sessionError);
      }

      return this.transformSessionData(sessionData);
    } catch (error) {
      console.error('[QuizSessionService] Unexpected error:', error);
      throw this.handleError(error);
    }
  }

  async updateSession(
    sessionId: string,
    updates: Partial<QuizSession>
  ): Promise<QuizSession> {
    try {
      console.log('[QuizSessionService] Updating session:', { sessionId, updates });

      const { data: updatedSession, error: updateError } = await supabase
        .from('quiz_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single();

      if (updateError) {
        console.error('[QuizSessionService] Error updating session:', updateError);
        throw this.handleError(updateError);
      }

      return this.transformSessionData(updatedSession);
    } catch (error) {
      console.error('[QuizSessionService] Unexpected error:', error);
      throw this.handleError(error);
    }
  }

  async getSession(sessionId: string): Promise<QuizSession> {
    try {
      console.log('[QuizSessionService] Fetching session:', sessionId);

      const { data: session, error: sessionError } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) {
        console.error('[QuizSessionService] Error fetching session:', sessionError);
        throw this.handleError(sessionError);
      }

      return this.transformSessionData(session);
    } catch (error) {
      console.error('[QuizSessionService] Unexpected error:', error);
      throw this.handleError(error);
    }
  }

  async completeSession(
    sessionId: string,
    finalScore: number,
    analyticsData: SessionAnalytics
  ): Promise<QuizSession> {
    try {
      console.log('[QuizSessionService] Completing session:', {
        sessionId,
        finalScore,
        analyticsData
      });

      const { data: completedSession, error: completionError } = await supabase
        .from('quiz_sessions')
        .update({
          final_score: finalScore,
          status: 'completed',
          end_time: new Date().toISOString(),
          analytics_data: analyticsData
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (completionError) {
        console.error('[QuizSessionService] Error completing session:', completionError);
        throw this.handleError(completionError);
      }

      return this.transformSessionData(completedSession);
    } catch (error) {
      console.error('[QuizSessionService] Unexpected error:', error);
      throw this.handleError(error);
    }
  }

  private transformSessionData(data: any): QuizSession {
    if (!data) throw new Error('No session data provided');

    return {
      id: data.id,
      user_id: data.user_id,
      topic_id: data.topic_id,
      questions_answered: data.questions_answered || 0,
      correct_answers: data.correct_answers || 0,
      final_score: data.final_score || 0,
      status: data.status || 'in_progress',
      question_history: validateQuestionHistory(data.question_history),
      analytics_data: validateSessionAnalytics(data.analytics_data),
      current_streak: data.current_streak || 0,
      max_streak: data.max_streak || 0,
      streak_data: validateStreakData(data.streak_data)
    };
  }

  private handleError(error: any): QuizSessionError {
    const sessionError = new Error(error.message || 'Quiz session error') as QuizSessionError;
    sessionError.code = error.code;
    sessionError.details = error.details;
    return sessionError;
  }
}

export const quizSessionService = new QuizSessionService();
