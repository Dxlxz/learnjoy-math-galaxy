
import { useSafeQuery } from '@/hooks/use-safe-query';
import { supabase } from '@/integrations/supabase/client';
import { AnalyticsSummary, AnalyticsData, QuestDetails, AchievementDetails } from '../types';
import { PaginatedResponse, PaginationParams } from '@/types/shared';
import { isQuestDetails, isAchievementDetails } from '@/services/quiz/types';

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

      console.log('[useAnalytics] Fetching analytics with pagination:', { page, limit, offset });

      // Get total count first
      const { count } = await supabase
        .from('quest_analytics')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

      console.log('[useAnalytics] Total count:', count);

      // Get paginated data
      const { data, error } = await supabase
        .from('quest_analytics')
        .select('*')
        .eq('user_id', session.user.id)
        .order('recorded_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('[useAnalytics] Error fetching analytics:', error);
        throw error;
      }

      if (!data) {
        console.log('[useAnalytics] No data returned');
        return {
          analyticsData: { data: [], total: 0, hasMore: false },
          analyticsSummary: {
            totalQuests: 0,
            avgScore: 0,
            timeSpent: 0,
            completionRate: 0
          },
          categoryData: [],
          performanceData: []
        };
      }

      console.log('[useAnalytics] Processing analytics data:', data.length, 'records');

      // Transform data for timeline display with proper type validation
      const transformedData: AnalyticsData[] = data.map(item => {
        const questDetailsRaw = item.quest_details || {};
        const achievementDetailsRaw = item.achievement_details || {};

        if (!isQuestDetails(questDetailsRaw)) {
          console.error('[useAnalytics] Invalid quest details:', questDetailsRaw);
          throw new Error('Invalid quest details structure in analytics data');
        }

        if (!isAchievementDetails(achievementDetailsRaw)) {
          console.error('[useAnalytics] Invalid achievement details:', achievementDetailsRaw);
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

      console.log('[useAnalytics] Data transformed successfully');

      // Calculate analytics summary with validated data
      const summary: AnalyticsSummary = {
        totalQuests: data.filter(d => d.metric_name === 'Quest Score').length,
        avgScore: data.filter(d => d.metric_name === 'Quest Score')
          .reduce((acc, curr) => acc + curr.metric_value, 0) / 
          (data.filter(d => d.metric_name === 'Quest Score').length || 1),
        timeSpent: Math.round(data.reduce((acc, curr) => {
          const questDetailsRaw = curr.quest_details || {};
          if (!isQuestDetails(questDetailsRaw)) {
            console.error('[useAnalytics] Invalid quest details for timeSpent:', questDetailsRaw);
            return acc;
          }
          return acc + questDetailsRaw.time_spent;
        }, 0)),
        completionRate: Math.round((data.filter(d => d.metric_value >= 70).length / (data.length || 1)) * 100)
      };

      // Calculate category distribution
      const categories = data.reduce((acc: Record<string, number>, curr) => {
        if (!acc[curr.category]) {
          acc[curr.category] = 0;
        }
        acc[curr.category] += curr.metric_value;
        return acc;
      }, {});

      const categoryChartData = Object.entries(categories).map(([name, value]) => ({
        name,
        value: Math.round(value)
      }));

      // Calculate performance over time
      const performanceByPeriod = data.reduce((acc: Record<string, any>, curr) => {
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

      const performanceChartData = Object.values(performanceByPeriod).map((item: any) => ({
        period: item.period,
        avgScore: Math.round(item.score / item.count)
      }));

      console.log('[useAnalytics] Analytics processing complete');

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
    errorMessage: "Failed to load your quest analytics. Please try again later.",
    meta: {
      onError: (error: Error) => {
        console.error('[useAnalytics] Error in hook:', error);
      }
    }
  });
};
