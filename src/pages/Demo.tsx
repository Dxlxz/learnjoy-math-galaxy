import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Book, Calculator, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
const Demo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const startGuestAdventure = async () => {
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.auth.signInWithPassword({
        email: 'guest@mathgalaxy.demo',
        password: process.env.GUEST_PASSWORD || 'demo123'
      });
      if (error) throw error;
      toast({
        title: "Welcome, brave explorer!",
        description: "Your guest adventure begins now. Enjoy exploring Math Galaxy!"
      });
      navigate('/explorer-map');
    } catch (error) {
      console.error('Demo login error:', error);
      toast({
        variant: "destructive",
        title: "Adventure start failed",
        description: "Unable to start guest adventure. Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white p-4">
      <Card className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-sm border-2 border-primary-100 shadow-xl p-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-primary-600">
              Start Your Math Adventure
            </h1>
            <p className="text-lg text-primary-500/80">
              Embark on a magical journey through Math Galaxy. Try our interactive demo to experience the excitement of learning!
            </p>
            <div className="space-y-4">
              <FeatureItem icon={MapPin} title="Explore Math Topics" description="Navigate through engaging lessons and challenges" />
              <FeatureItem icon={Calculator} title="Interactive Practice" description="Learn by doing with fun, hands-on exercises" />
              <FeatureItem icon={Book} title="Track Progress" description="See your achievements and learning journey" />
            </div>
            <div className="space-y-4 pt-4">
              <Button onClick={startGuestAdventure} className="w-full bg-primary-600 hover:bg-primary-700 group" disabled={loading}>
                {loading ? "Preparing your adventure..." : <>
                    Begin Guest Adventure
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>}
              </Button>
              <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                Return to Home
              </Button>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-2xl transform rotate-3 animate-pulse"></div>
              <img alt="Math Explorer Mascot" className="relative w-full h-auto animate-bounce-slow" src="https://xiomglpaumuuwqdpdvip.supabase.co/storage/v1/object/public/avatars//hand-drawn-brain-cartoon-illustration.png" />
            </div>
          </div>
        </div>
      </Card>
    </div>;
};
const FeatureItem = ({
  icon: Icon,
  title,
  description
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => <div className="flex items-start space-x-3 p-4 rounded-lg bg-primary-50/50 border border-primary-100">
    <Icon className="h-6 w-6 text-primary-600 mt-1" />
    <div>
      <h3 className="font-semibold text-primary-700">{title}</h3>
      <p className="text-sm text-primary-500">{description}</p>
    </div>
  </div>;
export default Demo;