
import { useSafeQuery } from '@/hooks/use-safe-query';
import { AnalyticsSummary, AnalyticsData } from '../types';
import { PaginatedResponse, PaginationParams } from '@/types/shared';

export const useAnalytics = (pagination?: PaginationParams) => {
  return useSafeQuery({
    queryKey: ['analytics', pagination?.page, pagination?.limit],
    queryFn: async () => {
      // Mock data for analytics visualization
      const mockAnalyticsData: AnalyticsData[] = Array.from({ length: 10 }).map((_, index) => ({
        date: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toLocaleDateString(),
        value: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
        name: 'Quest Score',
        quest_details: {
          topic_id: `topic-${index}`,
          questions_answered: Math.floor(Math.random() * 5) + 5,
          correct_answers: Math.floor(Math.random() * 5) + 5,
          total_questions: 10,
          difficulty_level: Math.floor(Math.random() * 3) + 1,
          time_spent: Math.floor(Math.random() * 600) + 300, // 5-15 minutes
          start_time: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
          session_id: `session-${index}`,
          difficulty_progression: []
        },
        achievement_details: {
          streak: Math.floor(Math.random() * 5),
          max_streak: 5,
          points_earned: Math.floor(Math.random() * 100) + 50
        }
      }));

      // Mock analytics summary
      const mockSummary: AnalyticsSummary = {
        totalQuests: 45,
        avgScore: 85,
        timeSpent: 1200,
        completionRate: 92
      };

      // Mock category distribution
      const mockCategories = [
        { name: 'Addition', value: 85 },
        { name: 'Subtraction', value: 78 },
        { name: 'Multiplication', value: 92 },
        { name: 'Division', value: 88 }
      ];

      // Mock performance data
      const mockPerformanceData = Array.from({ length: 7 }).map((_, index) => ({
        period: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toLocaleDateString(),
        avgScore: Math.floor(Math.random() * 20) + 80 // Random score between 80-100
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
