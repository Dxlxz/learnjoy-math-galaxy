import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Trophy, Book, GamepadIcon, Map, Crown, Loader, ScrollText } from 'lucide-react';
import FloatingNav from '@/shared/components/navigation/FloatingNav';

interface LearningStats {
  total_completed: number;
  average_score: number;
  recent_topics: { title: string; completed_at: string }[];
}

const HeroProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [profile, setProfile] = React.useState<any>(null);
  const [stats, setStats] = React.useState<LearningStats>({
    total_completed: 0,
    average_score: 0,
    recent_topics: []
  });

  React.useEffect(() => {
    const fetchProfileAndStats = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }

        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;

        // Check welcome onboarding completion
        if (!profileData.onboarding_completed) {
          navigate('/welcome-onboarding');
          return;
        }

        // Check if profile setup is completed
        if (!profileData.profile_setup_completed) {
          navigate('/hero-profile-setup');
          return;
        }

        // Fetch learning progress stats specifically for quests/assessments
        const { data: progressData, error: progressError } = await supabase
          .from('learning_progress')
          .select(`
            *,
            content (
              title,
              type
            )
          `)
          .eq('user_id', session.user.id)
          .eq('content.type', 'assessment')
          .order('completed_at', { ascending: false });

        if (progressError) throw progressError;

        // Calculate stats
        const questProgress = progressData?.filter(p => p.content?.type === 'assessment') || [];
        const totalCompleted = questProgress.length;
        const averageScore = questProgress.length > 0
          ? questProgress.reduce((acc: number, curr: any) => acc + (curr.score || 0), 0) / questProgress.length
          : 0;
        const recentTopics = questProgress
          .slice(0, 3)
          .map((progress: any) => ({
            title: progress.content?.title || 'Unknown Topic',
            completed_at: progress.completed_at
          }));

        setProfile(profileData);
        setStats({
          total_completed: totalCompleted,
          average_score: Math.round(averageScore),
          recent_topics: recentTopics
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading profile",
          description: error instanceof Error ? error.message : "An error occurred",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndStats();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FDF6E3] to-[#FEFCF7]">
        <div className="text-center space-y-4">
          <Loader className="h-8 w-8 animate-spin mx-auto text-[#FFC107]" />
          <h2 className="text-2xl font-bold text-[#2D3748] animate-pulse">Loading your hero profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF6E3] to-[#FEFCF7] p-4 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FFE082]/20 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#64B5F6]/20 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#81C784]/20 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        <Card className="border-2 border-[#FFC107]/20 bg-white/90 backdrop-blur-sm animate-fade-in hover:shadow-lg hover:shadow-[#FFC107]/10 transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-bold text-[#2D3748] flex items-center justify-center gap-3">
              <Crown className="h-8 w-8 text-[#FFC107] animate-pulse" />
              <span className="bg-gradient-to-r from-[#FFA000] to-[#FFC107] bg-clip-text text-transparent">
                {profile?.hero_name}'s Quest Command Center
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4 p-6">
            <div className="text-center space-y-2 transform hover:scale-105 transition-transform duration-300">
              <Trophy className="h-8 w-8 mx-auto text-[#FFC107] animate-bounce" />
              <h3 className="font-semibold text-[#4A5568]">Quests Completed</h3>
              <p className="text-2xl font-bold text-[#2D3748]">{stats.total_completed}</p>
            </div>
            <div className="text-center space-y-2 transform hover:scale-105 transition-transform duration-300">
              <Book className="h-8 w-8 mx-auto text-[#1976D2] animate-float" />
              <h3 className="font-semibold text-[#4A5568]">Current Grade</h3>
              <p className="text-2xl font-bold text-[#2D3748]">{profile?.grade}</p>
            </div>
            <div className="text-center space-y-2 transform hover:scale-105 transition-transform duration-300">
              <GamepadIcon className="h-8 w-8 mx-auto text-[#4CAF50] animate-float" />
              <h3 className="font-semibold text-[#4A5568]">Average Score</h3>
              <p className="text-2xl font-bold text-[#2D3748]">{stats.average_score}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#1976D2]/20 bg-white/90 backdrop-blur-sm animate-fade-in hover:shadow-lg hover:shadow-[#1976D2]/10 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#2D3748]">Recent Adventures</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.recent_topics.map((topic, index) => (
              <div key={index} 
                className="flex items-center justify-between p-3 bg-gradient-to-r from-white to-[#FEFCF7] rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div>
                  <h4 className="font-medium text-[#2D3748]">{topic.title}</h4>
                  <p className="text-sm text-[#8D6E63]">
                    Completed: {new Date(topic.completed_at).toLocaleDateString()}
                  </p>
                </div>
                <Trophy className="h-5 w-5 text-[#FFC107]" />
              </div>
            ))}
            {stats.recent_topics.length === 0 && (
              <p className="text-center text-[#8D6E63] py-4">
                No adventures completed yet. Time to start your quest!
              </p>
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
