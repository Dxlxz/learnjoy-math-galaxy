
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

interface TimelineTabProps {
  loading: boolean;
  analyticsData: any[];
}

export const TimelineTab: React.FC<TimelineTabProps> = ({ loading, analyticsData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Adventure Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full rounded-md border p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-8">
              <ChartContainer 
                className="h-[400px]"
                config={{
                  line1: { theme: { light: "var(--primary)", dark: "var(--primary)" } },
                }}
              >
                <LineChart data={analyticsData}>
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
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
