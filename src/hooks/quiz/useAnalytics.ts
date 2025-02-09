
import { useSafeQuery } from '@/hooks/use-safe-query';
import { supabase } from '@/integrations/supabase/client';
import { AnalyticsSummary, AnalyticsData, QuestDetails, AchievementDetails } from '../types';
import { PaginatedResponse, PaginationParams } from '@/types/shared';

// Type guard for QuestDetails
const isQuestDetails = (obj: any): obj is QuestDetails => {
  return obj 
    && typeof obj === 'object'
    && 'session_id' in obj
    && 'questions_answered' in obj
    && 'correct_answers' in obj
    && 'total_questions' in obj
    && 'difficulty_level' in obj
    && 'time_spent' in obj
    && 'start_time' in obj
    && 'end_time' in obj
    && 'topic_id' in obj;
};

// Type guard for AchievementDetails
const isAchievementDetails = (obj: any): obj is AchievementDetails => {
  return obj 
    && typeof obj === 'object'
    && 'streak' in obj
    && 'max_streak' in obj
    && 'points_earned' in obj;
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

        if (!isQuestDetails(questDetailsRaw)) {
          console.error('Invalid quest details structure:', questDetailsRaw);
          throw new Error('Invalid quest details structure in analytics data');
        }

        if (!isAchievementDetails(achievementDetailsRaw)) {
          console.error('Invalid achievement details structure:', achievementDetailsRaw);
          throw new Error('Invalid achievement details structure in analytics data');
        }

        return {
          date: new Date(item.recorded_at).toLocaleDateString(),
          value: item.metric_value,
          name: item.metric_name,
          quest_details: questDetailsRaw,
          achievement_details: achievementDetailsRaw
        };
      });

      // Calculate analytics summary with validated data
      const summary: AnalyticsSummary = {
        totalQuests: data?.filter(d => d.metric_name === 'Quest Score').length || 0,
        avgScore: data?.filter(d => d.metric_name === 'Quest Score')
          .reduce((acc, curr) => acc + curr.metric_value, 0) / 
          (data?.filter(d => d.metric_name === 'Quest Score').length || 1),
        timeSpent: Math.round(data?.reduce((acc, curr) => {
          const questDetailsRaw = curr.quest_details || {};
          if (!isQuestDetails(questDetailsRaw)) {
            console.error('Invalid quest details structure:', questDetailsRaw);
            return acc;
          }
          return acc + questDetailsRaw.time_spent;
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
