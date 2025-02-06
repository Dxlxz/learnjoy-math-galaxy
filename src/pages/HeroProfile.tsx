
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Loader } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import FloatingNav from '@/components/navigation/FloatingNav';
import { useAuth } from '@/contexts/AuthContext';
import HeroBanner from '@/components/hero/HeroBanner';
import RecentAdventures from '@/components/hero/RecentAdventures';
import QuickActions from '@/components/hero/QuickActions';
import { supabase } from "@/integrations/supabase/client";

interface LearningStats {
  total_completed: number;
  average_score: number;
  recent_topics: { title: string; completed_at: string }[];
}

const HeroProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const { data: stats, isLoading: isLoadingStats, error: statsError } = useQuery({
    queryKey: ['learning-stats', user?.id],
    queryFn: async (): Promise<LearningStats> => {
      if (!user) throw new Error('No user found');

      const { data: progressData, error: progressError } = await supabase
        .from('learning_progress')
        .select(`
          *,
          content (
            title
          )
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (progressError) throw progressError;

      // Calculate stats
      const totalCompleted = progressData.length;
      const averageScore = progressData.length > 0
        ? progressData.reduce((acc: number, curr: any) => acc + (curr.score || 0), 0) / progressData.length
        : 0;
      const recentTopics = progressData
        .slice(0, 3)
        .map((progress: any) => ({
          title: progress.content?.title || 'Unknown Topic',
          completed_at: progress.completed_at
        }));

      return {
        total_completed: totalCompleted,
        average_score: Math.round(averageScore),
        recent_topics: recentTopics
      };
    },
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
    retry: 2,
  });

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Check welcome onboarding completion
    if (!profile?.onboarding_completed) {
      navigate('/welcome-onboarding');
      return;
    }

    // Check if profile setup is completed
    if (!profile?.profile_setup_completed) {
      navigate('/hero-profile-setup');
      return;
    }

    // Check if starter challenge is completed
    if (!profile?.starter_challenge_completed) {
      navigate('/starter-challenge');
      return;
    }
  }, [navigate, user, profile]);

  if (statsError) {
    toast({
      variant: "destructive",
      title: "Error loading profile",
      description: statsError instanceof Error ? statsError.message : "An error occurred",
    });
  }

  if (isLoadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white">
        <div className="text-center space-y-4">
          <Loader className="h-8 w-8 animate-spin mx-auto text-primary" />
          <h2 className="text-2xl font-bold text-primary">Loading your hero profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <HeroBanner 
          heroName={profile?.hero_name || ''}
          grade={profile?.grade || ''}
          stats={{
            total_completed: stats?.total_completed || 0,
            average_score: stats?.average_score || 0
          }}
        />
        <RecentAdventures recentTopics={stats?.recent_topics || []} />
        <QuickActions />
      </div>
      <FloatingNav />
    </div>
  );
};

export default HeroProfile;
