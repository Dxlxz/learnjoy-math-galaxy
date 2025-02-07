
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import TopicMilestone from '@/components/milestones/TopicMilestone';
import { Achievement } from '../types';

interface AchievementGalleryProps {
  achievements: Achievement[];
  loading: boolean;
}

export const AchievementGallery: React.FC<AchievementGalleryProps> = ({ achievements, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <TopicMilestone
            key={achievement.id}
            title={achievement.title}
            description={achievement.description}
            iconName={achievement.icon_name}
            isCompleted={achievement.earned}
          />
        ))}
        {achievements.length === 0 && (
          <p className="text-center text-muted-foreground col-span-full">
            Start your journey to unlock achievements!
          </p>
        )}
      </div>
    </ScrollArea>
  );
};
