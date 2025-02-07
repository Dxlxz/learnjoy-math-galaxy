
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Check, X, Sparkles, Brain, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [difficultyLevel, setDifficultyLevel] = React.useState(1);
  const [consecutiveCorrect, setConsecutiveCorrect] = React.useState(0);
  const [consecutiveIncorrect, setConsecutiveIncorrect] = React.useState(0);
  const [showStreakBadge, setShowStreakBadge] = React.useState(false);

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

      // Fetch user's current difficulty level
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Try to get existing difficulty level
        const { data: difficultyData } = await supabase
          .from('user_difficulty_levels')
          .select('current_difficulty_level')
          .eq('user_id', session.user.id)
          .eq('topic_id', topicId)
          .maybeSingle();

        if (difficultyData) {
          setDifficultyLevel(difficultyData.current_difficulty_level);
        } else {
          // Create initial difficulty level entry
          const { data: newDifficultyData, error: insertError } = await supabase
            .from('user_difficulty_levels')
            .insert({
              user_id: session.user.id,
              topic_id: topicId,
              current_difficulty_level: 1,
              consecutive_correct: 0,
              consecutive_incorrect: 0,
              total_questions_attempted: 0,
              success_rate: 0
            })
            .select('current_difficulty_level')
            .single();

          if (insertError) {
            console.error('Error creating initial difficulty level:', insertError);
            toast({
              variant: "destructive",
              title: "Error initializing difficulty level",
              description: "Please try again later.",
            });
            return;
          }

          if (newDifficultyData) {
            setDifficultyLevel(newDifficultyData.current_difficulty_level);
          }
        }
      }

      // Fetch questions based on current difficulty
      const { data, error } = await supabase
        .from('assessment_question_banks')
        .select('*')
        .eq('topic_id', topicId)
        .eq('difficulty_level', difficultyLevel)
        .order('created_at');

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
  }, [navigate, searchParams, toast, difficultyLevel]);

  const updateDifficultyLevel = async (correct: boolean) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const topicId = searchParams.get('topic');
    if (!topicId) return;

    let newDifficultyLevel = difficultyLevel;
    let newConsecutiveCorrect = correct ? consecutiveCorrect + 1 : 0;
    let newConsecutiveIncorrect = correct ? 0 : consecutiveIncorrect + 1;

    // Adjust difficulty based on performance
    if (newConsecutiveCorrect >= 3) {
      newDifficultyLevel = Math.min(5, difficultyLevel + 1);
      newConsecutiveCorrect = 0;
      toast({
        title: "Level Up! 🎉",
        description: "You've advanced to a higher difficulty level!",
      });
    } else if (newConsecutiveIncorrect >= 2) {
      newDifficultyLevel = Math.max(1, difficultyLevel - 1);
      newConsecutiveIncorrect = 0;
      toast({
        title: "Adjusting Difficulty",
        description: "Let's try some easier questions to build confidence.",
      });
    }

    // Update user's difficulty level in database
    const { error } = await supabase
      .from('user_difficulty_levels')
      .upsert({
        user_id: session.user.id,
        topic_id: topicId,
        current_difficulty_level: newDifficultyLevel,
        consecutive_correct: newConsecutiveCorrect,
        consecutive_incorrect: newConsecutiveIncorrect,
        total_questions_attempted: questions.length,
        success_rate: (score / questions.length) * 100,
      }, {
        onConflict: 'user_id,topic_id'
      });

    if (!error) {
      setDifficultyLevel(newDifficultyLevel);
      setConsecutiveCorrect(newConsecutiveCorrect);
      setConsecutiveIncorrect(newConsecutiveIncorrect);

      if (newConsecutiveCorrect >= 2) {
        setShowStreakBadge(true);
        setTimeout(() => setShowStreakBadge(false), 3000);
      }
    }
  };

  const handleAnswer = async (selectedAnswer: string) => {
    const correct = selectedAnswer === currentQuestion.question.correct_answer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(score + currentQuestion.points);
    }

    await updateDifficultyLevel(correct);

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

    setTimeout(() => {
      setShowFeedback(false);
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setCurrentQuestion(questions[currentIndex + 1]);
      } else {
        toast({
          title: "Quest Complete! 🎉",
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
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-primary-600">
                Quest Challenge
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Target className="h-4 w-4" />
                <span>Difficulty Level: {difficultyLevel}</span>
                <Brain className="h-4 w-4 ml-2" />
                <span>Score: {score}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {showStreakBadge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-4 right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full flex items-center gap-2"
              >
                <Sparkles className="h-5 w-5" />
                <span>Hot Streak! 🔥</span>
              </motion.div>
            )}
          </AnimatePresence>

          {currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="p-6 bg-primary-50 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">
                  Level {currentQuestion.difficulty_level} Challenge
                </h3>
                <p className="text-lg">{currentQuestion.question.text}</p>
              </div>

              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-lg flex items-center gap-3 ${
                    isCorrect ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <motion.div
                    animate={{ rotate: isCorrect ? [0, 360] : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {isCorrect ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <X className="h-5 w-5 text-red-600" />
                    )}
                  </motion.div>
                  <p className={`${
                    isCorrect ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {isCorrect ? 'Brilliant! ' : 'Not quite right. '} 
                    {currentQuestion.question.explanation}
                  </p>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.question.options?.map((option: string, index: number) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => handleAnswer(option)}
                      className="w-full text-lg py-6 transition-all duration-200"
                      disabled={showFeedback}
                    >
                      {option}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
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

