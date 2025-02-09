
import { supabase } from '@/integrations/supabase/client';
import { QuizSession, QuizSessionError, QuestionHistory, SessionAnalytics } from './types';

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

      console.log('[QuizSessionService] Session created successfully:', sessionData);
      return sessionData as QuizSession;
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

      console.log('[QuizSessionService] Session updated successfully:', updatedSession);
      return updatedSession as QuizSession;
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

      console.log('[QuizSessionService] Session fetched successfully:', session);
      return session as QuizSession;
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

      console.log('[QuizSessionService] Session completed successfully:', completedSession);
      return completedSession as QuizSession;
    } catch (error) {
      console.error('[QuizSessionService] Unexpected error:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): QuizSessionError {
    const sessionError = new Error(error.message || 'Quiz session error') as QuizSessionError;
    sessionError.code = error.code;
    sessionError.details = error.details;
    return sessionError;
  }
}

export const quizSessionService = new QuizSessionService();
