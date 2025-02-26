
import { supabase } from '@/integrations/supabase/client';
import { useSafeQuery } from '@/hooks/use-safe-query';
import { AnalyticsSummary, AnalyticsData, CategoryData } from '../types';
import { PaginatedResponse, PaginationParams } from '@/types/shared';

export const useAnalytics = (pagination?: PaginationParams) => {
  return useSafeQuery({
    queryKey: ['analytics', pagination?.page, pagination?.limit],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Fetch quest analytics
      const { data: questData, error: questError } = await supabase
        .from('quest_analytics')
        .select('*')
        .eq('user_id', session.user.id)
        .order('recorded_at', { ascending: false });

      if (questError) throw questError;

      // Calculate analytics summary
      const analyticsSummary: AnalyticsSummary = {
        totalQuests: questData?.length || 0,
        avgScore: questData?.reduce((acc, curr) => acc + (curr.metric_value || 0), 0) / (questData?.length || 1) || 0,
        timeSpent: questData?.reduce((acc, curr) => {
          const timeSpent = curr.quest_details?.time_spent;
          return acc + (typeof timeSpent === 'number' ? timeSpent : 0);
        }, 0) || 0,
        completionRate: (questData?.filter(q => {
          const status = curr.achievement_details?.completion_status;
          return status === 'completed';
        }).length || 0) / (questData?.length || 1) * 100
      };

      // Get category performance data
      const { data: topicCompletions, error: topicError } = await supabase
        .from('topic_completion')
        .select('topic_id, content_completed, quest_completed')
        .eq('user_id', session.user.id);

      if (topicError) throw topicError;

      // Get topics to map category data
      const { data: topics, error: topicsError } = await supabase
        .from('topics')
        .select('id, title');

      if (topicsError) throw topicsError;

      // Calculate category performance
      const categoryData: CategoryData[] = topics?.map(topic => {
        const completion = topicCompletions?.find(tc => tc.topic_id === topic.id);
        const completionValue = completion ? 
          ((completion.content_completed ? 50 : 0) + (completion.quest_completed ? 50 : 0)) : 0;
        
        return {
          name: topic.title,
          value: completionValue
        };
      }) || [];

      // Calculate performance over time
      const performanceData = questData?.reduce((acc: any[], quest) => {
        const date = new Date(quest.recorded_at).toLocaleDateString();
        const existingEntry = acc.find(entry => entry.period === date);

        if (existingEntry) {
          existingEntry.avgScore = (existingEntry.avgScore + (quest.metric_value || 0)) / 2;
        } else {
          acc.push({
            period: date,
            avgScore: quest.metric_value || 0
          });
        }
        return acc;
      }, []) || [];

      // Transform quest data into analytics data format
      const analyticsData: AnalyticsData[] = questData?.map(quest => ({
        date: new Date(quest.recorded_at).toLocaleDateString(),
        value: quest.metric_value || 0,
        name: quest.metric_name || '',
        quest_details: {
          topic_id: quest.quest_details?.topic_id || '',
          session_id: quest.quest_details?.session_id || '',
          questions_answered: quest.quest_details?.questions_answered || 0,
          correct_answers: quest.quest_details?.correct_answers || 0,
          total_questions: quest.quest_details?.total_questions || 0,
          difficulty_level: quest.quest_details?.difficulty_level || 1,
          time_spent: quest.quest_details?.time_spent || 0,
          start_time: quest.quest_details?.start_time || null,
          end_time: quest.quest_details?.end_time || null
        },
        achievement_details: {
          streak: quest.achievement_details?.streak || 0,
          max_streak: quest.achievement_details?.max_streak || 0,
          points_earned: quest.achievement_details?.points_earned || 0,
          completion_status: quest.achievement_details?.completion_status || 'not_started',
          accuracy_rate: quest.achievement_details?.accuracy_rate || 0
        }
      })) || [];

      // Get paginated analytics data
      const paginatedData: PaginatedResponse<AnalyticsData> = {
        data: analyticsData,
        total: analyticsData.length,
        hasMore: false
      };

      return {
        analyticsData: paginatedData,
        analyticsSummary,
        categoryData,
        performanceData
      };
    },
    errorMessage: "Failed to load analytics data"
  });
};
