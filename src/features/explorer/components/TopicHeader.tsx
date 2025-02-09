import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock, CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react';
import { CollapsibleTrigger } from "@/components/ui/collapsible";

interface TopicHeaderProps {
  title: string;
  isExpanded: boolean;
  prerequisites_met: boolean;
  isCompleted: boolean;
}

const TopicHeader: React.FC<TopicHeaderProps> = ({
  title,
  isExpanded,
  prerequisites_met,
  isCompleted
}) => {
  return (
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-2">
        {!prerequisites_met && <Lock className="h-4 w-4 text-gray-400" />}
        {isCompleted && <CheckCircle2 className="h-4 w-4 text-green-500" />}
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="p-1">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
    </div>
  );
};

export default TopicHeader;
