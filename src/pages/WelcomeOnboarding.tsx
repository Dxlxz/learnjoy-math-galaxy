
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Crown, Map, Gamepad, Trophy } from 'lucide-react';

const features = [
  {
    title: "Your Hero Profile",
    description: "Track your progress and achievements",
    icon: Crown,
  },
  {
    title: "Explorer Map",
    description: "Navigate through exciting math challenges",
    icon: Map,
  },
  {
    title: "Games Grotto",
    description: "Learn while playing fun math games",
    icon: Gamepad,
  },
  {
    title: "Treasure Trail",
    description: "Collect rewards as you learn",
    icon: Trophy,
  },
];

const WelcomeOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = React.useState(0);

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/register');
        return;
      }

      // Check if onboarding is already completed
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', session.user.id)
        .single();

      if (profile?.onboarding_completed) {
        navigate('/hero-profile');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleComplete = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase
      .from('profiles')
      .update({ onboarding_completed: true })
      .eq('id', session.user.id);

    navigate('/hero-profile');
  };

  const Feature = ({ feature }: { feature: typeof features[0] }) => {
    const Icon = feature.icon;
    return (
      <div className="flex items-center gap-4 p-4 rounded-lg bg-white/50">
        <div className="p-2 rounded-full bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{feature.title}</h3>
          <p className="text-sm text-gray-600">{feature.description}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/placeholder.svg')] bg-cover bg-center p-4">
      <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm bg-white/90">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            Welcome to Math Galaxy Adventure!
          </CardTitle>
          <CardDescription className="text-lg">
            Let's explore what awaits you on your journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {features.map((feature, index) => (
            <Feature key={index} feature={feature} />
          ))}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button
            onClick={handleComplete}
            size="lg"
            className="font-semibold"
          >
            Begin Your Adventure!
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WelcomeOnboarding;
