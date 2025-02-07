
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
  const [score, setScore] = React.useState(0);

  // Sample starter questions for basic math assessment
  const questions = [
    {
      text: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correct: "4"
    },
    {
      text: "Which number comes after 5?",
      options: ["4", "5", "6", "7"],
      correct: "6"
    },
    {
      text: "How many sides does a triangle have?",
      options: ["2", "3", "4", "5"],
      correct: "3"
    }
  ];

  const handleAnswer = async (selectedAnswer: string) => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Challenge completed
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { error } = await supabase
          .from('profiles')
          .update({ starter_challenge_completed: true })
          .eq('id', session.user.id);

        if (error) throw error;

        toast({
          title: "Challenge Completed! 🎉",
          description: `You scored ${score + (isCorrect ? 1 : 0)} out of ${questions.length}`,
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
              Let's see what you know! Complete this quick challenge to begin your adventure.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>Score: {score}</span>
              </div>
              <Progress value={(currentQuestion / questions.length) * 100} />
            </div>

            <div className="p-4 bg-primary/5 rounded-lg">
              <h3 className="text-lg font-medium mb-4">
                {questions[currentQuestion].text}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {questions[currentQuestion].options.map((option, index) => (
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
