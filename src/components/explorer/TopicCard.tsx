
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import TopicMilestone from '@/components/milestones/TopicMilestone';
import ContentList from './ContentList';
import { Topic, Content } from '@/types/explorer';

interface TopicCardProps {
  topic: Topic;
  isExpanded: boolean;
  onToggle: () => void;
  onContentClick: (content: Content) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ 
  topic, 
  isExpanded, 
  onToggle,
  onContentClick 
}) => {
  const navigate = useNavigate();

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={onToggle}
      className={`p-6 bg-white rounded-lg shadow-md border transition-all duration-200 ${
        !topic.prerequisites_met 
          ? 'border-gray-300 opacity-75' 
          : topic.is_started 
            ? 'border-primary-300' 
            : 'border-primary-100 hover:shadow-lg'
      }`}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {!topic.prerequisites_met && <Lock className="h-4 w-4 text-gray-400" />}
            <h3 className="font-semibold text-lg">{topic.title}</h3>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <p className="text-gray-600">{topic.description}</p>

        {!topic.prerequisites_met && (
          <div className="bg-amber-50 p-3 rounded-md flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div className="text-sm text-amber-700">
              <p className="font-medium">Prerequisites Required</p>
              <p>Complete previous topics to unlock this content.</p>
            </div>
          </div>
        )}
        
        <CollapsibleContent className="space-y-4 mt-4">
          {/* Milestones Section */}
          {topic.milestones && topic.milestones.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Milestones</h4>
              {topic.milestones.map((milestone) => (
                <TopicMilestone
                  key={milestone.id}
                  title={milestone.title}
                  description={milestone.description || ''}
                  iconName={milestone.icon_name}
                  isCompleted={topic.completedMilestones?.includes(milestone.id)}
                />
              ))}
            </div>
          )}

          {/* Content Section */}
          <ContentList 
            content={topic.content || []}
            prerequisitesMet={topic.prerequisites_met || false}
            onContentClick={onContentClick}
          />
        </CollapsibleContent>

        <Button
          onClick={() => navigate(`/quest-challenge?topic=${topic.id}`)}
          className="w-full mt-4"
          disabled={!topic.prerequisites_met}
        >
          {topic.prerequisites_met ? 'Begin Quest' : 'Prerequisites Required'}
        </Button>
      </div>
    </Collapsible>
  );
};

export default TopicCard;
