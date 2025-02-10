
import { Achievement } from '@/types/shared';
import { useSafeQuery } from '@/hooks/use-safe-query';

export const useAchievements = () => {
  const { data: achievements = [], isLoading: loading } = useSafeQuery<Achievement[]>({
    queryKey: ['achievements'],
    queryFn: async () => {
      // Mock data for G3 level achievements
      const mockAchievements: Achievement[] = [
        {
          id: '1',
          title: 'Number Master',
          description: 'Complete 10 number recognition quests',
          icon_name: 'star',
          earned: true,
          earned_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          title: 'Addition Champion',
          description: 'Achieve 90%+ in addition quests',
          icon_name: 'plus',
          earned: true,
          earned_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          title: 'Subtraction Sage',
          description: 'Master subtraction with regrouping',
          icon_name: 'minus',
          earned: true,
          earned_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          title: 'Multiplication Explorer',
          description: 'Complete your first multiplication quest',
          icon_name: 'x',
          earned: true,
          earned_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '5',
          title: 'Shape Shifter',
          description: 'Identify all 2D shapes correctly',
          icon_name: 'square',
          earned: true,
          earned_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '6',
          title: 'Pattern Pro',
          description: 'Complete number pattern challenges',
          icon_name: 'repeat',
          earned: true,
          earned_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '7',
          title: 'Time Keeper',
          description: 'Master telling time to the minute',
          icon_name: 'clock',
          earned: true,
          earned_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '8',
          title: 'Fraction Friend',
          description: 'Introduction to basic fractions',
          icon_name: 'pie-chart',
          earned: true,
          earned_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '9',
          title: 'Measurement Master',
          description: 'Complete length and weight challenges',
          icon_name: 'ruler',
          earned: true,
          earned_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '10',
          title: 'Data Detective',
          description: 'Create and interpret simple graphs',
          icon_name: 'bar-chart',
          earned: true,
          earned_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '11',
          title: 'Money Manager',
          description: 'Master counting money and making change',
          icon_name: 'dollar-sign',
          earned: true,
          earned_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      return mockAchievements;
    },
    errorMessage: "Failed to load achievements"
  });

  return { achievements, loading };
};
