
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from 'lucide-react';

interface RecentAdventuresProps {
  recentTopics: { title: string; completed_at: string }[];
}

const RecentAdventures = ({ recentTopics }: RecentAdventuresProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Adventures</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentTopics.map((topic, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
            <div>
              <h4 className="font-medium">{topic.title}</h4>
              <p className="text-sm text-gray-500">
                Completed: {new Date(topic.completed_at).toLocaleDateString()}
              </p>
            </div>
            <Trophy className="h-5 w-5 text-yellow-500" />
          </div>
        ))}
        {recentTopics.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No adventures completed yet. Time to start your quest!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentAdventures;
