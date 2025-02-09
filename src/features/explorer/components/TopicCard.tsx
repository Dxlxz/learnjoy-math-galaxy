import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TopicHeader from './TopicHeader';
import ContentList from './ContentList';
import TopicMilestonesList from './TopicMilestonesList';
import QuestConfirmDialog from './QuestConfirmDialog';
import { Topic, Content } from '@/types/explorer';
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

interface TopicCardProps {
  topic: Topic;
  isExpanded?: boolean;
  onToggle?: () => void;
  onContentClick?: (content: Content) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  isExpanded = false,
  onToggle,
  onContentClick
}) => {
  const [open, setOpen] = React.useState(false);

  const handleQuestStart = () => {
    setOpen(true);
  };

  const confirmQuestStart = () => {
    // Navigate to the quest page with the topic ID
    window.location.href = `/quest-challenge?topicId=${topic.id}`;
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card className="w-full">
        <CardContent className="p-4">
          <TopicHeader
            title={topic.title}
            isExpanded={isExpanded}
            prerequisites_met={topic.prerequisites_met || false}
            isCompleted={topic.is_completed || false}
          />
          <CollapsibleContent className="pt-2">
            <p className="text-sm text-gray-500">{topic.description}</p>
            <ContentList
              content={topic.content}
              onContentClick={onContentClick}
            />
            <TopicMilestonesList
              milestones={topic.milestones}
              completedMilestones={topic.completedMilestones}
            />
            <Button onClick={handleQuestStart} disabled={!topic.prerequisites_met}>
              Start Quest
            </Button>
          </CollapsibleContent>
        </CardContent>
      </Card>
      <QuestConfirmDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={confirmQuestStart}
      />
    </Collapsible>
  );
};

export default TopicCard;
