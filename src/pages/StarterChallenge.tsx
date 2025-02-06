
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correct: string;
  image?: string;
}

const StarterChallenge = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState<string[]>([]);
  const [userProfile, setUserProfile] = React.useState<any>(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      try {
        // Fetch user profile to get grade
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;
        setUserProfile(profile);

        // Fetch starter challenge questions for user's grade
        const { data: challengeData, error: challengeError } = await supabase
          .from('starter_challenges')
          .select('questions')
          .eq('grade', profile.grade)
          .single();

        if (challengeError) throw challengeError;
        setQuestions(challengeData.questions);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        toast({
          variant: "destructive",
          title: "Error loading challenge",
          description: "Failed to load your starter challenge. Please try again.",
        });
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate score
      const correctAnswers = questions.filter((q, idx) => q.correct === answers[idx]);
      const score = Math.round((correctAnswers.length / questions.length) * 100);

      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            starter_challenge_completed: true,
            starter_challenge_score: score
          })
          .eq('id', userProfile.id);

        if (error) throw error;

        toast({
          title: "Challenge Complete! 🎉",
          description: `You scored ${score}%! Your journey begins now.`,
        });

        navigate('/hero-profile');
      } catch (error) {
        console.error('Error saving score:', error);
        toast({
          variant: "destructive",
          title: "Error saving score",
          description: "Failed to save your score. Please try again.",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <h2 className="text-2xl font-bold text-primary">Preparing your challenge...</h2>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/placeholder.svg')] bg-cover bg-center p-4">
      <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm bg-white/90">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            Starter Challenge
          </CardTitle>
          <CardDescription>
            Question {currentQuestion + 1} of {questions.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-xl font-medium text-center mb-6">
            {currentQ.question}
          </div>

          {currentQ.image && (
            <div className="flex justify-center mb-6">
              <img 
                src={`/challenge-images/${currentQ.image}`} 
                alt="Question visual"
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}

          <RadioGroup
            value={answers[currentQuestion]}
            onValueChange={handleAnswer}
            className="gap-4"
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-lg">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-end pt-6">
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion]}
              className="w-full sm:w-auto"
            >
              {currentQuestion < questions.length - 1 ? "Next Question" : "Complete Challenge"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StarterChallenge;
