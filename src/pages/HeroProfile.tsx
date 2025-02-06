
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Trophy, Book, GamepadIcon, Map, Crown, Loader } from 'lucide-react';

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

        // Fetch learning progress stats
        const { data: progressData, error: progressError } = await supabase
          .from('learning_progress')
          .select(`
            *,
            content (
              title
            )
          `)
          .eq('user_id', session.user.id)
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
        {/* Hero Banner */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-3">
              <Crown className="h-8 w-8 text-yellow-500" />
              {profile?.hero_name}'s Quest Command Center
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4 p-6">
            <div className="text-center space-y-2">
              <Trophy className="h-8 w-8 mx-auto text-yellow-500" />
              <h3 className="font-semibold">Quests Completed</h3>
              <p className="text-2xl font-bold text-primary">{stats.total_completed}</p>
            </div>
            <div className="text-center space-y-2">
              <Book className="h-8 w-8 mx-auto text-blue-500" />
              <h3 className="font-semibold">Current Grade</h3>
              <p className="text-2xl font-bold text-primary">{profile?.grade}</p>
            </div>
            <div className="text-center space-y-2">
              <GamepadIcon className="h-8 w-8 mx-auto text-green-500" />
              <h3 className="font-semibold">Average Score</h3>
              <p className="text-2xl font-bold text-primary">{stats.average_score}%</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Adventures</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.recent_topics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <div>
                  <h4 className="font-medium">{topic.title}</h4>
                  <p className="text-sm text-gray-500">
                    Completed: {new Date(topic.completed_at).toLocaleDateString()}
                  </p>
                </div>
                <Trophy className="h-5 w-5 text-yellow-500" />
              </div>
            ))}
            {stats.recent_topics.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No adventures completed yet. Time to start your quest!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            onClick={() => navigate('/explorer-map')}
            className="h-auto py-6 text-lg font-semibold"
          >
            <Map className="mr-2 h-5 w-5" />
            View Explorer Map
          </Button>
          <Button
            onClick={() => navigate('/treasure-trail')}
            variant="secondary"
            className="h-auto py-6 text-lg font-semibold"
          >
            <Trophy className="mr-2 h-5 w-5" />
            My Treasure Trail
          </Button>
          <Button
            onClick={() => navigate('/games-grotto')}
            variant="outline"
            className="h-auto py-6 text-lg font-semibold"
          >
            <GamepadIcon className="mr-2 h-5 w-5" />
            Games Grotto
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroProfile;
