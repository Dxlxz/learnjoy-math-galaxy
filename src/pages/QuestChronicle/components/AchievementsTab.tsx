
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Achievement } from '../types';
import { AchievementGallery } from './AchievementGallery';

interface AchievementsTabProps {
  achievements: Achievement[];
  loading: boolean;
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({ achievements, loading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievement Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <AchievementGallery achievements={achievements} loading={loading} />
      </CardContent>
    </Card>
  );
};
