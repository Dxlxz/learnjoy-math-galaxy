
import { useSafeQuery } from '@/hooks/use-safe-query';
import { supabase } from '@/integrations/supabase/client';
import { AnalyticsSummary } from '../types';

export const useAnalytics = () => {
  return useSafeQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('analytics_data')
        .select('*')
        .eq('user_id', session.user.id)
        .order('recorded_at', { ascending: false });

      if (error) throw error;

      const transformedData = (data || []).map(item => ({
        date: new Date(item.recorded_at).toLocaleDateString(),
        value: item.metric_value,
        name: item.metric_name,
      }));

      const summary = {
        totalQuests: data?.length || 0,
        avgScore: data?.reduce((acc, curr) => acc + curr.metric_value, 0) / (data?.length || 1),
        timeSpent: data?.reduce((acc, curr) => acc + (curr.metric_name === 'time_spent' ? curr.metric_value : 0), 0),
        completionRate: (data?.filter(d => d.metric_value >= 70).length / (data?.length || 1)) * 100
      };

      const categories = data?.reduce((acc: any, curr) => {
        if (!acc[curr.category]) {
          acc[curr.category] = 0;
        }
        acc[curr.category] += curr.metric_value;
        return acc;
      }, {});

      const categoryChartData = Object.entries(categories || {}).map(([name, value]) => ({
        name,
        value
      }));

      const performanceByPeriod = data?.reduce((acc: any, curr) => {
        const period = new Date(curr.period_start).toLocaleDateString();
        if (!acc[period]) {
          acc[period] = {
            period,
            score: 0,
            count: 0
          };
        }
        acc[period].score += curr.metric_value;
        acc[period].count += 1;
        return acc;
      }, {});

      const performanceChartData = Object.values(performanceByPeriod || {}).map((item: any) => ({
        period: item.period,
        avgScore: item.score / item.count
      }));

      return {
        analyticsData: transformedData,
        analyticsSummary: summary,
        categoryData: categoryChartData,
        performanceData: performanceChartData
      };
    },
    errorMessage: "Failed to load analytics data"
  });
};
