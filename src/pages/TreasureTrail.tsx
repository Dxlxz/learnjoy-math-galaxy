import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Sword, Trophy, Star, MapPin, Lock, CheckCircle } from 'lucide-react';
import { generateLearningPath, saveLearningPath } from '@/utils/learningPathGenerator';

const TreasureTrail = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [progress, setProgress] = React.useState<any[]>([]);
  const [totalScore, setTotalScore] = React.useState(0);
  const [completedQuests, setCompletedQuests] = React.useState(0);
  const [learningPath, setLearningPath] = React.useState<any[]>([]);
  const [userId, setUserId] = React.useState<string | null>(null);

  const updatePath = React.useCallback(async (uid: string) => {
    try {
      // Fetch user profile for grade
      const { data: profile } = await supabase
        .from('profiles')
        .select('grade')
        .eq('id', uid)
        .single();

      if (!profile) {
        throw new Error('Profile not found');
      }

      // Generate and save new learning path
      const pathNodes = await generateLearningPath(uid, profile.grade);
      await saveLearningPath(uid, pathNodes);
      setLearningPath(pathNodes);
    } catch (error) {
      console.error('Error updating learning path:', error);
    }
  }, []);

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      return session;
    };

    const fetchData = async () => {
      const session = await checkAuth();
      if (!session) return;

      setUserId(session.user.id);

      try {
        // Initial path generation
        await updatePath(session.user.id);

        // Fetch progress data
        const { data: progressData, error: progressError } = await supabase
          .from('learning_progress')
          .select(`
            *,
            content (
              title,
              type,
              topic_id,
              metadata
            )
          `)
          .eq('user_id', session.user.id)
          .order('completed_at', { ascending: false });

        if (progressError) throw progressError;

        setProgress(progressData || []);
        
        // Calculate totals
        if (progressData) {
          const total = progressData.reduce((sum, item) => sum + (item.score || 0), 0);
          setTotalScore(total);
          setCompletedQuests(progressData.length);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading treasure trail",
          description: error instanceof Error ? error.message : "An error occurred",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscription
    const channel = supabase.channel('learning-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'learning_progress',
          filter: `user_id=eq.${userId}`
        },
        async (payload) => {
          console.log('New learning progress:', payload);
          if (userId) {
            // Update learning path
            await updatePath(userId);
            
            // Update progress counts
            setCompletedQuests(prev => prev + 1);
            if (payload.new.score) {
              setTotalScore(prev => prev + payload.new.score);
            }
            
            // Add new progress to the list
            const { data: newProgress } = await supabase
              .from('learning_progress')
              .select(`
                *,
                content (
                  title,
                  type,
                  topic_id,
                  metadata
                )
              `)
              .eq('id', payload.new.id)
              .single();

            if (newProgress) {
              setProgress(prev => [newProgress, ...prev]);
            }

            toast({
              title: "Progress Updated!",
              description: "Your learning path has been updated with your latest achievement.",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate, toast, updatePath, userId]);

  const getNodeStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'available':
        return <MapPin className="h-6 w-6 text-blue-500" />;
      case 'locked':
        return <Lock className="h-6 w-6 text-gray-400" />;
      default:
        return <MapPin className="h-6 w-6 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading your treasure trail...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-600 mb-2">
              Your Treasure Trail
            </h1>
            <p className="text-gray-600">
              Follow your personalized learning journey and collect achievements
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-primary-50 p-4 rounded-lg">
              <h3 className="font-semibold text-primary-700">Total Score</h3>
              <p className="text-2xl font-bold text-primary-600">{totalScore}</p>
            </div>
            <div className="bg-primary-50 p-4 rounded-lg">
              <h3 className="font-semibold text-primary-700">Quests Completed</h3>
              <p className="text-2xl font-bold text-primary-600">{completedQuests}</p>
            </div>
            <div className="bg-primary-50 p-4 rounded-lg">
              <h3 className="font-semibold text-primary-700">Journey Progress</h3>
              <Progress value={completedQuests * 10} className="mt-2" />
            </div>
          </div>

          {/* Learning Path */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-primary-700 mb-4">Your Learning Path</h2>
            <div className="space-y-4">
              {learningPath.map((node) => (
                <div
                  key={node.id}
                  className={`p-4 border rounded-lg transition-all ${
                    node.status === 'completed' 
                      ? 'bg-green-50 border-green-200'
                      : node.status === 'available'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getNodeStatusIcon(node.status)}
                      <div>
                        <h3 className="font-semibold">{node.title}</h3>
                        <p className="text-sm text-gray-600">
                          {node.status === 'locked' 
                            ? 'Complete prerequisites to unlock'
                            : node.status === 'completed'
                            ? 'Completed'
                            : 'Available to start'}
                        </p>
                      </div>
                    </div>
                    {node.status === 'available' && (
                      <Button
                        onClick={() => navigate(`/quest-challenge?topic=${node.topicId}`)}
                        size="sm"
                      >
                        Start Quest
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievement Timeline */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-primary-700 mb-4">Recent Achievements</h2>
            {progress.map((item) => (
              <div
                key={item.id}
                className="p-6 bg-white rounded-lg shadow border border-primary-100 hover:border-primary-200 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-50 rounded-full">
                    {getAchievementIcon(item.achievement_type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-primary-700">
                      {item.display_title || item.content?.title}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {item.trail_description || 'Completed a learning quest'}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>
                        Completed: {new Date(item.completed_at).toLocaleDateString()}
                      </span>
                      {item.score && (
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          Score: {item.score}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {progress.length === 0 && (
              <div className="text-center py-12 bg-primary-50/50 rounded-lg">
                <Trophy className="h-12 w-12 mx-auto text-primary-300 mb-4" />
                <p className="text-gray-600 font-medium">
                  Your treasure trail is empty. Start a quest to begin collecting achievements!
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 space-x-4">
            <Button
              onClick={() => navigate('/explorer-map')}
              className="bg-primary-600 hover:bg-primary-700"
            >
              Find New Quests
            </Button>
            <Button
              onClick={() => navigate('/hero-profile')}
              variant="outline"
            >
              Back to Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getAchievementIcon = (type: string) => {
  switch (type) {
    case 'quest_completion':
      return <Sword className="h-6 w-6 text-primary-500" />;
    case 'milestone':
      return <Trophy className="h-6 w-6 text-yellow-500" />;
    case 'high_score':
      return <Star className="h-6 w-6 text-purple-500" />;
    default:
      return <MapPin className="h-6 w-6 text-blue-500" />;
  }
};

export default TreasureTrail;
