
import { supabase } from '@/integrations/supabase/client';

class QuizAnalyticsService {
  async recordAnalytics(
    sessionId: string,
    userId: string,
    score: number,
    currentIndex: number,
    difficultyLevel: number,
    timeSpent: number,
    streak: number
  ) {
    console.log('[QuizAnalyticsService] Recording analytics:', {
      sessionId,
      score,
      currentIndex
    });

    try {
      const analyticsData = {
        user_id: userId,
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

      const { error: analyticsError } = await supabase
        .from('quest_analytics')
        .insert(analyticsData);

      if (analyticsError) {
        console.error('[QuizAnalyticsService] Analytics insert error:', analyticsError);
        throw analyticsError;
      }

      console.log('[QuizAnalyticsService] Analytics recorded successfully');
      return analyticsData;
    } catch (error) {
      console.error('[QuizAnalyticsService] Error recording analytics:', error);
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
