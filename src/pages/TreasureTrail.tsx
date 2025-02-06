
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

const TreasureTrail = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [progress, setProgress] = React.useState<any[]>([]);

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
    };

    const fetchProgress = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('learning_progress')
        .select(`
          *,
          content (
            title,
            type
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching progress",
          description: error.message,
        });
        return;
      }

      setProgress(data);
      setLoading(false);
    };

    checkAuth();
    fetchProgress();
  }, [navigate, toast]);

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
          <h1 className="text-3xl font-bold text-primary-600 mb-6">
            Your Treasure Trail
          </h1>

          <div className="space-y-6">
            {progress.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white rounded-lg shadow border border-primary-100"
              >
                <h3 className="font-semibold text-lg">
                  {item.content?.title}
                </h3>
                <p className="text-gray-600">
                  Completed: {new Date(item.completed_at).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Score: {item.score}
                </p>
              </div>
            ))}

            {progress.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">
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

export default TreasureTrail;
