import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, BarChart, Star, Calendar } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import FloatingNav from '@/components/navigation/FloatingNav';

const QuestChronicle = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [analyticsData, setAnalyticsData] = React.useState<any[]>([]);

  React.useEffect(() => {
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

        setAnalyticsData(data || []);
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

    fetchAnalytics();
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
                      {/* Timeline placeholder - to be implemented */}
                      <p className="text-center text-muted-foreground">
                        Your adventure timeline will appear here soon!
                      </p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Achievement cards placeholder - to be implemented */}
                  <p className="text-center text-muted-foreground col-span-full">
                    Your achievements will be displayed here soon!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Progress Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Analytics charts placeholder - to be implemented */}
                <p className="text-center text-muted-foreground">
                  Detailed analytics coming soon!
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="report">
            <Card>
              <CardHeader>
                <CardTitle>Hero Report</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Report generator placeholder - to be implemented */}
                <p className="text-center text-muted-foreground">
                  Your hero report will be available here soon!
                </p>
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
