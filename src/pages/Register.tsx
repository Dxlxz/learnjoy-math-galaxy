
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
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sword, ScrollText, ImageIcon } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const AVATAR_OPTIONS = [
  'warrior.png',
  'mage.png',
  'archer.png',
  'knight.png',
  'wizard.png'
];

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [heroName, setHeroName] = React.useState('');
  const [grade, setGrade] = React.useState('');
  const [selectedAvatar, setSelectedAvatar] = React.useState(AVATAR_OPTIONS[0]);
  const [loading, setLoading] = React.useState(false);

  // Check for existing session on mount
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }}) => {
      if (session) {
        navigate('/hero-profile');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/hero-profile');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            hero_name: heroName,
            grade: grade,
            avatar_id: selectedAvatar,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Welcome brave adventurer!",
        description: "Your quest begins now! Check your email to verify your account.",
      });
      navigate('/starter-challenge');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during your quest initiation",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/placeholder.svg')] bg-cover bg-center p-4">
      <Card className="w-full max-w-lg mx-auto backdrop-blur-sm bg-white/90">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <Sword className="h-6 w-6" />
            Join The Math Galaxy Adventure
          </CardTitle>
          <CardDescription className="text-lg">
            Begin your heroic journey through the realms of mathematics!
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="heroName" className="flex items-center gap-2">
                  <ScrollText className="h-4 w-4" />
                  Choose Your Hero Name
                </Label>
                <Input
                  id="heroName"
                  type="text"
                  required
                  value={heroName}
                  onChange={(e) => setHeroName(e.target.value)}
                  placeholder="Enter your legendary name"
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
                <Label htmlFor="grade">Select Your Adventure Level</Label>
                <Select value={grade} onValueChange={setGrade} required>
                  <SelectTrigger className="bg-white/50">
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

              <div>
                <Label htmlFor="email">Magic Scroll (Email)</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-white/50"
                />
              </div>

              <div>
                <Label htmlFor="password">Secret Code</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create your secret code"
                  className="bg-white/50"
                  minLength={6}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700"
                disabled={loading}
              >
                {loading ? "Preparing Your Adventure..." : "Begin Your Quest"}
              </Button>

              <div className="text-center space-y-2">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate('/login')}
                  className="text-primary-600"
                >
                  Already a hero? Return to your quest
                </Button>
                <div>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => navigate('/')}
                    className="text-primary-600"
                  >
                    Back to the Kingdom Gates
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
