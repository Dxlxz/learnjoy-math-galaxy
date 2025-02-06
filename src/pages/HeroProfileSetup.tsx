
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollText, ImageIcon } from 'lucide-react';

const AVATAR_OPTIONS = [
  'warrior.png',
  'mage.png',
  'archer.png',
  'knight.png',
  'wizard.png'
];

// Define the grade level type to match the database enum
type GradeLevel = 'K1' | 'K2' | 'G1' | 'G2' | 'G3' | 'G4' | 'G5';

const HeroProfileSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [heroName, setHeroName] = React.useState('');
  const [grade, setGrade] = React.useState<GradeLevel>('K1');
  const [selectedAvatar, setSelectedAvatar] = React.useState(AVATAR_OPTIONS[0]);

  React.useEffect(() => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      const { error } = await supabase
        .from('profiles')
        .update({
          hero_name: heroName,
          grade: grade,
          avatar_id: selectedAvatar,
          profile_setup_completed: true
        })
        .eq('id', session.user.id);

      if (error) throw error;

      toast({
        title: "Profile created",
        description: "Now let's test your skills!",
      });
      navigate('/starter-challenge');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Profile setup failed",
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

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

            <div>
              <Label className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Choose Your Avatar
              </Label>
              <div className="mt-2">
                <Carousel className="w-full max-w-xs mx-auto">
                  <CarouselContent>
                    {AVATAR_OPTIONS.map((avatar, index) => (
                      <CarouselItem key={avatar}>
                        <div 
                          className={`aspect-square rounded-lg border-4 cursor-pointer transition-all ${
                            selectedAvatar === avatar ? 'border-primary' : 'border-transparent'
                          }`}
                          onClick={() => setSelectedAvatar(avatar)}
                        >
                          <img
                            src={`/avatars/${avatar}`}
                            alt={`Avatar ${index + 1}`}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </div>

            <div>
              <Label htmlFor="grade">Grade Level</Label>
              <Select value={grade} onValueChange={(value: GradeLevel) => setGrade(value)} required>
                <SelectTrigger className="bg-white/50">
                  <SelectValue placeholder="Select your grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="K1">Kindergarten 1</SelectItem>
                  <SelectItem value="K2">Kindergarten 2</SelectItem>
                  <SelectItem value="G1">Grade 1</SelectItem>
                  <SelectItem value="G2">Grade 2</SelectItem>
                  <SelectItem value="G3">Grade 3</SelectItem>
                  <SelectItem value="G4">Grade 4</SelectItem>
                  <SelectItem value="G5">Grade 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
