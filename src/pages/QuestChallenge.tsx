
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Check, X } from 'lucide-react';

const QuestChallenge = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [currentQuestion, setCurrentQuestion] = React.useState<any>(null);
  const [questions, setQuestions] = React.useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
    };

    const fetchQuestions = async () => {
      const topicId = searchParams.get('topic');
      if (!topicId) {
        navigate('/explorer-map');
        return;
      }

      const { data, error } = await supabase
        .from('assessment_question_banks')
        .select('*')
        .eq('topic_id', topicId)
        .order('difficulty_level');

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching questions",
          description: error.message,
        });
        return;
      }

      setQuestions(data);
      setCurrentQuestion(data[0]);
      setLoading(false);
    };

    checkAuth();
    fetchQuestions();
  }, [navigate, searchParams, toast]);

  const handleAnswer = async (selectedAnswer: string) => {
    const correct = selectedAnswer === currentQuestion.question.correct_answer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(score + currentQuestion.points);
    }

    // Update question analytics with proper upsert configuration
    try {
      const { error: analyticsError } = await supabase
        .from('question_analytics')
        .upsert([{
          question_id: currentQuestion.id,
          total_attempts: 1,
          correct_attempts: correct ? 1 : 0,
          last_attempted_at: new Date().toISOString(),
        }], {
          onConflict: 'question_id',
          ignoreDuplicates: false
        });

      if (analyticsError) throw analyticsError;

      // Record learning progress
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { error: progressError } = await supabase
          .from('learning_progress')
          .insert({
            user_id: session.user.id,
            content_id: currentQuestion.id,
            score: correct ? currentQuestion.points : 0,
            metadata: {
              question_difficulty: currentQuestion.difficulty_level,
              time_taken: currentQuestion.time_limit_seconds
            }
          });

        if (progressError) throw progressError;
      }
    } catch (error: any) {
      console.error('Error updating progress:', error);
      toast({
        variant: "destructive",
        title: "Error updating progress",
        description: "Your progress may not have been saved correctly.",
      });
    }

    // Wait for feedback to be shown before moving to next question
    setTimeout(() => {
      setShowFeedback(false);
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setCurrentQuestion(questions[currentIndex + 1]);
      } else {
        toast({
          title: "Quest Complete!",
          description: `You've completed the quest with a score of ${score} points!`,
        });
        navigate('/explorer-map');
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Preparing your quest...</h2>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-primary-600">
              Quest Challenge
            </h1>
            <div className="text-lg font-semibold text-primary-600">
              Score: {score}
            </div>
          </div>

          <div className="mb-6">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>

          {currentQuestion && (
            <div className="space-y-6">
              <div className="p-6 bg-primary-50 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">
                  Difficulty Level {currentQuestion.difficulty_level}
                </h3>
                <p className="text-lg">{currentQuestion.question.text}</p>
              </div>

              {showFeedback && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${
                  isCorrect ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {isCorrect ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <X className="h-5 w-5 text-red-600" />
                  )}
                  <p className={`${
                    isCorrect ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {isCorrect ? 'Correct!' : 'Not quite right.'} 
                    {currentQuestion.question.explanation}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.question.options?.map((option: string, index: number) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="text-lg py-6"
                    disabled={showFeedback}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 space-x-4">
            <Button
              onClick={() => navigate('/explorer-map')}
              variant="outline"
            >
              Back to Map
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestChallenge;

