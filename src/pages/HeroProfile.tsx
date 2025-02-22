import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Book, GamepadIcon, Map, Crown, Loader, ScrollText } from 'lucide-react';
import FloatingNav from '@/components/navigation/FloatingNav';

interface LearningStats {
  total_completed: number;
  average_score: number;
  recent_topics: { title: string; completed_at: string; score: number; type: string }[];
}

const HeroProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [profile, setProfile] = React.useState<any>(null);
  const [stats, setStats] = React.useState<LearningStats>({
    total_completed: 11,
    average_score: 91,
    recent_topics: [
      {
        title: "Number Recognition Quest",
        completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        score: 95,
        type: "quest"
      },
      {
        title: "Addition Adventure",
        completed_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        score: 88,
        type: "quest"
      },
      {
        title: "Shape Explorer Challenge",
        completed_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        score: 92,
        type: "quest"
      }
    ]
  });

  React.useEffect(() => {
    const loadProfile = () => {
      try {
        // Load from localStorage instead of Supabase
        const storedProfile = localStorage.getItem('heroProfile');
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        } else {
          // If no profile exists, redirect to profile setup
          navigate('/hero-profile-setup');
          return;
        }
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

    loadProfile();
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
                {profile?.hero_name}'s Quest Command Center
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4 p-6">
            <div className="text-center space-y-2 transform hover:scale-105 transition-transform duration-300">
              <Trophy className="h-8 w-8 mx-auto text-[#FFC107] animate-bounce" />
              <h3 className="font-semibold text-[#4A5568]">Quests Completed</h3>
              <p className="text-[2.75rem] font-bold text-[#2D3748]">{stats.total_completed}</p>
            </div>
            <div className="text-center space-y-2 transform hover:scale-105 transition-transform duration-300">
              <Book className="h-8 w-8 mx-auto text-[#1976D2] animate-float" />
              <h3 className="font-semibold text-[#4A5568]">Current Grade</h3>
              <p className="text-[2.75rem] font-bold text-[#2D3748]">{profile?.grade}</p>
            </div>
            <div className="text-center space-y-2 transform hover:scale-105 transition-transform duration-300">
              <GamepadIcon className="h-8 w-8 mx-auto text-[#4CAF50] animate-float" />
              <h3 className="font-semibold text-[#4A5568]">Average Score</h3>
              <p className="text-[2.75rem] font-bold text-[#2D3748]">{stats.average_score}%</p>
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
            {stats.recent_topics.map((topic, index) => (
              <div key={index} 
                className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-[#FEFCF7] rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] border border-[#1976D2]/10"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-[#2D3748] text-lg">{topic.title}</h4>
                  <p className="text-sm text-[#8D6E63] mt-1">
                    Completed: {new Date(topic.completed_at).toLocaleDateString()}
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
            ))}
            {stats.recent_topics.length === 0 && (
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
