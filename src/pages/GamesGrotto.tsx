
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Gamepad, Trophy } from 'lucide-react';
import FloatingNav from '@/components/navigation/FloatingNav';
import { supabase } from "@/integrations/supabase/client";
import { gradeTools } from '@/config/gradeTools';
import GradeSection from '@/components/games/GradeSection';
import LeaderboardTable from '@/components/games/LeaderboardTable';
import type { LeaderboardEntry } from '@/types/shared';

const GamesGrotto = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data: leaderboardData, error } = await supabase
        .from('leaderboard_entries')
        .select(`
          id,
          user_id,
          game_type,
          score,
          achieved_at,
          profiles!inner (
            hero_name
          )
        `)
        .order('score', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // Transform the data to match LeaderboardEntry type
      const transformedData: LeaderboardEntry[] = (leaderboardData || []).map(entry => ({
        id: entry.id,
        user_id: entry.user_id,
        game_type: entry.game_type,
        score: entry.score,
        achieved_at: entry.achieved_at,
        profiles: {
          hero_name: entry.profiles?.hero_name || 'Unknown Hero'
        }
      }));
      
      setLeaderboardEntries(transformedData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast({
        title: "Error",
        description: "Failed to load leaderboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToolClick = (tool: any) => {
    if (tool.comingSoon) {
      toast({
        title: "Coming Soon!",
        description: `${tool.name} is currently under development. Check back soon!`,
      });
    } else if (tool.route) {
      navigate(tool.route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FEF7CD] to-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            className="gap-2 hover:bg-primary-100 transition-all duration-300"
            onClick={() => navigate('/hero-profile')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Button>
        </div>

        {/* Main Title */}
        <Card className="border-2 border-primary/20 bg-white/95 backdrop-blur-sm shadow-lg transform hover:scale-[1.01] transition-all duration-300">
          <CardHeader className="text-center p-8">
            <CardTitle className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 text-transparent bg-clip-text flex items-center justify-center gap-4">
              <Gamepad className="h-12 w-12 text-primary animate-bounce" />
              The Games Grotto
            </CardTitle>
            <p className="text-lg text-muted-foreground mt-4">
              Welcome to your magical learning playground! Choose your grade level and start exploring interactive math tools.
            </p>
          </CardHeader>
        </Card>

        {/* Leaderboard Section */}
        <Card className="border-2 border-primary/20 bg-white/95 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-primary-700 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Top Explorers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LeaderboardTable entries={leaderboardEntries} isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* Grade Sections */}
        <div className="grid gap-8">
          {gradeTools.map((section, index) => (
            <GradeSection
              key={section.grade}
              section={section}
              onToolClick={handleToolClick}
            />
          ))}
        </div>
      </div>
      <FloatingNav />
    </div>
  );
};

export default GamesGrotto;
