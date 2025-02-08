
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
import { Smile, Star, Trophy } from 'lucide-react';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const AVATAR_OPTIONS = [
  'student-avatar-1.png',
  'student-avatar-2.png',
  'student-avatar-3.png',
  'student-avatar-4.png',
  'student-avatar-5.png',
  'student-avatar-6.png'
];

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
        .select('profile_setup_completed')
        .eq('id', session.user.id)
        .single();

      if (profile?.profile_setup_completed) {
        navigate('/hero-profile');
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
        title: "🎉 Your Hero Profile is Ready!",
        description: "Time for your first adventure!",
      });
      navigate('/hero-profile');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong",
        description: error instanceof Error ? error.message : "Let's try that again!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FEF7CD] to-white p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float animation-delay-4000"></div>
      </div>

      <Card className="w-full max-w-lg mx-auto bg-white/95 shadow-xl border-2 border-primary/20 rounded-2xl relative z-10">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <Star className="h-12 w-12 text-yellow-400 animate-pulse" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            Create Your Hero!
          </CardTitle>
          <CardDescription className="text-lg text-primary-600/80">
            Ready to begin your magical math adventure?
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-lg">
                <Smile className="h-5 w-5 text-primary" />
                Pick Your Avatar
              </Label>
              <RadioGroup
                value={selectedAvatar}
                onValueChange={setSelectedAvatar}
                className="grid grid-cols-3 gap-4 pt-2"
              >
                {AVATAR_OPTIONS.map((avatar) => (
                  <div key={avatar} className="relative">
                    <RadioGroupItem
                      value={avatar}
                      id={avatar}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={avatar}
                      className="block cursor-pointer"
                    >
                      <Avatar className="w-24 h-24 mx-auto ring-2 ring-offset-2 ring-transparent transition-all duration-300 peer-data-[state=checked]:ring-primary peer-data-[state=checked]:scale-110 hover:scale-105">
                        <AvatarImage
                          src={`https://xiomglpaumuuwqdpdvip.supabase.co/storage/v1/object/public/avatars/${avatar}`}
                          alt={`Hero Avatar ${avatar}`}
                          className="object-cover"
                        />
                      </Avatar>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="heroName" className="flex items-center gap-2 text-lg">
                <Trophy className="h-5 w-5 text-primary" />
                Choose Your Hero Name
              </Label>
              <Input
                id="heroName"
                required
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                placeholder="What should we call you?"
                className="bg-white/50 text-lg h-12 rounded-xl border-2 border-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade" className="text-lg">What's Your Level?</Label>
              <Select value={grade} onValueChange={(value: GradeLevel) => setGrade(value)} required>
                <SelectTrigger className="bg-white/50 h-12 text-lg rounded-xl border-2 border-primary/20">
                  <SelectValue placeholder="Choose your grade" />
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
            className="w-full h-14 text-lg rounded-xl bg-primary hover:bg-primary/90 transition-colors"
            disabled={loading || !heroName || !grade || !selectedAvatar}
          >
            {loading ? "Creating Your Hero..." : "Start Your Adventure! 🚀"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HeroProfileSetup;
