
import { useNavigate } from 'react-router-dom';
import { Achievement } from '@/types/shared';
import { supabase } from '@/integrations/supabase/client';
import { useSafeQuery } from '@/hooks/use-safe-query';

export const useAchievements = () => {
  const navigate = useNavigate();

  const { data: achievements = [], isLoading: loading } = useSafeQuery<Achievement[]>({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return [];
      }

      // Mock achievements data to match analytics (11 achievements, max Grade 3)
      const mockAchievements: Achievement[] = [
        {
          id: '1',
          title: 'Multiplication Master',
          description: 'Complete 10 multiplication challenges with 100% accuracy',
          icon_name: 'Calculator',
          earned: true,
          earned_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          title: 'Division Champion',
          description: 'Successfully solve 15 division problems',
          icon_name: 'DivideCircle',
          earned: true,
          earned_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          title: 'Pattern Detective',
          description: 'Identify and complete 5 complex number patterns',
          icon_name: 'Search',
          earned: true,
          earned_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          title: 'Fraction Explorer',
          description: 'Master basic fractions and equivalents',
          icon_name: 'PieChart',
          earned: true,
          earned_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '5',
          title: 'Time Wizard',
          description: 'Perfect score in telling time and solving time problems',
          icon_name: 'Clock',
          earned: true,
          earned_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '6',
          title: 'Measurement Hero',
          description: 'Complete all measurement conversion challenges',
          icon_name: 'Ruler',
          earned: true,
          earned_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '7',
          title: 'Shape Master',
          description: 'Identify and describe all 2D and 3D shapes',
          icon_name: 'Square',
          earned: true,
          earned_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '8',
          title: 'Number Ninja',
          description: 'Solve 20 multi-step word problems',
          icon_name: 'Swords',
          earned: true,
          earned_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '9',
          title: 'Data Explorer',
          description: 'Create and interpret 5 different types of graphs',
          icon_name: 'BarChart',
          earned: true,
          earned_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '10',
          title: 'Money Manager',
          description: 'Master counting money and making change',
          icon_name: 'Coins',
          earned: true,
          earned_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '11',
          title: 'Problem Solver Elite',
          description: 'Complete all Grade 3 challenge quests',
          icon_name: 'Trophy',
          earned: true,
          earned_at: new Date().toISOString()
        }
      ];

      return mockAchievements;
    },
    errorMessage: "Failed to load achievements"
  });

  return { achievements, loading };
};
