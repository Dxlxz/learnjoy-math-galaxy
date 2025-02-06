
import React from 'react';
import { Play, FileText, Lock, AlertCircle, Sparkles } from 'lucide-react';
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
import { motion, AnimatePresence } from 'framer-motion';

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
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-b from-primary-50/90 to-white/90 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            {topic?.prerequisites_met ? (
              <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
            ) : (
              <Lock className="h-6 w-6 text-gray-400" />
            )}
            {topic?.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-gray-600 font-medium">{topic?.description}</p>

          {topic && !topic.prerequisites_met && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 p-4 rounded-lg border border-amber-200 flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div className="text-sm text-amber-700">
                <p className="font-semibold">Magical Barrier Detected!</p>
                <p>Complete previous challenges to unlock this mystical knowledge.</p>
              </div>
            </motion.div>
          )}

          {topic?.milestones && topic.milestones.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-primary text-lg flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Achievements to Unlock
              </h4>
              <div className="grid gap-3">
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
            </div>
          )}

          {topic?.content && (
            <div className="space-y-3">
              <h4 className="font-semibold text-primary text-lg">Magical Resources</h4>
              <div className="grid gap-3">
                {topic.content
                  .filter(content => content.type === 'video' || content.type === 'worksheet')
                  .map((content) => (
                    <motion.div
                      key={content.id}
                      whileHover={{ scale: topic.prerequisites_met ? 1.02 : 1 }}
                      whileTap={{ scale: topic.prerequisites_met ? 0.98 : 1 }}
                    >
                      <Card
                        className={`p-4 cursor-pointer transition-all duration-200 border-2 ${
                          content.type === 'video'
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200'
                            : 'bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 border-amber-200'
                        } ${
                          topic.prerequisites_met 
                            ? 'hover:shadow-lg' 
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                        onClick={() => handleContentClick(content)}
                      >
                        <div className="flex items-center space-x-3">
                          {content.type === 'video' ? (
                            <div className="p-2 bg-blue-100 rounded-full">
                              <Play className="h-5 w-5 text-blue-600" />
                            </div>
                          ) : (
                            <div className="p-2 bg-amber-100 rounded-full">
                              <FileText className="h-5 w-5 text-amber-600" />
                            </div>
                          )}
                          <div>
                            <h5 className="font-medium">{content.title}</h5>
                            <p className="text-sm text-gray-600">
                              {content.type === 'video' ? 'Magical Portal' : 'Ancient Scroll'}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </div>
          )}

          <Button
            onClick={() => navigate(`/quest-challenge?topic=${topic?.id}`)}
            className="w-full mt-6 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg"
            disabled={!topic?.prerequisites_met}
          >
            {topic?.prerequisites_met ? 'Begin Magical Quest' : 'Prerequisites Required'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TopicDialog;
