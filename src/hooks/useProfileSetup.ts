
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

type GradeLevel = 'K1' | 'K2' | 'G1' | 'G2' | 'G3' | 'G4' | 'G5';

export const useProfileSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [heroName, setHeroName] = useState('');
  const [grade, setGrade] = useState<GradeLevel>('K1');
  const [selectedAvatar, setSelectedAvatar] = useState('warrior.png');

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

  return {
    heroName,
    setHeroName,
    grade,
    setGrade,
    selectedAvatar,
    setSelectedAvatar,
    loading,
    handleSubmit,
  };
};
