
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

      const { data: allAchievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*');

      if (achievementsError) throw achievementsError;

      const { data: userAchievements, error: userAchievementsError } = await supabase
        .from('user_achievements')
        .select('achievement_id, earned_at')
        .eq('user_id', session.user.id);

      if (userAchievementsError) throw userAchievementsError;

      return allAchievements.map((achievement: Achievement) => ({
        ...achievement,
        earned: userAchievements?.some(ua => ua.achievement_id === achievement.id),
        earned_at: userAchievements?.find(ua => ua.achievement_id === achievement.id)?.earned_at
      }));
    },
    errorMessage: "Failed to load achievements"
  });

  return { achievements, loading };
};

