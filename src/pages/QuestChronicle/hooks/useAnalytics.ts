
import { useSafeQuery } from '@/hooks/use-safe-query';
import { AnalyticsSummary, AnalyticsData } from '../types';
import { PaginatedResponse, PaginationParams } from '@/types/shared';

export const useAnalytics = (pagination?: PaginationParams) => {
  return useSafeQuery({
    queryKey: ['analytics', pagination?.page, pagination?.limit],
    queryFn: async () => {
      // Mock data for analytics visualization that matches HeroProfile
      const mockAnalyticsData: AnalyticsData[] = [
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          value: 95,
          name: 'Number Recognition Quest',
          quest_details: {
            topic_id: 'topic-1',
            questions_answered: 10,
            correct_answers: 9,
            total_questions: 10,
            difficulty_level: 2,
            time_spent: 420,
            start_time: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
            end_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            session_id: 'session-1',
            difficulty_progression: []
          },
          achievement_details: {
            streak: 3,
            max_streak: 5,
            points_earned: 95
          }
        },
        {
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          value: 88,
          name: 'Addition Adventure',
          quest_details: {
            topic_id: 'topic-2',
            questions_answered: 10,
            correct_answers: 8,
            total_questions: 10,
            difficulty_level: 2,
            time_spent: 450,
            start_time: new Date(Date.now() - 4.5 * 24 * 60 * 60 * 1000).toISOString(),
            end_time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            session_id: 'session-2',
            difficulty_progression: []
          },
          achievement_details: {
            streak: 2,
            max_streak: 5,
            points_earned: 88
          }
        },
        {
          date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          value: 92,
          name: 'Shape Explorer Challenge',
          quest_details: {
            topic_id: 'topic-3',
            questions_answered: 10,
            correct_answers: 9,
            total_questions: 10,
            difficulty_level: 2,
            time_spent: 380,
            start_time: new Date(Date.now() - 6.5 * 24 * 60 * 60 * 1000).toISOString(),
            end_time: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            session_id: 'session-3',
            difficulty_progression: []
          },
          achievement_details: {
            streak: 4,
            max_streak: 5,
            points_earned: 92
          }
        }
      ];

      // Mock analytics summary that matches HeroProfile data
      const mockSummary: AnalyticsSummary = {
        totalQuests: 11,
        avgScore: 91,
        timeSpent: 1250,
        completionRate: 95
      };

      // Mock category distribution that aligns with G3 level
      const mockCategories = [
        { name: 'Number Recognition', value: 95 },
        { name: 'Addition', value: 88 },
        { name: 'Shapes', value: 92 },
        { name: 'Place Value', value: 89 }
      ];

      // Mock performance data showing consistent high performance
      const mockPerformanceData = Array.from({ length: 7 }).map((_, index) => ({
        period: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toLocaleDateString(),
        avgScore: Math.floor(Math.random() * 11) + 85 // Random score between 85-95 to match the high average
      }));

      // Simulate pagination
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = mockAnalyticsData.slice(startIndex, endIndex);

      const paginatedResponse: PaginatedResponse<AnalyticsData> = {
        data: paginatedData,
        total: mockAnalyticsData.length,
        hasMore: endIndex < mockAnalyticsData.length
      };

      return {
        analyticsData: paginatedResponse,
        analyticsSummary: mockSummary,
        categoryData: mockCategories,
        performanceData: mockPerformanceData
      };
    },
    errorMessage: "Failed to load analytics data"
  });
};
