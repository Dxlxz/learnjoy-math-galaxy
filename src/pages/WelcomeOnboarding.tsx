
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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

  const handleComplete = () => {
    // Store onboarding completion in localStorage
    const heroProfile = JSON.parse(localStorage.getItem('heroProfile') || '{}');
    heroProfile.onboarding_completed = true;
    localStorage.setItem('heroProfile', JSON.stringify(heroProfile));
    
    navigate('/hero-profile-setup');
  };

  const Feature = ({ feature }: { feature: typeof features[0] }) => {
    const Icon = feature.icon;
    return (
      <div className="flex items-center gap-4 p-4 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/60 transition-all duration-300 animate-fade-in">
        <div className="p-2 rounded-full bg-primary/10">
          <Icon className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h3 className="font-semibold text-primary-800">{feature.title}</h3>
          <p className="text-sm text-gray-600">{feature.description}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E5DEFF] to-white p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float animation-delay-4000"></div>
      </div>

      <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm bg-white/90 border-primary-100 shadow-xl animate-fade-in">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            Welcome to Math Galaxy Adventure!
          </CardTitle>
          <CardDescription className="text-lg text-primary-600/80">
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
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl animate-fade-in delay-200"
          >
            Begin Your Adventure!
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WelcomeOnboarding;
