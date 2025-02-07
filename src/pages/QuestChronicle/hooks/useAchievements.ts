
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Achievement } from '@/types/shared';

export const useAchievements = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
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

        const achievementsWithStatus = allAchievements.map((achievement: Achievement) => ({
          ...achievement,
          earned: userAchievements?.some(ua => ua.achievement_id === achievement.id),
          earned_at: userAchievements?.find(ua => ua.achievement_id === achievement.id)?.earned_at
        }));

        setAchievements(achievementsWithStatus);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading achievements",
          description: error instanceof Error ? error.message : "Failed to load achievements",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [navigate, toast]);

  return { achievements, loading };
};
