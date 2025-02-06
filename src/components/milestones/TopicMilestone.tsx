
import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  Hash, // Instead of Numbers
  Shapes,
  Star,
  Plus,
  Minus,
  Sword,
  Crown,
  Calculator,
  Trophy,
  Wand2, // Instead of Magic
  Ruler,
  Book,
  Compass,
  Medal,
  Zap, // Instead of Lightning
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
    <Card className={`p-4 transition-all duration-200 ${
      isCompleted 
        ? 'bg-primary-50 border-primary' 
        : 'bg-white hover:bg-gray-50'
    }`}>
      <div className="flex items-start space-x-4">
        <div className={`p-2 rounded-full ${
          isCompleted 
            ? 'bg-primary text-white' 
            : 'bg-gray-100 text-gray-500'
        }`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h4 className={`font-semibold ${
            isCompleted ? 'text-primary' : 'text-gray-700'
          }`}>
            {title}
          </h4>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </Card>
  );
};

export default TopicMilestone;
