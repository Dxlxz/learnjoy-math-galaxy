
import React from 'react';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuestFeedbackProps {
  isCorrect: boolean;
  explanation: string;
}

const QuestFeedback: React.FC<QuestFeedbackProps> = ({ isCorrect, explanation }) => {
  return (
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
        {explanation}
      </p>
    </motion.div>
  );
};

export default QuestFeedback;
