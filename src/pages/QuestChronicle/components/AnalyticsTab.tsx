
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Brain, Target, Clock, Zap } from 'lucide-react';
import { AnalyticsSummary } from '../types';
import { AnalyticsSummaryCards } from './AnalyticsSummary';

const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA'];

interface AnalyticsTabProps {
  loading: boolean;
  analyticsSummary: AnalyticsSummary;
  performanceData: any[];
  categoryData: any[];
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ 
  loading, 
  analyticsSummary, 
  performanceData, 
  categoryData 
}) => {
  // Format performance data to show percentages from 0-100
  const formattedPerformanceData = performanceData.map(data => ({
    ...data,
    avgScore: Math.round(data.avgScore) // Convert to percentage
  }));

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <Brain className="h-6 w-6" />
          Learning Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full rounded-md p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-8">
              <AnalyticsSummaryCards summary={analyticsSummary} />

              <Card className="border-2 border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Performance Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={formattedPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="period" 
                          stroke="currentColor"
                          tick={{ fill: 'currentColor' }}
                        />
                        <YAxis 
                          stroke="currentColor" 
                          domain={[0, 100]}
                          tick={{ fill: 'currentColor' }}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Average Score']}
                          contentStyle={{
                            backgroundColor: 'var(--background)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="avgScore"
                          stroke="var(--primary)"
                          strokeWidth={2}
                          dot={{ strokeWidth: 2, r: 4, fill: 'var(--background)' }}
                          activeDot={{ r: 6, strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Learning Category Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${Math.round(percent * 100)}%)`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((_, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]}
                              stroke="var(--background)"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'var(--background)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

