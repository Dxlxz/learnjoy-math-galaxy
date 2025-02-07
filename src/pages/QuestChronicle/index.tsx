
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, BarChart, Star, Calendar } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import FloatingNav from '@/components/navigation/FloatingNav';
import { Json } from '@/integrations/supabase/types';
import { Achievement, AnalyticsSummary, HeroReport, ReportData } from './types';
import { TimelineTab } from './components/TimelineTab';
import { AchievementsTab } from './components/AchievementsTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { ReportTab } from './components/ReportTab';

const QuestChronicle = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [analyticsData, setAnalyticsData] = React.useState<any[]>([]);
  const [achievements, setAchievements] = React.useState<Achievement[]>([]);
  const [analyticsSummary, setAnalyticsSummary] = React.useState<AnalyticsSummary>({
    totalQuests: 0,
    avgScore: 0,
    timeSpent: 0,
    completionRate: 0
  });
  const [categoryData, setCategoryData] = React.useState<any[]>([]);
  const [performanceData, setPerformanceData] = React.useState<any[]>([]);
  const [reports, setReports] = React.useState<HeroReport[]>([]);
  const [generatingReport, setGeneratingReport] = React.useState(false);

  React.useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }

        const { data: allAchievements, error: achievementsError } = await supabase
          .from('achievements')
          .select('*');

        if (achievementsError) throw achievementsError;

        const { data: userAchievements, error: userAchievementsError } = await supabase
          .from('user_achievements')
          .select('achievement_id, earned_at')
          .eq('user_id', session.user.id);

        if (userAchievementsError) throw userAchievementsError;

        const achievementsWithStatus = allAchievements.map((achievement: Achievement) => ({
          ...achievement,
          earned: userAchievements?.some(ua => ua.achievement_id === achievement.id),
          earned_at: userAchievements?.find(ua => ua.achievement_id === achievement.id)?.earned_at
        }));

        setAchievements(achievementsWithStatus);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading achievements",
          description: error instanceof Error ? error.message : "Failed to load achievements",
        });
      }
    };

    const fetchAnalytics = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }

        const { data, error } = await supabase
          .from('analytics_data')
          .select('*')
          .eq('user_id', session.user.id)
          .order('recorded_at', { ascending: false });

        if (error) throw error;

        const transformedData = (data || []).map(item => ({
          date: new Date(item.recorded_at).toLocaleDateString(),
          value: item.metric_value,
          name: item.metric_name,
        }));

        const summary = {
          totalQuests: data?.length || 0,
          avgScore: data?.reduce((acc, curr) => acc + curr.metric_value, 0) / (data?.length || 1),
          timeSpent: data?.reduce((acc, curr) => acc + (curr.metric_name === 'time_spent' ? curr.metric_value : 0), 0),
          completionRate: (data?.filter(d => d.metric_value >= 70).length / (data?.length || 1)) * 100
        };

        const categories = data?.reduce((acc: any, curr) => {
          if (!acc[curr.category]) {
            acc[curr.category] = 0;
          }
          acc[curr.category] += curr.metric_value;
          return acc;
        }, {});

        const categoryChartData = Object.entries(categories || {}).map(([name, value]) => ({
          name,
          value
        }));

        const performanceByPeriod = data?.reduce((acc: any, curr) => {
          const period = new Date(curr.period_start).toLocaleDateString();
          if (!acc[period]) {
            acc[period] = {
              period,
              score: 0,
              count: 0
            };
          }
          acc[period].score += curr.metric_value;
          acc[period].count += 1;
          return acc;
        }, {});

        const performanceChartData = Object.values(performanceByPeriod || {}).map((item: any) => ({
          period: item.period,
          avgScore: item.score / item.count
        }));

        setAnalyticsData(transformedData);
        setAnalyticsSummary(summary);
        setCategoryData(categoryChartData);
        setPerformanceData(performanceChartData);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading analytics",
          description: error instanceof Error ? error.message : "Failed to load your quest data",
        });
      } finally {
        setLoading(false);
      }
    };

    Promise.all([fetchAchievements(), fetchAnalytics()]);
  }, [navigate, toast]);

  const generateHeroReport = async () => {
    try {
      setGeneratingReport(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      const reportData: ReportData = {
        achievements: achievements.filter(a => a.earned).length,
        totalQuests: analyticsSummary.totalQuests,
        averageScore: analyticsSummary.avgScore,
        completionRate: analyticsSummary.completionRate,
        strengths: categoryData
          .sort((a, b) => b.value - a.value)
          .slice(0, 3)
          .map(c => c.name),
        areasForImprovement: categoryData
          .sort((a, b) => a.value - b.value)
          .slice(0, 3)
          .map(c => c.name),
        recentProgress: performanceData.slice(-5).map(p => ({
          date: p.period,
          score: p.avgScore
        }))
      };

      const { data: report, error: insertError } = await supabase
        .from('hero_reports')
        .insert({
          user_id: session.user.id,
          report_type: 'comprehensive',
          report_data: reportData as unknown as Json
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const { data: allReports, error: fetchError } = await supabase
        .from('hero_reports')
        .select('*')
        .eq('user_id', session.user.id)
        .order('generated_at', { ascending: false });

      if (fetchError) throw fetchError;

      const typedReports = (allReports as any[]).map(report => ({
        ...report,
        report_data: report.report_data as ReportData
      }));

      setReports(typedReports);
      
      toast({
        title: "Hero Report Generated!",
        description: "Your latest achievement report is ready to view.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error generating report",
        description: error instanceof Error ? error.message : "Failed to generate hero report",
      });
    } finally {
      setGeneratingReport(false);
    }
  };

  React.useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }

        const { data, error } = await supabase
          .from('hero_reports')
          .select('*')
          .eq('user_id', session.user.id)
          .order('generated_at', { ascending: false });

        if (error) throw error;

        const typedReports = (data as any[]).map(report => ({
          ...report,
          report_data: report.report_data as ReportData
        }));

        setReports(typedReports);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading reports",
          description: error instanceof Error ? error.message : "Failed to load hero reports",
        });
      }
    };

    fetchReports();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
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

          <TabsContent value="timeline" className="mt-6">
            <TimelineTab loading={loading} analyticsData={analyticsData} />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsTab achievements={achievements} loading={loading} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab 
              loading={loading}
              analyticsSummary={analyticsSummary}
              performanceData={performanceData}
              categoryData={categoryData}
            />
          </TabsContent>

          <TabsContent value="report">
            <ReportTab 
              loading={loading}
              reports={reports}
              generatingReport={generatingReport}
              onGenerateReport={generateHeroReport}
            />
          </TabsContent>
        </Tabs>
      </div>
      <FloatingNav />
    </div>
  );
};

export default QuestChronicle;
