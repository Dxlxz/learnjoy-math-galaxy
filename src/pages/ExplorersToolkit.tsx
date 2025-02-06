
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calculator,
  Shapes,
  Plus,
  Minus,
  Ruler,
  Book,
  CircleDot,
  Binary,
  GripHorizontal,
  Sparkles,
} from 'lucide-react';
import ToolCard from '@/components/tools/ToolCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MathTool {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  grade: string;
  topic: string;
  tool_type: string;
  settings: Record<string, any>;
  metadata: Record<string, any>;
}

const getIconComponent = (iconName: string) => {
  const icons: Record<string, React.ComponentType> = {
    'Calculator': Calculator,
    'Shapes': Shapes,
    'Plus': Plus,
    'Minus': Minus,
    'Ruler': Ruler,
    'Book': Book,
    'Numbers': CircleDot,
    'Binary': Binary,
  };
  return icons[iconName] || GripHorizontal;
};

const ExplorersToolkit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedGrade, setSelectedGrade] = React.useState<string>('K1');

  const { data: tools, isLoading } = useQuery({
    queryKey: ['math-tools', selectedGrade],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('math_tools')
        .select('*')
        .eq('grade', selectedGrade)
        .order('topic');

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load math tools. Please try again.",
        });
        throw error;
      }

      return data as MathTool[];
    },
  });

  const handleToolClick = (tool: MathTool) => {
    // For now, we'll just show a toast. In the future, this will open the specific tool
    toast({
      title: `${tool.title}`,
      description: "Tool interface coming soon!",
      icon: <Sparkles className="h-4 w-4" />,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading your toolkit...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary-600">
                Explorer's Toolkit
              </h1>
              <p className="text-gray-600 mt-2">
                Choose your mathematical instruments wisely, brave explorer!
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/hero-profile')}
            >
              Back to Profile
            </Button>
          </div>

          <Tabs defaultValue="K1" className="w-full">
            <TabsList className="grid grid-cols-7 w-full">
              <TabsTrigger value="K1" onClick={() => setSelectedGrade('K1')}>K1</TabsTrigger>
              <TabsTrigger value="K2" onClick={() => setSelectedGrade('K2')}>K2</TabsTrigger>
              <TabsTrigger value="G1" onClick={() => setSelectedGrade('G1')}>G1</TabsTrigger>
              <TabsTrigger value="G2" onClick={() => setSelectedGrade('G2')}>G2</TabsTrigger>
              <TabsTrigger value="G3" onClick={() => setSelectedGrade('G3')}>G3</TabsTrigger>
              <TabsTrigger value="G4" onClick={() => setSelectedGrade('G4')}>G4</TabsTrigger>
              <TabsTrigger value="G5" onClick={() => setSelectedGrade('G5')}>G5</TabsTrigger>
            </TabsList>

            {['K1', 'K2', 'G1', 'G2', 'G3', 'G4', 'G5'].map((grade) => (
              <TabsContent key={grade} value={grade}>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools?.map((tool) => (
                      <ToolCard
                        key={tool.id}
                        tool={tool}
                        IconComponent={getIconComponent(tool.icon_name)}
                        onClick={() => handleToolClick(tool)}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ExplorersToolkit;
