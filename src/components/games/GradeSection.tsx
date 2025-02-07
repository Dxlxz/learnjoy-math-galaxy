
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GradeSection as GradeSectionType } from '@/types/shared';
import ToolCard from '@/components/tools/ToolCard';

interface GradeSectionProps {
  section: GradeSectionType;
  onToolClick: (tool: any) => void;
}

const GradeSection: React.FC<GradeSectionProps> = ({ section, onToolClick }) => {
  return (
    <Card 
      className={`border-none shadow-lg bg-gradient-to-r ${section.bgColor} hover:shadow-xl transition-all duration-300 animate-fade-in`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-primary-700">
            {section.title}
          </CardTitle>
          <Badge variant="secondary" className="text-sm px-4 py-1 bg-white/80 backdrop-blur-sm font-semibold">
            Grade {section.grade}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {section.tools.map((tool) => (
            <ToolCard
              key={tool.name}
              tool={{
                title: tool.name,
                description: tool.description,
                topic: section.title
              }}
              IconComponent={tool.icon}
              onClick={() => onToolClick(tool)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GradeSection;

