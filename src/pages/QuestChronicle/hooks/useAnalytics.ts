
import { useSafeQuery } from '@/hooks/use-safe-query';
import { supabase } from '@/integrations/supabase/client';
import { AnalyticsSummary } from '../types';
import { PaginatedResponse, PaginationParams } from '@/types/shared';

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

      // Transform data for timeline display
      const transformedData = (data || []).map(item => ({
        date: new Date(item.recorded_at).toLocaleDateString(),
        value: item.metric_value,
        name: item.metric_name,
        quest_details: item.quest_details,
        achievement_details: item.achievement_details
      }));

      // Calculate analytics summary
      const summary: AnalyticsSummary = {
        totalQuests: data?.filter(d => d.metric_name === 'Quest Score').length || 0,
        avgScore: data?.filter(d => d.metric_name === 'Quest Score')
          .reduce((acc, curr) => acc + curr.metric_value, 0) / 
          (data?.filter(d => d.metric_name === 'Quest Score').length || 1),
        timeSpent: Math.round(data?.filter(d => d.quest_details?.time_spent)
          .reduce((acc, curr) => acc + (curr.quest_details?.time_spent || 0), 0) || 0),
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

      const paginatedResponse: PaginatedResponse<any> = {
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
