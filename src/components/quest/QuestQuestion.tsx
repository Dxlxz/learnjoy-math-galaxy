
import React, { useState } from 'react';
import { Question } from '@/types/explorer';
import { Button } from '@/components/ui/button';
import { Card } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface QuestQuestionProps {
  currentQuestion: {
    id: string;
    question: Question;
    difficulty_level: number;
    points: number;
  } | null;
  handleAnswer: (selectedAnswer: string) => void;
  showFeedback: boolean;
}

const QuestQuestion: React.FC<QuestQuestionProps> = ({
  currentQuestion,
  handleAnswer,
  showFeedback
}) => {
  const [showHint, setShowHint] = useState(false);

  if (!currentQuestion) return null;

  return (
    <motion.div
      key={currentQuestion.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <Card className="p-6 bg-primary-50 relative">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg">
            Level {currentQuestion.difficulty_level} Challenge
          </h3>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHint(!showHint)}
                  className="text-primary-600 hover:text-primary-700"
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Need a hint? Click here!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
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

        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-primary-100 rounded-lg border border-primary-200"
          >
            <p className="text-sm text-primary-700">
              💡 {currentQuestion.question.hint || "No hint available for this question."}
            </p>
          </motion.div>
        )}
      </Card>

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
  );
};

export default QuestQuestion;
