
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import TopicMilestone from '@/components/milestones/TopicMilestone';
import ContentList from './ContentList';
import { Topic, Content } from '@/types/explorer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please login to start a quest.",
        });
        return;
      }

      // 1. Initialize quiz session with a focused query
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
        console.error('Error creating session:', sessionError);
        toast({
          variant: "destructive",
          title: "Error starting quest",
          description: "Unable to initialize quest. Please try again.",
        });
        return;
      }

      // 2. Initialize or get user difficulty level
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
          description: "Unable to set difficulty level. Please try again.",
        });
        return;
      }

      // 3. If both operations succeed, navigate to quest with session ID
      navigate(`/quest-challenge?topic=${topic.id}&session=${sessionData.id}`);
      
    } catch (error) {
      console.error('Error initializing quest:', error);
      toast({
        variant: "destructive",
        title: "Error starting quest",
        description: "Something went wrong. Please try again.",
      });
    }
  };

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
          onClick={() => setShowConfirmDialog(true)}
          className="w-full mt-4"
          disabled={!topic.prerequisites_met}
        >
          {topic.prerequisites_met ? 'Begin Quest' : 'Prerequisites Required'}
        </Button>

        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ready to Begin Your Quest?</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to embark on a learning adventure. Make sure you have enough time to complete the quest. Are you ready to begin?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Not Yet</AlertDialogCancel>
              <AlertDialogAction onClick={initializeQuest}>Begin Quest</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Collapsible>
  );
};

export default TopicCard;
