
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ScrollText } from 'lucide-react';
import { AvatarSelector } from '@/components/hero-setup/AvatarSelector';
import { GradeSelector } from '@/components/hero-setup/GradeSelector';
import { useProfileSetup } from '@/hooks/useProfileSetup';

const HeroProfileSetup = () => {
  const navigate = useNavigate();
  const {
    heroName,
    setHeroName,
    grade,
    setGrade,
    selectedAvatar,
    setSelectedAvatar,
    loading,
    handleSubmit,
  } = useProfileSetup();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/register');
        return;
      }

      // Check if profile setup is already completed
      const { data: profile } = await supabase
        .from('profiles')
        .select('profile_setup_completed, starter_challenge_completed')
        .eq('id', session.user.id)
        .single();

      if (profile?.profile_setup_completed) {
        if (!profile?.starter_challenge_completed) {
          navigate('/starter-challenge');
        } else {
          navigate('/hero-profile');
        }
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/placeholder.svg')] bg-cover bg-center p-4">
      <Card className="w-full max-w-lg mx-auto backdrop-blur-sm bg-white/90">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            Create Your Hero Profile
          </CardTitle>
          <CardDescription className="text-lg">
            Tell us about yourself, brave adventurer!
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="heroName" className="flex items-center gap-2">
                <ScrollText className="h-4 w-4" />
                Hero Name
              </Label>
              <Input
                id="heroName"
                required
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                placeholder="Choose your hero name"
                className="bg-white/50"
              />
            </div>

            <AvatarSelector
              selectedAvatar={selectedAvatar}
              onSelect={setSelectedAvatar}
            />

            <GradeSelector
              value={grade}
              onChange={setGrade}
            />
          </form>
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={loading || !heroName || !grade || !selectedAvatar}
          >
            {loading ? "Creating Profile..." : "Continue to Starter Challenge"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HeroProfileSetup;
