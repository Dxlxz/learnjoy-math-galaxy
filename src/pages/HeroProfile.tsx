
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

const HeroProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [profile, setProfile] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching profile",
          description: error.message,
        });
        return;
      }

      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading your hero profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-primary-600 mb-6">
            {profile?.hero_name}'s Adventure Log
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="p-4 bg-primary-50 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Hero Details</h3>
                <p>Grade Level: {profile?.grade}</p>
                <p>Joined: {new Date(profile?.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-x-4">
            <Button
              onClick={() => navigate('/explorer-map')}
              className="bg-primary-600 hover:bg-primary-700"
            >
              View Explorer Map
            </Button>
            <Button
              onClick={() => navigate('/treasure-trail')}
              variant="outline"
            >
              My Treasure Trail
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroProfile;
