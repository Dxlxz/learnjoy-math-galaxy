
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { AnalyticsSummary } from '../types';
import { AnalyticsSummaryCards } from './AnalyticsSummary';

// Define a vibrant color palette for the charts
const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9'];
const CHART_LINE_COLOR = '#6366F1';

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
  const formattedPerformanceData = performanceData.map(data => ({
    ...data,
    avgScore: Math.round(data.avgScore)
  }));

  return (
    <Card className="bg-gradient-to-br from-primary-50 to-white border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary-800">Progress Analytics</CardTitle>
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

              <Card className="bg-white/50 backdrop-blur-sm border border-primary/10 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-primary-700">Performance Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={formattedPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-primary-100" />
                        <XAxis 
                          dataKey="period" 
                          stroke="#6366F1"
                          tick={{ fill: '#6366F1' }}
                        />
                        <YAxis 
                          stroke="#6366F1"
                          tick={{ fill: '#6366F1' }}
                          domain={[0, 100]} 
                        />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Average Score']}
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #6366F1',
                            borderRadius: '8px'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="avgScore"
                          stroke={CHART_LINE_COLOR}
                          strokeWidth={3}
                          dot={{ fill: CHART_LINE_COLOR, strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/50 backdrop-blur-sm border border-primary/10 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-primary-700">Learning Category Distribution</CardTitle>
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
                          label={({ name, percent }) => `${name} (${Math.round(percent * 100)}%)`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((_, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]}
                              className="hover:opacity-80 transition-opacity"
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #6366F1',
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
