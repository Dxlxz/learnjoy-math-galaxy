import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  tool: {
    title: string;
    description: string;
    topic: string;
  };
  IconComponent: LucideIcon;
  onClick: () => void;
}

const ToolCard = ({ tool, IconComponent, onClick }: ToolCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary-100">
            <IconComponent className="h-6 w-6 text-primary-600" />
          </div>
          <h3 className="font-semibold text-lg">{tool.title}</h3>
        </div>
        
        <div className="space-y-3 flex-grow">
          <p className="text-gray-600">{tool.description}</p>
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            {tool.topic}
          </div>
        </div>

        <Button 
          onClick={onClick}
          className="mt-4 w-full"
        >
          Open Tool
        </Button>
      </div>
    </Card>
  );
};

export default ToolCard;
