
import React from 'react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hash,
  Shapes,
  Star,
  Plus,
  Minus,
  Sword,
  Crown,
  Calculator,
  Trophy,
  Wand2,
  Ruler,
  Book,
  Compass,
  Medal,
  Zap,
  Calendar
} from 'lucide-react';

interface TopicMilestoneProps {
  title: string;
  description: string;
  iconName: string;
  isCompleted?: boolean;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Numbers: Hash,
  Shapes,
  Star,
  Plus,
  Minus,
  Sword,
  Crown,
  Calculator,
  Trophy,
  Magic: Wand2,
  Ruler,
  Book,
  Compass,
  Medal,
  Lightning: Zap,
  Calendar
};

const TopicMilestone: React.FC<TopicMilestoneProps> = ({
  title,
  description,
  iconName,
  isCompleted = false
}) => {
  const Icon = iconMap[iconName] || Star;

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`p-4 transition-all duration-500 transform ${
        isCompleted 
          ? 'bg-gradient-to-r from-primary-50 to-primary-100 border-primary shadow-lg' 
          : 'bg-white hover:bg-gray-50 hover:shadow-md'
      }`}>
        <div className="flex items-start space-x-4">
          <motion.div
            className={`p-3 rounded-full ${
              isCompleted 
                ? 'bg-primary text-white shadow-inner' 
                : 'bg-gray-100 text-gray-500'
            }`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="h-6 w-6" />
          </motion.div>
          <div className="flex-1">
            <h4 className={`font-semibold ${
              isCompleted ? 'text-primary' : 'text-gray-700'
            }`}>
              {title}
            </h4>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          {isCompleted && (
            <AnimatePresence>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-2 -right-2"
              >
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-white" />
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
        {isCompleted && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={false}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-full h-full bg-gradient-to-r from-primary-200/20 to-primary-400/20 rounded-lg" />
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default TopicMilestone;
