import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Medal, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  game_type: string;
  score: number;
  achieved_at: string;
  profiles: {
    id: string;
    hero_name: string | null;
  } | null;
}

const LeaderboardPanel = ({ gameType }: { gameType: string }) => {
  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ['leaderboard', gameType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard_entries')
        .select(`
          id,
          user_id,
          game_type,
          score,
          achieved_at,
          profiles(id, hero_name)
        `)
        .eq('game_type', gameType)
        .order('score', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as LeaderboardEntry[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-6 w-6 text-yellow-400" />
        <h3 className="text-lg font-bold">Top Explorers</h3>
      </div>
      <div className="space-y-3">
        {leaderboardData?.map((entry, index) => (
          <div
            key={entry.id}
            className="flex items-center gap-3 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
          >
            <div className="flex-shrink-0 w-8">
              {index === 0 && <Trophy className="h-5 w-5 text-yellow-400" />}
              {index === 1 && <Medal className="h-5 w-5 text-gray-400" />}
              {index === 2 && <Medal className="h-5 w-5 text-amber-600" />}
              {index > 2 && <Star className="h-5 w-5 text-primary/40" />}
            </div>
            <div className="flex-grow">
              <span className="font-medium">{entry.profiles?.hero_name || 'Mystery Explorer'}</span>
            </div>
            <div className="text-sm font-semibold text-primary">
              {entry.score} points
            </div>
          </div>
        ))}
        {(!leaderboardData || leaderboardData.length === 0) && (
          <div className="text-center text-muted-foreground py-4">
            No scores yet. Be the first explorer to make it to the leaderboard!
          </div>
        )}
      </div>
    </Card>
  );
};

export default LeaderboardPanel;