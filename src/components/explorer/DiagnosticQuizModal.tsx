
import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CircleCheck, CircleX, ArrowRight, Star, Award } from 'lucide-react';
import { toast } from 'sonner';

interface DiagnosticQuizModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  grade: string;
  onComplete: (score: number) => void;
}

// Sample questions per grade (in real app, these would come from the database)
const gradeQuestions: Record<string, Array<{question: string, options: string[], correct: number}>> = {
  'K1': [
    {
      question: "Count the stars: ⭐⭐⭐",
      options: ["2", "3", "4", "5"],
      correct: 1
    },
    {
      question: "Which number comes after 2?",
      options: ["1", "3", "4", "5"],
      correct: 1
    },
    {
      question: "How many circles? ○ ○",
      options: ["1", "2", "3", "4"],
      correct: 1
    }
  ],
  'K2': [
    {
      question: "What comes next? 2, 4, 6, __",
      options: ["7", "8", "9", "10"],
      correct: 1
    },
    {
      question: "How many tens in 25?",
      options: ["1", "2", "3", "4"],
      correct: 1
    },
    {
      question: "10 + 5 = ?",
      options: ["12", "15", "17", "20"],
      correct: 1
    }
  ],
  'G1': [
    {
      question: "20 + 30 = ?",
      options: ["40", "50", "60", "70"],
      correct: 1
    },
    {
      question: "What is half of 10?",
      options: ["2", "4", "5", "6"],
      correct: 2
    },
    {
      question: "100 - 20 = ?",
      options: ["60", "70", "80", "90"],
      correct: 2
    }
  ]
};

const DiagnosticQuizModal = ({
  isOpen,
  onOpenChange,
  grade,
  onComplete
}: DiagnosticQuizModalProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const questions = gradeQuestions[grade] || gradeQuestions['K1'];
  const currentQuestionData = questions[currentQuestion];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    const isCorrect = answerIndex === currentQuestionData.correct;
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }

    // Show feedback toast
    if (isCorrect) {
      toast.success("Amazing! That's correct! ✨", {
        icon: <Star className="w-5 h-5 text-yellow-400" />
      });
    } else {
      toast("Keep trying! You're doing great!", {
        icon: <Star className="w-5 h-5 text-blue-400" />
      });
    }

    // Wait for animation and proceed to next question
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        setIsComplete(true);
      }
    }, 1500);
  };

  const handleComplete = () => {
    const score = (correctAnswers / questions.length) * 100;
    onComplete(score);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white to-[#F0F7FF] border-2">
        <div className="flex flex-col items-center space-y-6 p-6">
          {!isComplete ? (
            <>
              {/* Progress Indicator */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question */}
              <div className="text-center space-y-4 w-full">
                <h3 className="text-2xl font-bold text-gray-800 animate-fade-in">
                  {currentQuestionData.question}
                </h3>
                
                {/* Options */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {currentQuestionData.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showFeedback}
                      className={`
                        p-6 text-lg relative transition-all duration-300
                        ${showFeedback && index === currentQuestionData.correct 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : showFeedback && index === selectedAnswer
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200'}
                        ${!showFeedback && 'hover:scale-105'}
                      `}
                    >
                      {option}
                      {showFeedback && index === currentQuestionData.correct && (
                        <CircleCheck className="absolute -top-2 -right-2 w-6 h-6 text-green-500 bg-white rounded-full" />
                      )}
                      {showFeedback && index === selectedAnswer && index !== currentQuestionData.correct && (
                        <CircleX className="absolute -top-2 -right-2 w-6 h-6 text-red-500 bg-white rounded-full" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            // Completion Screen
            <div className="text-center space-y-6">
              <Award className="w-16 h-16 text-yellow-400 animate-bounce mx-auto" />
              <h2 className="text-2xl font-bold text-gray-800">
                Quest Complete! 🎉
              </h2>
              <p className="text-lg text-gray-600">
                You got {correctAnswers} out of {questions.length} correct!
              </p>
              <Button
                onClick={handleComplete}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#D6BCFA] hover:from-[#7C3AED] hover:to-[#C4B5FD] 
                         text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl 
                         transition-all duration-300 animate-fade-in"
              >
                Continue Your Adventure! <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiagnosticQuizModal;
