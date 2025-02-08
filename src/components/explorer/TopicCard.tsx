
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import ContentList from './ContentList';
import { Topic, Content } from '@/types/explorer';
import TopicHeader from './TopicHeader';
import TopicMilestonesList from './TopicMilestonesList';
import QuestConfirmDialog from './QuestConfirmDialog';
import { initializeQuiz } from '@/services/quizService';

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
  const { toast } = useToast();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);

  const handleInitQuest = async () => {
    const result = await initializeQuiz(topic);
    
    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Error starting quest",
        description: result.error,
      });
      return;
    }

    navigate(`/quest-challenge?topic=${topic.id}&session=${result.sessionId}`);
  };

  const isTopicCompleted = topic.content_completed && topic.quest_completed;

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={onToggle}
      className={`p-6 bg-white rounded-lg shadow-md border transition-all duration-200 ${
        !topic.prerequisites_met 
          ? 'border-gray-300 opacity-75' 
          : isTopicCompleted
            ? 'border-green-300 bg-green-50'
            : topic.is_started 
              ? 'border-primary-300' 
              : 'border-primary-100 hover:shadow-lg'
      }`}
    >
      <div className="flex flex-col space-y-4">
        <TopicHeader 
          title={topic.title}
          isExpanded={isExpanded}
          prerequisites_met={topic.prerequisites_met}
          isCompleted={isTopicCompleted}
        />
        
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
          <TopicMilestonesList 
            milestones={topic.milestones || []}
            completedMilestones={topic.completedMilestones}
          />

          <ContentList 
            content={topic.content || []}
            prerequisitesMet={topic.prerequisites_met || false}
            onContentClick={onContentClick}
          />
        </CollapsibleContent>

        <Button
          onClick={() => setShowConfirmDialog(true)}
          className={`w-full mt-4 ${
            isTopicCompleted 
              ? 'bg-green-500 hover:bg-green-600' 
              : ''
          }`}
          disabled={!topic.prerequisites_met}
        >
          {isTopicCompleted 
            ? 'Quest Completed!' 
            : topic.prerequisites_met 
              ? 'Begin Quest' 
              : 'Prerequisites Required'}
        </Button>

        <QuestConfirmDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          onConfirm={handleInitQuest}
        />
      </div>
    </Collapsible>
  );
};

export default TopicCard;

