
import React from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, BarChart, Star, Calendar } from 'lucide-react';
import FloatingNav from '@/components/navigation/FloatingNav';
import { TimelineTab } from './components/TimelineTab';
import { AchievementsTab } from './components/AchievementsTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { ReportTab } from './components/ReportTab';
import { useAchievements } from './hooks/useAchievements';
import { useAnalytics } from './hooks/useAnalytics';
import { useHeroReports } from './hooks/useHeroReports';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const QuestChronicle = () => {
  const { achievements, loading: achievementsLoading } = useAchievements();
  const { 
    data: analyticsData,
    isLoading: analyticsLoading
  } = useAnalytics();

  const { 
    reports,
    generatingReport,
    loading: reportsLoading,
    generateReport
  } = useHeroReports(
    achievements.filter(a => a.earned).length,
    analyticsData?.analyticsSummary.totalQuests || 0,
    analyticsData?.analyticsSummary.avgScore || 0,
    analyticsData?.analyticsSummary.completionRate || 0,
    analyticsData?.categoryData || [],
    analyticsData?.performanceData || []
  );

  if (achievementsLoading || analyticsLoading || reportsLoading) {
    return <LoadingSpinner size="lg" text="Loading your chronicle..." />;
  }

  if (!analyticsData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <ErrorBoundary>
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-500" />
                Quest Chronicle
              </CardTitle>
            </CardHeader>
          </Card>

          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="report" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Hero Report
              </TabsTrigger>
            </TabsList>

            <ErrorBoundary>
              <TabsContent value="timeline" className="mt-6">
                <TimelineTab 
                  loading={analyticsLoading} 
                  analyticsData={analyticsData.analyticsData} 
                />
              </TabsContent>

              <TabsContent value="achievements">
                <AchievementsTab 
                  achievements={achievements} 
                  loading={achievementsLoading}
                />
              </TabsContent>

              <TabsContent value="analytics">
                <AnalyticsTab 
                  loading={analyticsLoading}
                  analyticsSummary={analyticsData.analyticsSummary}
                  performanceData={analyticsData.performanceData}
                  categoryData={analyticsData.categoryData}
                />
              </TabsContent>

              <TabsContent value="report">
                <ReportTab 
                  loading={reportsLoading}
                  reports={reports}
                  generatingReport={generatingReport}
                  onGenerateReport={generateReport}
                />
              </TabsContent>
            </ErrorBoundary>
          </Tabs>
        </ErrorBoundary>
      </div>
      <FloatingNav />
    </div>
  );
};

export default QuestChronicle;
