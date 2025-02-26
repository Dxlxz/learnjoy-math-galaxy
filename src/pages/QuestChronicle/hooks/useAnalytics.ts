
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

      const analyticsSummary: AnalyticsSummary = {
        totalQuests: questData?.length || 0,
        avgScore: questData?.reduce((acc, curr) => acc + (curr.metric_value || 0), 0) / (questData?.length || 1) || 0,
        timeSpent: questData?.reduce((acc, curr) => {
          const timeSpent = typeof curr.quest_details?.time_spent === 'number' ? curr.quest_details.time_spent : 0;
          return acc + timeSpent;
        }, 0) || 0,
        completionRate: (questData?.filter(q => 
          q.achievement_details?.completion_status === 'completed'
        ).length || 0) / (questData?.length || 1) * 100
      };

      // Get topics for category data
      const { data: topics, error: topicsError } = await supabase
        .from('topics')
        .select('id, title');

      if (topicsError) throw topicsError;

      // Get topic completions
      const { data: topicCompletions, error: topicError } = await supabase
        .from('topic_completion')
        .select('topic_id, content_completed, quest_completed')
        .eq('user_id', session.user.id);

      if (topicError) throw topicError;

      const categoryData: CategoryData[] = topics?.map(topic => {
        const completion = topicCompletions?.find(tc => tc.topic_id === topic.id);
        const completionValue = completion ? 
          ((completion.content_completed ? 50 : 0) + (completion.quest_completed ? 50 : 0)) : 0;
        
        return {
          name: topic.title,
          value: completionValue
        };
      }) || [];

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

      const analyticsData: AnalyticsData[] = questData?.map(quest => ({
        date: new Date(quest.recorded_at).toLocaleDateString(),
        value: quest.metric_value || 0,
        name: quest.metric_name || '',
        quest_details: {
          topic_id: String(quest.quest_details?.topic_id || ''),
          session_id: String(quest.quest_details?.session_id || ''),
          questions_answered: Number(quest.quest_details?.questions_answered || 0),
          correct_answers: Number(quest.quest_details?.correct_answers || 0),
          total_questions: Number(quest.quest_details?.total_questions || 0),
          difficulty_level: Number(quest.quest_details?.difficulty_level || 1),
          time_spent: Number(quest.quest_details?.time_spent || 0),
          start_time: quest.quest_details?.start_time || null,
          end_time: quest.quest_details?.end_time || null
        },
        achievement_details: {
          streak: Number(quest.achievement_details?.streak || 0),
          max_streak: Number(quest.achievement_details?.max_streak || 0),
          points_earned: Number(quest.achievement_details?.points_earned || 0),
          completion_status: String(quest.achievement_details?.completion_status || 'not_started'),
          accuracy_rate: Number(quest.achievement_details?.accuracy_rate || 0)
        }
      })) || [];

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
