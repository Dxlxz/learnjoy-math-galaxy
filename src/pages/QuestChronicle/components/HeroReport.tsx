
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HeroReport as HeroReportType } from '../types';

interface HeroReportProps {
  report: HeroReportType;
}

export const HeroReport: React.FC<HeroReportProps> = ({ report }) => {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Hero Report - {format(new Date(report.generated_at), 'PPP')}
          </h3>
          <p className="text-sm text-muted-foreground">
            Generated at {format(new Date(report.generated_at), 'pp')}
          </p>
        </div>
        <Button variant="outline" className="ml-auto">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="mb-2 font-semibold">Achievements & Progress</h4>
          <div className="space-y-2">
            <p>🏆 Achievements Unlocked: {report.report_data.achievements}</p>
            <p>📚 Total Quests Completed: {report.report_data.totalQuests}</p>
            <p>⭐ Average Score: {report.report_data.averageScore.toFixed(1)}%</p>
            <p>✅ Completion Rate: {report.report_data.completionRate.toFixed(1)}%</p>
          </div>
        </div>

        <div>
          <h4 className="mb-2 font-semibold">Strengths</h4>
          <ul className="list-disc pl-4">
            {report.report_data.strengths.map((strength, index) => (
              <li key={index} className="text-green-600">{strength}</li>
            ))}
          </ul>

          <h4 className="mb-2 mt-4 font-semibold">Areas for Growth</h4>
          <ul className="list-disc pl-4">
            {report.report_data.areasForImprovement.map((area, index) => (
              <li key={index} className="text-blue-600">{area}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="mb-4 font-semibold">Recent Progress</h4>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={report.report_data.recentProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
