
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

const QuestChallenge = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [currentQuestion, setCurrentQuestion] = React.useState<any>(null);
  const [questions, setQuestions] = React.useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);

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

  const handleAnswer = async (answer: string) => {
    // Here you would implement the logic to check if the answer is correct
    // and update the progress in the learning_progress table

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentQuestion(questions[currentIndex + 1]);
    } else {
      toast({
        title: "Quest Complete!",
        description: "You've completed all questions in this quest.",
      });
      navigate('/explorer-map');
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-primary-600 mb-6">
            Quest Challenge
          </h1>

          {currentQuestion && (
            <div className="space-y-6">
              <div className="p-6 bg-primary-50 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">
                  Question {currentIndex + 1} of {questions.length}
                </h3>
                <p className="text-lg">{currentQuestion.question.text}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.question.options?.map((option: string, index: number) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="text-lg py-6"
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
