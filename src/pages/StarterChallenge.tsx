
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Trophy, Target, Award } from 'lucide-react';

const StarterChallenge = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [questions, setQuestions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [scores, setScores] = React.useState({
    K1: 0,
    K2: 0,
    G1: 0,
    G2: 0,
    G3: 0
  });

  React.useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data: questions, error } = await supabase
          .from('assessment_question_banks')
          .select(`
            id,
            grade,
            question,
            points
          `)
          .eq('question_type', 'assessment')
          .in('grade', ['K1', 'K2', 'G1', 'G2', 'G3'])
          .order('grade', { ascending: true })
          .order('difficulty_level', { ascending: true })
          .limit(10);

        if (error) throw error;

        if (questions) {
          setQuestions(questions);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading questions",
          description: error instanceof Error ? error.message : "Please try again",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [toast]);

  const updateGradeScore = (grade: string, isCorrect: boolean) => {
    setScores(prev => ({
      ...prev,
      [grade]: isCorrect ? prev[grade as keyof typeof prev] + 1 : prev[grade as keyof typeof prev]
    }));
  };

  const handleAnswer = async (selectedAnswer: string) => {
    const currentQ = questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.question.correct;
    
    updateGradeScore(currentQ.grade, isCorrect);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Challenge completed - determine grade and save results
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
        
        // Call the database function to determine grade
        const { data: gradeResult, error: gradeError } = await supabase
          .rpc('determine_starter_grade', {
            score_k1: scores.K1,
            score_k2: scores.K2,
            score_g1: scores.G1,
            score_g2: scores.G2,
            score_g3: scores.G3
          });

        if (gradeError) throw gradeError;

        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            starter_challenge_completed: true,
            starter_challenge_score: totalScore,
            starter_challenge_grade: gradeResult,
            grade: gradeResult // Update the user's grade based on the assessment
          })
          .eq('id', session.user.id);

        if (updateError) throw updateError;

        toast({
          title: "Challenge Completed! 🎉",
          description: `You've completed the starter challenge! Your journey begins at ${gradeResult} level.`,
        });

        navigate('/hero-profile');
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error saving progress",
          description: error instanceof Error ? error.message : "Please try again",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-4 flex items-center justify-center">
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-4">
              <Target className="h-12 w-12 text-primary animate-pulse" />
              <p className="text-lg">Loading your challenge...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-4 flex items-center justify-center">
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-4">
              <Target className="h-12 w-12 text-primary" />
              <p className="text-lg">No questions available. Please try again later.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="mt-8">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Target className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl md:text-3xl">Starter Challenge</CardTitle>
            <CardDescription>
              Let's find the perfect starting point for your learning adventure!
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>Points: {currentQ.points}</span>
              </div>
              <Progress value={(currentQuestion / questions.length) * 100} />
            </div>

            <div className="p-4 bg-primary/5 rounded-lg">
              <h3 className="text-lg font-medium mb-4">
                {currentQ.question.text}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentQ.question.options.map((option: string, index: number) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="p-4 h-auto text-lg hover:bg-primary/10"
                    onClick={() => handleAnswer(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-gray-600">
                Complete to unlock your profile
              </span>
            </div>
            <Award className="h-5 w-5 text-primary/50" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default StarterChallenge;
