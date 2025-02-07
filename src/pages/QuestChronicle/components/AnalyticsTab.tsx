
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { AnalyticsSummary } from '../types';
import { AnalyticsSummaryCards } from './AnalyticsSummary';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full rounded-md border p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-8">
              <AnalyticsSummaryCards summary={analyticsSummary} />

              <Card>
                <CardHeader>
                  <CardTitle>Performance Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="period" stroke="currentColor" />
                        <YAxis stroke="currentColor" />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="avgScore"
                          stroke="var(--primary)"
                          strokeWidth={2}
                          dot={{ strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Category Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
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
