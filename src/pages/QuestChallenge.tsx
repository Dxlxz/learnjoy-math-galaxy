import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Check, X, Sparkles, Brain, Target, Timer, ArrowLeft, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Question, QuestionHistory, SessionAnalytics } from '@/types/explorer';

const MAX_QUESTIONS = 10;

const QuestChallenge: React.FC = () => {
  const [showExitDialog, setShowExitDialog] = React.useState(false);
  const [countdownActive, setCountdownActive] = React.useState(true);
  const [countdown, setCountdown] = React.useState(3);

  React.useEffect(() => {
    // Request fullscreen when component mounts
    document.documentElement.requestFullscreen().catch((err) => {
      console.error('Error attempting to enable fullscreen:', err);
    });

    // Cleanup: exit fullscreen when component unmounts
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => {
          console.error('Error attempting to exit fullscreen:', err);
        });
      }
    };
  }, []);

  React.useEffect(() => {
    if (countdownActive && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCountdownActive(false);
    }
  }, [countdown, countdownActive]);

  const handleExit = async () => {
    if (sessionId) {
      // Mark session as interrupted
      const { error } = await supabase
        .from('quiz_sessions')
        .update({ 
          end_time: new Date().toISOString(),
          final_score: -1,
          status: 'interrupted',
          questions_answered: currentIndex
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error marking session as interrupted:', error);
      }
    }

    // Exit fullscreen and navigate away
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    navigate('/explorer-map');
  };

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
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [showOverview, setShowOverview] = React.useState(false);
  const [sessionStats, setSessionStats] = React.useState<any>(null);
  const [timeSpent, setTimeSpent] = React.useState(0);
  const [startTime] = React.useState(new Date());
  
  const [quizContentId, setQuizContentId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
    };

    const initializeSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const topicId = searchParams.get('topic');
      
      if (session && topicId) {
        const { data: sessionData, error: sessionError } = await supabase
          .from('quiz_sessions')
          .insert({
            user_id: session.user.id,
            topic_id: topicId,
            start_time: new Date().toISOString(),
            total_questions: MAX_QUESTIONS,
            correct_answers: 0,
            final_score: 0,
            max_questions: MAX_QUESTIONS
          })
          .select()
          .single();

        if (sessionError) {
          console.error('Error creating session:', sessionError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to initialize quiz session.",
          });
          return;
        }
        
        if (sessionData) {
          setSessionId(sessionData.id);
        }
      }
    };

    const fetchQuizContent = async () => {
      const topicId = searchParams.get('topic');
      if (!topicId) return;

      const { data: contentData, error: contentError } = await supabase
        .from('content')
        .select('id')
        .eq('topic_id', topicId)
        .eq('type', 'assessment')
        .single();

      if (contentError) {
        console.error('Error fetching quiz content:', contentError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load quiz content.",
        });
        return;
      }

      if (contentData) {
        setQuizContentId(contentData.id);
      }
    };

    const initialize = async () => {
      setLoading(true);
      try {
        await checkAuth();
        await initializeSession();
        await fetchQuizContent();
      } catch (error) {
        console.error('Initialization error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to initialize the quiz.",
        });
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [navigate, searchParams, toast]);

  const fetchNextQuestion = async (currentDifficultyLevel: number) => {
    const topicId = searchParams.get('topic');
    if (!sessionId || !topicId) return;

    try {
      const { data: questionData, error } = await supabase
        .rpc('get_next_quiz_question', {
          p_session_id: sessionId,
          p_topic_id: topicId,
          p_difficulty_level: currentDifficultyLevel
        })
        .single();

      if (error) {
        console.error('Error fetching next question:', error);
        toast({
          variant: "destructive",
          title: "Error fetching question",
          description: "There was a problem loading the next question.",
        });
        return;
      }

      if (questionData) {
        const question = questionData.question_data as unknown as Question;
        // Validate that the question is for this topic
        if (!question.tool_type) {
          setCurrentQuestion({
            id: questionData.question_id,
            question,
            difficulty_level: questionData.difficulty_level,
            points: questionData.points
          });
        } else {
          // If we got a tool question, try fetching another one
          await fetchNextQuestion(currentDifficultyLevel);
        }
      }
    } catch (error) {
      console.error('Unexpected error fetching question:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    }
  };

  React.useEffect(() => {
    if (!loading && sessionId) {
      fetchNextQuestion(difficultyLevel);
    }
  }, [sessionId, loading, difficultyLevel]);

  const updateDifficultyLevel = async (correct: boolean) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const topicId = searchParams.get('topic');
    if (!topicId) return;

    let newDifficultyLevel = difficultyLevel;
    let newConsecutiveCorrect = correct ? consecutiveCorrect + 1 : 0;
    let newConsecutiveIncorrect = correct ? 0 : consecutiveIncorrect + 1;

    // Adjust difficulty based on performance, capped at 3
    if (newConsecutiveCorrect >= 3) {
      newDifficultyLevel = Math.min(3, difficultyLevel + 1);
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
    if (!currentQuestion || !sessionId) return;

    const correct = selectedAnswer === currentQuestion.question.correct_answer;
    setIsCorrect(correct);
    setShowFeedback(true);

    const questionPoints = correct ? currentQuestion.points : 0;
    const newScore = score + questionPoints;
    setScore(newScore);

    try {
      // Update question analytics and difficulty
      await updateDifficultyLevel(correct);

      // Calculate success rate for the session
      const successRate = (newScore / ((currentIndex + 1) * Math.max(...questions.map(q => q.points)))) * 100;

      // Record question history
      const questionHistory: QuestionHistory = {
        question_id: currentQuestion.id,
        difficulty_level: currentQuestion.difficulty_level,
        points_possible: currentQuestion.points,
        points_earned: questionPoints,
        time_taken: timeSpent,
        is_correct: correct,
        selected_answer: selectedAnswer
      };

      // Record analytics data
      const analyticsData: SessionAnalytics & { [key: string]: any } = {
        average_time_per_question: timeSpent / (currentIndex + 1),
        success_rate: successRate,
        difficulty_progression: {
          final_difficulty: difficultyLevel,
          time_spent: timeSpent
        }
      };

      // Update session progress
      if (sessionId) {
        const { error: sessionError } = await supabase
          .from('quiz_sessions')
          .update({ 
            questions_answered: currentIndex + 1,
            correct_answers: correct ? (score / Math.max(...questions.map(q => q.points))) + 1 : (score / Math.max(...questions.map(q => q.points))),
            final_score: newScore,
            status: 'in_progress',
            question_history: [...(currentQuestion.question_history || []), questionHistory],
            analytics_data: analyticsData,
            difficulty_progression: {
              final_difficulty: difficultyLevel,
              time_spent: timeSpent,
              difficulty_changes: difficultyLevel
            }
          })
          .eq('id', sessionId);

        if (sessionError) throw sessionError;
      }

      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No user session');

      // Record quest analytics
      const { error: analyticsError } = await supabase
        .from('quest_analytics')
        .insert({
          user_id: session.user.id,
          metric_name: 'Quest Score',
          metric_value: questionPoints,
          category: 'quiz_performance',
          recorded_at: new Date().toISOString(),
          quest_details: {
            question_id: currentQuestion.id,
            difficulty_level: currentQuestion.difficulty_level,
            time_taken: timeSpent,
            is_correct: correct,
            session_id: sessionId
          }
        });

      if (analyticsError) throw analyticsError;

      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowFeedback(false);

      if (currentIndex < MAX_QUESTIONS - 1) {
        setCurrentIndex(currentIndex + 1);
        await fetchNextQuestion(difficultyLevel);
      } else {
        await finishQuiz();
      }

    } catch (error: any) {
      console.error('Error updating progress:', error);
      toast({
        variant: "destructive",
        title: "Error updating progress",
        description: "Your progress may not have been saved correctly.",
      });
    }
  };

  const finishQuiz = async () => {
    if (!sessionId) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    // Calculate total possible points from all answered questions
    const totalPossiblePoints = questions.reduce((sum, q) => sum + q.points, 0);
    const correctAnswers = score / Math.max(...questions.map(q => q.points)); // Number of correct answers
    const accuracy = (score / totalPossiblePoints) * 100; // Accurate percentage based on points

    const stats = {
      totalQuestions: questions.length,
      correctAnswers: correctAnswers,
      finalScore: score,
      timeSpent: duration,
      accuracy: accuracy
    };

    const { error: updateError } = await supabase
      .from('quiz_sessions')
      .update({
        end_time: endTime.toISOString(),
        total_questions: stats.totalQuestions,
        correct_answers: correctAnswers,
        final_score: score,
        status: 'completed',
        questions_answered: questions.length,
        difficulty_progression: {
          final_difficulty: difficultyLevel,
          time_spent: duration,
          difficulty_changes: difficultyLevel
        },
        analytics_data: {
          ...stats,
          average_time_per_question: duration / questions.length,
          final_difficulty_level: difficultyLevel
        }
      })
      .eq('id', sessionId);

    if (updateError) {
      console.error('Error updating session:', updateError);
      toast({
        variant: "destructive",
        title: "Error Saving Results",
        description: "There was a problem saving your quiz results.",
      });
      return;
    }

    setSessionStats(stats);
    setShowOverview(true);
  };

  

  if (countdownActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <motion.div
          key={countdown}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          className="text-8xl font-bold text-primary-600"
        >
          {countdown}
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Preparing your quest...</h2>
        </div>
      </div>
    );
  }

  if (showOverview) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 space-y-6">
            <div className="text-center space-y-4">
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
              <h1 className="text-3xl font-bold text-primary-600">Quest Complete!</h1>
              <p className="text-gray-600">Session ID: {sessionId}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-primary-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Score</p>
                <p className="text-2xl font-bold text-primary-600">{sessionStats.finalScore}</p>
              </div>
              <div className="p-4 bg-primary-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Accuracy</p>
                <p className="text-2xl font-bold text-primary-600">{sessionStats.accuracy.toFixed(1)}%</p>
              </div>
              <div className="p-4 bg-primary-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Time</p>
                <p className="text-2xl font-bold text-primary-600">{Math.floor(sessionStats.timeSpent / 60)}m {sessionStats.timeSpent % 60}s</p>
              </div>
              <div className="p-4 bg-primary-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Final Level</p>
                <p className="text-2xl font-bold text-primary-600">{difficultyLevel}</p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button onClick={() => navigate('/explorer-map')}>
                Return to Map
              </Button>
              <Button onClick={() => navigate('/quest-chronicle')} variant="outline">
                View Progress
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowExitDialog(true)}
          className="absolute top-4 left-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Exit Quest
        </Button>

        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Exit Quest?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to exit? Your progress will be lost and this session will be marked as incomplete.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continue Quest</AlertDialogCancel>
              <AlertDialogAction onClick={handleExit} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Exit Quest
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="bg-white rounded-lg shadow-xl p-8 mt-12">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-primary-600">
                Quest Challenge
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>Level {difficultyLevel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span>Score: {score}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  <span>{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <Progress value={((currentIndex) / MAX_QUESTIONS) * 100} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              Question {currentIndex + 1} of {MAX_QUESTIONS}
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
              <Card className="p-6 bg-primary-50">
                <h3 className="font-semibold text-lg mb-4">
                  Level {currentQuestion.difficulty_level} Challenge
                </h3>
                
                {currentQuestion.question.image_url && (
                  <div className="mb-4 flex justify-center">
                    <img 
                      src={`https://xiomglpaumuuwqdpdvip.supabase.co/storage/v1/object/public/question-images/${currentQuestion.question.image_url}`}
                      alt="Question illustration"
                      className="max-h-48 object-contain rounded-lg shadow-md"
                    />
                  </div>
                )}
                
                <p className="text-lg">{currentQuestion.question.text}</p>
              </Card>

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
                      className="w-full text-lg py-6 transition-all duration-200 hover:bg-primary-100"
                      variant="outline"
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
