
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ToolCardProps {
  tool: {
    title: string;
    description: string;
    topic: string;
    comingSoon?: boolean;
    route?: string;
  };
  IconComponent: LucideIcon;
  onClick: () => void;
}

const ToolCard = ({ tool, IconComponent, onClick }: ToolCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleToolClick = () => {
    if (tool.comingSoon) {
      toast({
        title: "Coming Soon!",
        description: `${tool.title} is currently under development. Check back soon!`,
      });
    } else if (tool.route) {
      navigate(tool.route);
    } else {
      onClick();
    }
  };

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
          onClick={handleToolClick}
          className="mt-4 w-full"
        >
          {tool.comingSoon ? 'Coming Soon' : 'Open Tool'}
        </Button>
      </div>
    </Card>
  );
};

export default ToolCard;

