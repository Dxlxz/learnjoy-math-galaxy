import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, BarChart, Star, Calendar, Brain, Target, Clock, Zap, Download, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import FloatingNav from '@/components/navigation/FloatingNav';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import TopicMilestone from '@/components/milestones/TopicMilestone';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  earned?: boolean;
  earned_at?: string;
}

interface AnalyticsSummary {
  totalQuests: number;
  avgScore: number;
  timeSpent: number;
  completionRate: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface HeroReport {
  id: string;
  generated_at: string;
  report_type: string;
  report_data: {
    achievements: number;
    totalQuests: number;
    averageScore: number;
    completionRate: number;
    strengths: string[];
    areasForImprovement: string[];
    recentProgress: {
      date: string;
      score: number;
    }[];
  };
}

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

        // Fetch all achievements
        const { data: allAchievements, error: achievementsError } = await supabase
          .from('achievements')
          .select('*');

        if (achievementsError) throw achievementsError;

        // Fetch user's earned achievements
        const { data: userAchievements, error: userAchievementsError } = await supabase
          .from('user_achievements')
          .select('achievement_id, earned_at')
          .eq('user_id', session.user.id);

        if (userAchievementsError) throw userAchievementsError;

        // Combine the data
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

        // Fetch analytics data
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

        // Calculate summary metrics
        const summary = {
          totalQuests: data?.length || 0,
          avgScore: data?.reduce((acc, curr) => acc + curr.metric_value, 0) / (data?.length || 1),
          timeSpent: data?.reduce((acc, curr) => acc + (curr.metric_name === 'time_spent' ? curr.metric_value : 0), 0),
          completionRate: (data?.filter(d => d.metric_value >= 70).length / (data?.length || 1)) * 100
        };

        // Process category data
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

        // Process performance data
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

      // Compile report data from analytics and achievements
      const reportData = {
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

      // Insert the report into the database
      const { data: report, error: insertError } = await supabase
        .from('hero_reports')
        .insert({
          user_id: session.user.id,
          report_type: 'comprehensive',
          report_data: reportData
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Fetch all reports after generating a new one
      const { data: allReports, error: fetchError } = await supabase
        .from('hero_reports')
        .select('*')
        .eq('user_id', session.user.id)
        .order('generated_at', { ascending: false });

      if (fetchError) throw fetchError;

      setReports(allReports);
      
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
        setReports(data);
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
        {/* Header */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              Quest Chronicle
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Main Content */}
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
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Achievement Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {achievements.map((achievement) => (
                        <TopicMilestone
                          key={achievement.id}
                          title={achievement.title}
                          description={achievement.description}
                          iconName={achievement.icon_name}
                          isCompleted={achievement.earned}
                        />
                      ))}
                      {achievements.length === 0 && (
                        <p className="text-center text-muted-foreground col-span-full">
                          Start your journey to unlock achievements!
                        </p>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
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
                      {/* Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">Total Quests</p>
                                <p className="text-2xl font-bold">{analyticsSummary.totalQuests}</p>
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
                                <p className="text-2xl font-bold">{analyticsSummary.avgScore.toFixed(1)}%</p>
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
                                <p className="text-2xl font-bold">{Math.round(analyticsSummary.timeSpent / 60)} mins</p>
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
                                <p className="text-2xl font-bold">{analyticsSummary.completionRate.toFixed(1)}%</p>
                              </div>
                              <Zap className="h-8 w-8 text-primary" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Performance Over Time Chart */}
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

                      {/* Category Distribution */}
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
          </TabsContent>

          <TabsContent value="report">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold">Hero Report</CardTitle>
                <Button 
                  onClick={generateHeroReport} 
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
                        <Card key={report.id} className="p-6">
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
          </TabsContent>
        </Tabs>
      </div>
      <FloatingNav />
    </div>
  );
};

export default QuestChronicle;
