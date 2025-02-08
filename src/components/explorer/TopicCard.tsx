
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
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

  const initializeQuest = async () => {
    try {
      console.log('Initializing quest for topic:', topic.id);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please login to start a quest.",
        });
        return;
      }

      // 1. Initialize quiz session with detailed error logging
      console.log('Creating quiz session...');
      const { data: sessionData, error: sessionError } = await supabase
        .from('quiz_sessions')
        .insert({
          user_id: session.user.id,
          topic_id: topic.id,
          total_questions: 0,
          correct_answers: 0,
          final_score: 0,
          status: 'in_progress',
          questions_answered: 0,
          max_questions: 10
        })
        .select('id, topic_id')
        .single();

      if (sessionError) {
        console.error('Error creating quiz session:', sessionError);
        toast({
          variant: "destructive",
          title: "Error starting quest",
          description: `Unable to initialize quest: ${sessionError.message}`,
        });
        return;
      }

      console.log('Quiz session created successfully:', sessionData);

      // 2. Initialize or get user difficulty level with error logging
      console.log('Setting up difficulty level...');
      const { data: difficultyData, error: difficultyError } = await supabase
        .from('user_difficulty_levels')
        .upsert({
          user_id: session.user.id,
          topic_id: topic.id,
          current_difficulty_level: 1,
          consecutive_correct: 0,
          consecutive_incorrect: 0,
          total_questions_attempted: 0,
          success_rate: 0
        }, {
          onConflict: 'user_id,topic_id'
        })
        .select()
        .single();

      if (difficultyError) {
        console.error('Error setting difficulty:', difficultyError);
        toast({
          variant: "destructive",
          title: "Error starting quest",
          description: `Unable to set difficulty level: ${difficultyError.message}`,
        });
        return;
      }

      console.log('Difficulty level set successfully:', difficultyData);

      // 3. If both operations succeed, navigate to quest with session ID
      console.log('Navigating to quest challenge...');
      navigate(`/quest-challenge?topic=${topic.id}&session=${sessionData.id}`);
      
    } catch (error) {
      console.error('Unexpected error initializing quest:', error);
      toast({
        variant: "destructive",
        title: "Error starting quest",
        description: "An unexpected error occurred. Please try again.",
      });
    }
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
          onConfirm={initializeQuest}
        />
      </div>
    </Collapsible>
  );
};

export default TopicCard;
