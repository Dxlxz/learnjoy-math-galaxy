
import React, { memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Target, Clock, Zap } from 'lucide-react';
import { AnalyticsSummary as AnalyticsSummaryType } from '../types';

interface AnalyticsSummaryProps {
  summary: AnalyticsSummaryType;
}

export const AnalyticsSummaryCards = memo(({ summary }: AnalyticsSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Quests</p>
              <p className="text-2xl font-bold">{summary.totalQuests}</p>
            </div>
            <Brain className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Average Score</p>
              <p className="text-2xl font-bold">{summary.avgScore.toFixed(1)}%</p>
            </div>
            <Target className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Time Spent</p>
              <p className="text-2xl font-bold">{Math.round(summary.timeSpent / 60)} mins</p>
            </div>
            <Clock className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold">{summary.completionRate.toFixed(1)}%</p>
            </div>
            <Zap className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

AnalyticsSummaryCards.displayName = 'AnalyticsSummaryCards';
