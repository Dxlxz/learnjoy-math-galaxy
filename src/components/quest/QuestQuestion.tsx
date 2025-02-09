
import React from 'react';
import { Question } from '@/types/explorer';
import { Button } from '@/components/ui/button';
import { Card } from "@/components/ui/card";
import { motion } from 'framer-motion';

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
  if (!currentQuestion) return null;

  return (
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
