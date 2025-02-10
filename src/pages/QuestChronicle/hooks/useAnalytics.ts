
import { useSafeQuery } from '@/hooks/use-safe-query';
import { supabase } from '@/integrations/supabase/client';
import { AnalyticsSummary, AnalyticsData, QuestDetails, AchievementDetails } from '../types';
import { PaginatedResponse, PaginationParams } from '@/types/shared';

// Type guard for QuestDetails - modified to be more flexible
const isQuestDetails = (obj: any): obj is QuestDetails => {
  return obj 
    && typeof obj === 'object'
    && (
      // Check for essential properties
      ('topic_id' in obj || 'topicId' in obj)
      && ('questions_answered' in obj || 'questionsAnswered' in obj)
      && ('correct_answers' in obj || 'correctAnswers' in obj)
      && ('total_questions' in obj || 'totalQuestions' in obj)
      && ('difficulty_level' in obj || 'difficultyLevel' in obj)
      && ('time_spent' in obj || 'timeSpent' in obj)
      && ('start_time' in obj || 'startTime' in obj)
      && ('end_time' in obj || 'endTime' in obj)
      && ('session_id' in obj || 'sessionId' in obj)
    );
};

// Type guard for AchievementDetails
const isAchievementDetails = (obj: any): obj is AchievementDetails => {
  const defaultAchievementDetails = {
    streak: 0,
    max_streak: 0,
    points_earned: 0
  };

  // If object is empty or undefined, return default values
  if (!obj || Object.keys(obj).length === 0) {
    return true;
  }

  return obj 
    && typeof obj === 'object'
    && ('streak' in obj || 'currentStreak' in obj)
    && ('max_streak' in obj || 'maxStreak' in obj)
    && ('points_earned' in obj || 'pointsEarned' in obj);
};

export const useAnalytics = (pagination?: PaginationParams) => {
  return useSafeQuery({
    queryKey: ['analytics', pagination?.page, pagination?.limit],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated');
      }

      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const offset = (page - 1) * limit;

      // Get total count first
      const { count } = await supabase
        .from('quest_analytics')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

      // Get paginated data
      const { data, error } = await supabase
        .from('quest_analytics')
        .select('*')
        .eq('user_id', session.user.id)
        .order('recorded_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      // Transform data for timeline display with proper type validation
      const transformedData: AnalyticsData[] = (data || []).map(item => {
        const questDetailsRaw = item.quest_details || {};
        const achievementDetailsRaw = item.achievement_details || {};

        // Log the raw data for debugging
        console.log('Processing quest details:', questDetailsRaw);

        if (!isQuestDetails(questDetailsRaw)) {
          console.error('Invalid quest details structure:', questDetailsRaw);
          // Provide default values instead of throwing error
          questDetailsRaw.topic_id = questDetailsRaw.topic_id || null;
          questDetailsRaw.questions_answered = questDetailsRaw.questions_answered || 0;
          questDetailsRaw.correct_answers = questDetailsRaw.correct_answers || 0;
          questDetailsRaw.total_questions = questDetailsRaw.total_questions || 0;
          questDetailsRaw.difficulty_level = questDetailsRaw.difficulty_level || 1;
          questDetailsRaw.time_spent = questDetailsRaw.time_spent || 0;
          questDetailsRaw.start_time = questDetailsRaw.start_time || null;
          questDetailsRaw.end_time = questDetailsRaw.end_time || null;
          questDetailsRaw.session_id = questDetailsRaw.session_id || null;
        }

        if (!isAchievementDetails(achievementDetailsRaw)) {
          console.error('Invalid achievement details structure:', achievementDetailsRaw);
          // Provide default values instead of throwing error
          achievementDetailsRaw.streak = achievementDetailsRaw.streak || 0;
          achievementDetailsRaw.max_streak = achievementDetailsRaw.max_streak || 0;
          achievementDetailsRaw.points_earned = achievementDetailsRaw.points_earned || 0;
        }

        return {
          date: new Date(item.recorded_at).toLocaleDateString(),
          value: item.metric_value,
          name: item.metric_name,
          quest_details: questDetailsRaw as QuestDetails,
          achievement_details: achievementDetailsRaw as AchievementDetails
        };
      });

      // Calculate analytics summary
      const summary: AnalyticsSummary = {
        totalQuests: data?.filter(d => d.metric_name === 'Quest Score').length || 0,
        avgScore: data?.filter(d => d.metric_name === 'Quest Score')
          .reduce((acc, curr) => acc + curr.metric_value, 0) / 
          (data?.filter(d => d.metric_name === 'Quest Score').length || 1),
        timeSpent: Math.round(data?.reduce((acc, curr) => {
          const questDetailsRaw = curr.quest_details || {};
          return acc + (questDetailsRaw.time_spent || 0);
        }, 0) || 0),
        completionRate: Math.round((data?.filter(d => d.metric_value >= 70).length / (data?.length || 1)) * 100)
      };

      // Calculate category distribution
      const categories = data?.reduce((acc: Record<string, number>, curr) => {
        if (!acc[curr.category]) {
          acc[curr.category] = 0;
        }
        acc[curr.category] += curr.metric_value;
        return acc;
      }, {});

      const categoryChartData = Object.entries(categories || {}).map(([name, value]) => ({
        name,
        value: Math.round(value)
      }));

      // Calculate performance over time
      const performanceByPeriod = data?.reduce((acc: Record<string, any>, curr) => {
        const period = new Date(curr.recorded_at).toLocaleDateString();
        if (!acc[period]) {
          acc[period] = {
            period,
            score: 0,
            count: 0
          };
        }
        if (curr.metric_name === 'Quest Score') {
          acc[period].score += curr.metric_value;
          acc[period].count += 1;
        }
        return acc;
      }, {});

      const performanceChartData = Object.values(performanceByPeriod || {}).map((item: any) => ({
        period: item.period,
        avgScore: Math.round(item.score / item.count)
      }));

      const paginatedResponse: PaginatedResponse<AnalyticsData> = {
        data: transformedData,
        total: count || 0,
        hasMore: offset + data.length < (count || 0)
      };

      return {
        analyticsData: paginatedResponse,
        analyticsSummary: summary,
        categoryData: categoryChartData,
        performanceData: performanceChartData
      };
    },
    errorMessage: "Failed to load analytics data"
  });
};
