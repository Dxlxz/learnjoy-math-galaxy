
import React from 'react';
import { Play, FileText, Lock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TopicMilestone from '@/components/milestones/TopicMilestone';
import { Topic, Content } from '@/types/topic';

interface TopicDialogProps {
  topic: Topic | null;
  onOpenChange: (open: boolean) => void;
  onVideoSelect: (video: Content) => void;
}

const TopicDialog: React.FC<TopicDialogProps> = ({ 
  topic, 
  onOpenChange,
  onVideoSelect 
}) => {
  const navigate = useNavigate();

  const handleContentClick = (content: Content) => {
    if (!topic?.prerequisites_met) return;
    
    if (content.type === 'video') {
      onVideoSelect(content);
    } else if (content.type === 'worksheet') {
      window.open(content.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Dialog open={!!topic} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {topic?.prerequisites_met ? (
              <Play className="h-5 w-5 text-primary" />
            ) : (
              <Lock className="h-5 w-5 text-gray-400" />
            )}
            {topic?.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-600">{topic?.description}</p>

          {topic && !topic.prerequisites_met && (
            <div className="bg-amber-50 p-3 rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div className="text-sm text-amber-700">
                <p className="font-medium">Prerequisites Required</p>
                <p>Complete previous topics to unlock this content.</p>
              </div>
            </div>
          )}

          {topic?.milestones && topic.milestones.length > 0 && (
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

          {topic?.content && (
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Learning Content</h4>
              {topic.content
                .filter(content => content.type === 'video' || content.type === 'worksheet')
                .map((content) => (
                  <Card
                    key={content.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      topic.prerequisites_met 
                        ? 'hover:bg-primary-50' 
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => handleContentClick(content)}
                  >
                    <div className="flex items-center space-x-3">
                      {content.type === 'video' ? (
                        <Play className="h-5 w-5 text-primary-500" />
                      ) : (
                        <FileText className="h-5 w-5 text-primary-500" />
                      )}
                      <span>{content.title}</span>
                    </div>
                  </Card>
                ))}
            </div>
          )}

          <Button
            onClick={() => navigate(`/quest-challenge?topic=${topic?.id}`)}
            className="w-full mt-4"
            disabled={!topic?.prerequisites_met}
          >
            {topic?.prerequisites_met ? 'Begin Quest' : 'Prerequisites Required'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TopicDialog;
