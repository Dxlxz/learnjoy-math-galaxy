
import { supabase } from '@/integrations/supabase/client';
import { analyticsQueue } from './analyticsQueue';
import { AnalyticsData } from './types';

class QuizAnalyticsService {
  async recordAnalytics(
    sessionId: string,
    userId: string,
    score: number,
    currentIndex: number,
    difficultyLevel: number,
    timeSpent: number,
    streak: number
  ): Promise<AnalyticsData> {
    console.log('[QuizAnalyticsService] Recording analytics:', {
      sessionId,
      score,
      currentIndex
    });

    try {
      // Get user profile to ensure it exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        console.error('[QuizAnalyticsService] User profile not found:', profileError);
        throw new Error('User profile not found');
      }

      const analyticsData: AnalyticsData = {
        user_id: profile.id,
        metric_name: 'Quest Score',
        metric_value: Math.max(0, score),
        category: 'Learning Progress',
        recorded_at: new Date().toISOString(),
        quest_details: {
          session_id: sessionId,
          questions_answered: currentIndex + 1,
          correct_answers: Math.floor(score / 10),
          total_questions: currentIndex + 1,
          difficulty_level: difficultyLevel,
          time_spent: timeSpent,
          start_time: new Date(Date.now() - timeSpent * 1000).toISOString(),
          end_time: new Date().toISOString()
        },
        achievement_details: {
          streak,
          max_streak: Math.max(streak, 0),
          points_earned: Math.max(0, score),
          completion_status: 'completed',
          accuracy_rate: (score / ((currentIndex + 1) * 10)) * 100,
          levels_progressed: difficultyLevel,
          total_time: timeSpent,
          session_achievements: {
            perfect_score: (score / ((currentIndex + 1) * 10)) === 1,
            speed_bonus: timeSpent < (currentIndex + 1) * 30,
            difficulty_mastery: difficultyLevel >= 3
          }
        }
      };

      // Use the analyticsQueue to handle the insert
      await analyticsQueue.enqueue('recordQuizAnalytics', analyticsData);
      console.log('[QuizAnalyticsService] Analytics queued successfully');
      return analyticsData;
    } catch (error) {
      console.error('[QuizAnalyticsService] Error queueing analytics:', error);
      throw error;
    }
  }

  async getUserAnalytics(userId: string) {
    try {
      const { data: analytics, error } = await supabase
        .from('quest_analytics')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      return analytics;
    } catch (error) {
      console.error('[QuizAnalyticsService] Error fetching user analytics:', error);
      throw error;
    }
  }

  async getSessionAnalytics(sessionId: string) {
    try {
      const { data: analytics, error } = await supabase
        .from('quest_analytics')
        .select('*')
        .eq('quest_details->session_id', sessionId)
        .single();

      if (error) throw error;
      return analytics;
    } catch (error) {
      console.error('[QuizAnalyticsService] Error fetching session analytics:', error);
      throw error;
    }
  }
}

export const quizAnalyticsService = new QuizAnalyticsService();
