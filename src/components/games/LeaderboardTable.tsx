
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LeaderboardEntry } from '@/types/shared';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  isLoading: boolean;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries, isLoading }) => {
  // Hardcoded demo entries
  const demoEntries = [
    {
      id: '1',
      user_id: 'demo-1',
      game_type: 'Number Recognition',
      score: 950,
      achieved_at: new Date().toISOString(),
      profiles: { hero_name: 'Dale' }
    },
    {
      id: '2',
      user_id: 'demo-2',
      game_type: 'Addition Adventure',
      score: 875,
      achieved_at: new Date().toISOString(),
      profiles: { hero_name: 'Andrew' }
    },
    {
      id: '3',
      user_id: 'demo-3',
      game_type: 'Number Recognition',
      score: 800,
      achieved_at: new Date().toISOString(),
      profiles: { hero_name: 'Yunaim' }
    }
  ];

  // Use demo entries if no real entries exist
  const displayEntries = entries.length > 0 ? entries : demoEntries;

  return (
    <div className="rounded-lg overflow-hidden border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Rank</TableHead>
            <TableHead>Hero Name</TableHead>
            <TableHead>Game</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                Loading leaderboard...
              </TableCell>
            </TableRow>
          ) : (
            displayEntries.map((entry, index) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">
                  {index + 1}
                  {index === 0 && <span className="ml-1">👑</span>}
                </TableCell>
                <TableCell>{entry.profiles?.hero_name || 'Unknown Hero'}</TableCell>
                <TableCell>{entry.game_type}</TableCell>
                <TableCell className="text-right">{entry.score}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;
