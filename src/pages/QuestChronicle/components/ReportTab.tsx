
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Star, RefreshCw } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { HeroReport as HeroReportType } from '../types';
import { HeroReport } from './HeroReport';

interface ReportTabProps {
  loading: boolean;
  reports: HeroReportType[];
  generatingReport: boolean;
  onGenerateReport: () => void;
}

export const ReportTab: React.FC<ReportTabProps> = ({ 
  loading, 
  reports, 
  generatingReport, 
  onGenerateReport 
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Hero Report</CardTitle>
        <Button 
          onClick={onGenerateReport} 
          disabled={generatingReport}
          className="ml-auto"
        >
          {generatingReport ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Star className="mr-2 h-4 w-4" />
              Generate New Report
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full rounded-md border p-4">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          ) : reports.length > 0 ? (
            <div className="space-y-8">
              {reports.map((report) => (
                <HeroReport key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <Star className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">No Reports Generated Yet</p>
              <p className="text-sm text-muted-foreground">
                Generate your first hero report to see your learning journey!
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
