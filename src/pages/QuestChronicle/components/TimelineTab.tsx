
import React, { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Button } from '@/components/ui/button';
import { Trophy, Scroll, Target, Star } from 'lucide-react';
import { PaginatedResponse } from '@/types/shared';
import { format, isValid, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface TimelineTabProps {
  loading: boolean;
  analyticsData: PaginatedResponse<any>;
  onLoadMore?: () => void;
}

export const TimelineTab = memo(({ loading, analyticsData, onLoadMore }: TimelineTabProps) => {
  const [page, setPage] = useState(1);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
    onLoadMore?.();
  };

  const getAdventureIcon = (category: string) => {
    switch (category) {
      case 'quest':
        return <Target className="h-6 w-6 text-blue-500" />;
      case 'achievement':
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      default:
        return <Star className="h-6 w-6 text-purple-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date not available';
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'PPp') : 'Invalid date';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scroll className="h-6 w-6 text-primary" />
          Adventure Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full rounded-md border p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-8">
              <ChartContainer 
                className="h-[300px]"
                config={{
                  line1: { theme: { light: "var(--primary)", dark: "var(--primary)" } },
                }}
              >
                <LineChart data={analyticsData.data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    stroke="currentColor"
                    className="text-muted-foreground"
                  />
                  <YAxis
                    stroke="currentColor"
                    className="text-muted-foreground"
                  />
                  <ChartTooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Progress"
                    className="fill-primary stroke-primary"
                    strokeWidth={2}
                    dot={{ strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </LineChart>
              </ChartContainer>

              <div className="space-y-4">
                {analyticsData.data.map((entry, index) => (
                  <Card key={index} className="bg-card hover:bg-accent/5 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-background rounded-full">
                          {getAdventureIcon(entry.category)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg text-primary">
                              {entry.topic_title || 'Adventure Quest'}
                            </h3>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(entry.recorded_at)}
                            </span>
                          </div>
                          
                          {entry.topic_description && (
                            <p className="text-muted-foreground mt-1">
                              {entry.topic_description}
                            </p>
                          )}
                          
                          <div className="mt-4 grid grid-cols-3 gap-4">
                            {entry.final_score !== null && (
                              <div className="bg-background p-3 rounded-lg">
                                <p className="text-sm text-muted-foreground">Final Score</p>
                                <p className="text-lg font-semibold">{entry.final_score}%</p>
                              </div>
                            )}
                            
                            {entry.questions_answered !== null && (
                              <div className="bg-background p-3 rounded-lg">
                                <p className="text-sm text-muted-foreground">Questions</p>
                                <p className="text-lg font-semibold">
                                  {entry.questions_answered}/{entry.max_questions}
                                </p>
                              </div>
                            )}
                            
                            {entry.achievement_details && (
                              <div className="bg-background p-3 rounded-lg">
                                <p className="text-sm text-muted-foreground">Achievements</p>
                                <p className="text-lg font-semibold flex items-center gap-1">
                                  <Trophy className="h-4 w-4 text-yellow-500" />
                                  {Object.keys(entry.achievement_details).length}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {analyticsData.hasMore && (
                <div className="flex justify-center mt-4">
                  <Button
                    onClick={handleLoadMore}
                    variant="outline"
                    disabled={loading}
                  >
                    Load More Adventures
                  </Button>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
});

TimelineTab.displayName = 'TimelineTab';
