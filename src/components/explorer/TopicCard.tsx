import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Trophy, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
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

  // Fetch prerequisite topic titles
  const { data: prerequisiteTopics } = useQuery({
    queryKey: ['prerequisite-topics', topic.prerequisites?.required_topics],
    queryFn: async () => {
      if (!topic.prerequisites?.required_topics?.length) return [];
      
      const { data, error } = await supabase
        .from('topics')
        .select('id, title')
        .in('id', topic.prerequisites.required_topics);

      if (error) {
        console.error('Error fetching prerequisite topics:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!topic.prerequisites?.required_topics?.length
  });

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

  const calculateProgress = () => {
    let progress = 0;
    if (topic.content_completed) progress += 50;
    if (topic.quest_completed) progress += 50;
    return progress;
  };

  const progress = calculateProgress();
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

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#2D3748]">Quest Progress</span>
            <span className="text-sm text-muted-foreground">
              {progress}%
            </span>
          </div>
          <Progress 
            value={progress} 
            className={`h-2 ${progress === 100 ? 'bg-secondary [&>.bg-primary]:bg-green-500' : 'bg-secondary [&>.bg-primary]:bg-red-500'}`}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Content: {topic.content_completed ? '50%' : '0%'}</span>
            <span>Quest: {topic.quest_completed ? '50%' : '0%'}</span>
          </div>
        </div>

        {!topic.prerequisites_met && prerequisiteTopics?.length > 0 && (
          <div className="bg-amber-50 p-3 rounded-md flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div className="text-sm text-amber-700">
              <p className="font-medium">Prerequisites Required</p>
              <p>Complete these topics first:</p>
              <ul className="list-disc ml-4 mt-1">
                {prerequisiteTopics.map(prereq => (
                  <li key={prereq.id}>{prereq.title}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        <CollapsibleContent className="space-y-4 mt-4">
          {/* Milestones Section */}
          {topic.milestones && topic.milestones.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#2D3748] flex items-center gap-2">
                <Star className="h-5 w-5 text-[#FFC107]" />
                Milestones
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {topic.milestones.map((milestone) => (
                  <div 
                    key={milestone.id}
                    className={`p-4 rounded-lg border-2 ${
                      topic.completedMilestones?.includes(milestone.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-[#FFC107]/20'
                    }`}
                  >
                    <h4 className="font-semibold mb-1">{milestone.title}</h4>
                    <p className="text-sm text-gray-600">{milestone.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

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
