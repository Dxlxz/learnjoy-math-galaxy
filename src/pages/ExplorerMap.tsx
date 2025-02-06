
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

const ExplorerMap = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [topics, setTopics] = React.useState<any[]>([]);

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
    };

    const fetchTopics = async () => {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .order('order_index');

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching topics",
          description: error.message,
        });
        return;
      }

      setTopics(data);
      setLoading(false);
    };

    checkAuth();
    fetchTopics();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Charting your course...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-primary-600 mb-6">
            Explorer's Map
          </h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="p-6 bg-white rounded-lg shadow-md border border-primary-100 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">{topic.title}</h3>
                <p className="text-gray-600 mb-4">{topic.description}</p>
                <Button
                  onClick={() => navigate(`/quest-challenge?topic=${topic.id}`)}
                  className="w-full"
                >
                  Begin Quest
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-8 space-x-4">
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

export default ExplorerMap;
