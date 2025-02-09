
import { supabase } from '@/integrations/supabase/client';
import { analyticsQueue } from './analyticsQueue';
import { AnalyticsData } from './types';
import { toast } from '@/hooks/use-toast';

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
        .maybeSingle();

      if (profileError) {
        console.error('[QuizAnalyticsService] Profile fetch error:', profileError);
        toast({
          variant: "destructive",
          title: "Error recording analytics",
          description: "Could not fetch user profile. Please try again."
        });
        throw new Error('Failed to fetch user profile');
      }

      if (!profile) {
        console.error('[QuizAnalyticsService] User profile not found');
        toast({
          variant: "destructive",
          title: "Error recording analytics",
          description: "User profile not found. Please try again."
        });
        throw new Error('User profile not found');
      }

      // Get quiz session to get topic_id
      const { data: session, error: sessionError } = await supabase
        .from('quiz_sessions')
        .select('topic_id')
        .eq('id', sessionId)
        .maybeSingle();

      if (sessionError) {
        console.error('[QuizAnalyticsService] Session fetch error:', sessionError);
        toast({
          variant: "destructive",
          title: "Error recording analytics",
          description: "Could not fetch quiz session data. Please try again."
        });
        throw new Error('Failed to fetch quiz session');
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
          end_time: new Date().toISOString(),
          topic_id: session?.topic_id || null
        },
        achievement_details: {
          streak,
          max_streak: Math.max(streak, 0),
          points_earned: Math.max(0, score)
        }
      };

      // Use the analyticsQueue to handle the insert
      await analyticsQueue.enqueue('recordQuizAnalytics', analyticsData);
      console.log('[QuizAnalyticsService] Analytics queued successfully');
      
      toast({
        title: "Analytics recorded",
        description: "Your quest progress has been saved successfully."
      });
      
      return analyticsData;
    } catch (error) {
      console.error('[QuizAnalyticsService] Error queueing analytics:', error);
      toast({
        variant: "destructive",
        title: "Error recording analytics",
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
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

      if (error) {
        console.error('[QuizAnalyticsService] Analytics fetch error:', error);
        toast({
          variant: "destructive",
          title: "Error fetching analytics",
          description: "Could not load your quest history. Please try again."
        });
        throw error;
      }

      return analytics;
    } catch (error) {
      console.error('[QuizAnalyticsService] Error fetching user analytics:', error);
      toast({
        variant: "destructive",
        title: "Error fetching analytics",
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
      throw error;
    }
  }

  async getSessionAnalytics(sessionId: string) {
    try {
      const { data: analytics, error } = await supabase
        .from('quest_analytics')
        .select('*')
        .eq('quest_details->>session_id', sessionId)
        .maybeSingle();

      if (error) {
        console.error('[QuizAnalyticsService] Session analytics fetch error:', error);
        toast({
          variant: "destructive",
          title: "Error fetching session analytics",
          description: "Could not load session details. Please try again."
        });
        throw error;
      }

      return analytics;
    } catch (error) {
      console.error('[QuizAnalyticsService] Error fetching session analytics:', error);
      toast({
        variant: "destructive",
        title: "Error fetching session analytics",
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
      throw error;
    }
  }
}

export const quizAnalyticsService = new QuizAnalyticsService();

