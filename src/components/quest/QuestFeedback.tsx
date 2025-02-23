
import React from 'react';
import { Check, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface QuestFeedbackProps {
  isCorrect: boolean;
  explanation: string;
}

const QuestFeedback: React.FC<QuestFeedbackProps> = ({ isCorrect, explanation }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={cn(
          "p-6 shadow-lg border-2",
          isCorrect 
            ? "bg-green-50 border-green-200" 
            : "bg-red-50 border-red-200"
        )}>
          <div className="flex items-start gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              className={cn(
                "p-3 rounded-full",
                isCorrect ? "bg-green-100" : "bg-red-100"
              )}
            >
              {isCorrect ? (
                <Check className="h-6 w-6 text-green-600" />
              ) : (
                <X className="h-6 w-6 text-red-600" />
              )}
            </motion.div>

            <div className="flex-1 space-y-2">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "text-lg font-semibold",
                  isCorrect ? "text-green-700" : "text-red-700"
                )}
              >
                {isCorrect ? "Brilliant Answer! 🌟" : "Not Quite Right"}
              </motion.h3>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-2 mt-2"
              >
                <BookOpen className={cn(
                  "h-5 w-5 mt-1",
                  isCorrect ? "text-green-600" : "text-red-600"
                )} />
                <p className={cn(
                  "text-sm",
                  isCorrect ? "text-green-600" : "text-red-600"
                )}>
                  {explanation || (isCorrect 
                    ? "Well done! Keep up the great work!"
                    : "Don't worry! Every mistake is a chance to learn."
                  )}
                </p>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuestFeedback;
