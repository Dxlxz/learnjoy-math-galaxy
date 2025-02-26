
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Book, GamepadIcon, Map, Crown, Loader, ScrollText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSafeQuery } from '@/hooks/use-safe-query';
import FloatingNav from '@/components/navigation/FloatingNav';

interface HeroStats {
  totalCompleted: number;
  averageScore: number;
  recentTopics: {
    title: string;
    completedAt: string;
    score: number;
    type: string;
  }[];
}

const HeroProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: profile, isLoading: profileLoading } = useSafeQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return null;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) throw profileError;
      return profileData;
    },
    errorMessage: "Failed to load profile"
  });

  const { data: stats, isLoading: statsLoading } = useSafeQuery({
    queryKey: ['hero-stats'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      // Get completed topics
      const { data: completedTopics, error: topicsError } = await supabase
        .from('topic_completion')
        .select('*, topics!inner(*)')
        .eq('user_id', session.user.id)
        .eq('content_completed', true)
        .eq('quest_completed', true);

      if (topicsError) throw topicsError;

      // Get quiz scores
      const { data: quizScores, error: scoresError } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'completed')
        .order('end_time', { ascending: false })
        .limit(3);

      if (scoresError) throw scoresError;

      // Calculate average score
      const avgScore = quizScores?.length ? 
        quizScores.reduce((acc, curr) => acc + (curr.final_score || 0), 0) / quizScores.length : 
        0;

      // Get recent topics with scores
      const recentTopics = await Promise.all(
        (quizScores || []).map(async (score) => {
          const { data: topic } = await supabase
            .from('topics')
            .select('title')
            .eq('id', score.topic_id)
            .single();

          return {
            title: topic?.title || 'Unknown Topic',
            completedAt: score.end_time || new Date().toISOString(),
            score: score.final_score || 0,
            type: 'quest'
          };
        })
      );

      return {
        totalCompleted: completedTopics?.length || 0,
        averageScore: Math.round(avgScore),
        recentTopics
      } as HeroStats;
    },
    errorMessage: "Failed to load statistics"
  });

  if (profileLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FDF6E3] to-[#FEFCF7]">
        <div className="text-center space-y-4">
          <Loader className="h-8 w-8 animate-spin mx-auto text-[#FFC107]" />
          <h2 className="text-2xl font-bold text-[#2D3748] animate-pulse">Loading your hero profile...</h2>
        </div>
      </div>
    );
  }

  if (!profile) {
    navigate('/hero-profile-setup');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9b87f5] via-[#7E69AB] to-[#6E59A5] p-4 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#D6BCFA]/30 rounded-full mix-blend-soft-light filter blur-3xl opacity-70 animate-float"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-[#8B5CF6]/20 rounded-full mix-blend-soft-light filter blur-3xl opacity-60 animate-float animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[#E5DEFF]/40 rounded-full mix-blend-soft-light filter blur-3xl opacity-70 animate-float animation-delay-4000"></div>
        <div className="absolute bottom-40 right-20 w-72 h-72 bg-[#9b87f5]/30 rounded-full mix-blend-soft-light filter blur-3xl opacity-60 animate-float animation-delay-3000"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        <Card className="border-2 border-[#FFC107]/20 bg-white/90 backdrop-blur-sm animate-fade-in hover:shadow-lg hover:shadow-[#FFC107]/10 transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-bold text-[#2D3748] flex items-center justify-center gap-3">
              <Crown className="h-8 w-8 text-[#FFC107] animate-pulse" />
              <span className="bg-gradient-to-r from-[#FFA000] to-[#FFC107] bg-clip-text text-transparent">
                {profile.hero_name}'s Quest Command Center
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4 p-6">
            <div className="text-center space-y-2 transform hover:scale-105 transition-transform duration-300">
              <Trophy className="h-8 w-8 mx-auto text-[#FFC107] animate-bounce" />
              <h3 className="font-semibold text-[#4A5568]">Quests Completed</h3>
              <p className="text-[2.75rem] font-bold text-[#2D3748]">{stats?.totalCompleted || 0}</p>
            </div>
            <div className="text-center space-y-2 transform hover:scale-105 transition-transform duration-300">
              <Book className="h-8 w-8 mx-auto text-[#1976D2] animate-float" />
              <h3 className="font-semibold text-[#4A5568]">Current Grade</h3>
              <p className="text-[2.75rem] font-bold text-[#2D3748]">{profile.grade}</p>
            </div>
            <div className="text-center space-y-2 transform hover:scale-105 transition-transform duration-300">
              <GamepadIcon className="h-8 w-8 mx-auto text-[#4CAF50] animate-float" />
              <h3 className="font-semibold text-[#4A5568]">Average Score</h3>
              <p className="text-[2.75rem] font-bold text-[#2D3748]">{stats?.averageScore || 0}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#1976D2]/20 bg-white/90 backdrop-blur-sm animate-fade-in hover:shadow-lg hover:shadow-[#1976D2]/10 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#2D3748] flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-[#1976D2]" />
              Recent Adventures
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats?.recentTopics && stats.recentTopics.length > 0 ? (
              stats.recentTopics.map((topic, index) => (
                <div key={index} 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-[#FEFCF7] rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] border border-[#1976D2]/10"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#2D3748] text-lg">{topic.title}</h4>
                    <p className="text-sm text-[#8D6E63] mt-1">
                      Completed: {new Date(topic.completedAt).toLocaleDateString()}
                    </p>
                    <div className="mt-2">
                      <Progress value={topic.score} className="h-2 w-full" />
                      <p className="text-sm text-[#4A5568] mt-1">Score: {topic.score}%</p>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-center justify-center">
                    <Trophy className={`h-8 w-8 ${topic.score >= 90 ? 'text-[#FFC107]' : 'text-[#90CAF9]'}`} />
                    <span className="text-xs font-medium mt-1 text-[#4A5568]">
                      {topic.score >= 90 ? 'Perfect!' : 'Great Job!'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 bg-white/50 rounded-lg border-2 border-dashed border-[#1976D2]/20">
                <Trophy className="h-12 w-12 text-[#1976D2]/30 mx-auto mb-3" />
                <p className="text-[#8D6E63] text-lg font-medium">
                  No adventures completed yet. Time to start your quest!
                </p>
                <Button 
                  onClick={() => navigate('/explorer-map')}
                  className="mt-4 bg-[#1976D2] hover:bg-[#1565C0] text-white"
                >
                  <Map className="mr-2 h-5 w-5" />
                  Start Your First Adventure
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={() => navigate('/explorer-map')}
            className="h-auto py-6 text-lg font-semibold bg-[#FFC107] hover:bg-[#FFA000] text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#FFC107]/20"
          >
            <Map className="mr-2 h-5 w-5" />
            View Explorer Map
          </Button>
          <Button
            onClick={() => navigate('/treasure-trail')}
            variant="secondary"
            className="h-auto py-6 text-lg font-semibold bg-[#1976D2] hover:bg-[#1565C0] text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#1976D2]/20"
          >
            <Trophy className="mr-2 h-5 w-5" />
            My Treasure Trail
          </Button>
          <Button
            onClick={() => navigate('/quest-chronicle')}
            variant="secondary"
            className="h-auto py-6 text-lg font-semibold bg-[#4CAF50] hover:bg-[#388E3C] text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#4CAF50]/20"
          >
            <ScrollText className="mr-2 h-5 w-5" />
            Quest Chronicle
          </Button>
          <Button
            onClick={() => navigate('/games-grotto')}
            variant="outline"
            className="h-auto py-6 text-lg font-semibold border-2 border-[#FFC107] text-[#2D3748] hover:bg-[#FFC107]/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#FFC107]/20"
          >
            <GamepadIcon className="mr-2 h-5 w-5" />
            Games Grotto
          </Button>
        </div>
      </div>
      <FloatingNav />
    </div>
  );
};

export default HeroProfile;
