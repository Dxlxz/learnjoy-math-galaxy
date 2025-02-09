
// Move from src/components/quest/QuestFeedback.tsx
import React from 'react';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Alert } from "@/components/ui/alert";

interface QuestFeedbackProps {
  isCorrect: boolean;
  explanation: string;
}

const QuestFeedback: React.FC<QuestFeedbackProps> = ({ isCorrect, explanation }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`mt-6 ${
        isCorrect ? 'bg-green-100' : 'bg-red-100'
      }`}
    >
      <Alert variant={isCorrect ? "default" : "destructive"} className="border-2">
        <motion.div
          className="flex items-center gap-3"
          animate={{ rotate: isCorrect ? [0, 360] : 0 }}
          transition={{ duration: 0.5 }}
        >
          {isCorrect ? (
            <Check className="h-5 w-5 text-green-600" />
          ) : (
            <X className="h-5 w-5 text-red-600" />
          )}
          <div className="space-y-2">
            <p className={`font-medium ${
              isCorrect ? 'text-green-700' : 'text-red-700'
            }`}>
              {isCorrect ? 'Brilliant! ' : 'Not quite right. '}
            </p>
            <p className="text-sm leading-relaxed">
              {explanation}
            </p>
          </div>
        </motion.div>
      </Alert>
    </motion.div>
  );
};

export default QuestFeedback;
