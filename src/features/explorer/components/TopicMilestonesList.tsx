import React from 'react';
import TopicMilestone from '@/components/milestones/TopicMilestone';
import { Milestone } from '@/types/explorer';

interface TopicMilestonesListProps {
  milestones: Milestone[];
  completedMilestones?: string[];
}

const TopicMilestonesList: React.FC<TopicMilestonesListProps> = ({
  milestones,
  completedMilestones = []
}) => {
  if (!milestones || milestones.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-primary">Milestones</h4>
      {milestones.map((milestone) => (
        <TopicMilestone
          key={milestone.id}
          title={milestone.title}
          description={milestone.description || ''}
          iconName={milestone.icon_name}
          isCompleted={completedMilestones?.includes(milestone.id)}
        />
      ))}
    </div>
  );
};

export default TopicMilestonesList;
