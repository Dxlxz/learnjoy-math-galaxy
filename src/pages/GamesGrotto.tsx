
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Gamepad, Shapes, Hash, Plus, Minus, ArrowLeft, DivideCircle, Calculator, Ruler, Brain } from 'lucide-react';
import FloatingNav from '@/components/navigation/FloatingNav';

const gradeTools = [
  {
    grade: 'K1',
    title: 'Early Explorer Tools',
    tools: [
      { name: 'Number Recognition', icon: Hash, description: 'Practice writing and identifying numbers', comingSoon: true },
      { name: 'Shapes Workshop', icon: Shapes, description: 'Learn about basic shapes through fun activities', comingSoon: true }
    ]
  },
  {
    grade: 'K2',
    title: 'Pattern Seeker Tools',
    tools: [
      { name: 'Counting Adventure', icon: Calculator, description: 'Interactive counting and grouping games', comingSoon: true },
      { name: 'Pattern Magic', icon: Shapes, description: 'Create and complete exciting patterns', comingSoon: true }
    ]
  },
  {
    grade: 'G1',
    title: 'Number Wizard Tools',
    tools: [
      { name: 'Addition Quest', icon: Plus, description: 'Master addition through visual challenges', comingSoon: true },
      { name: 'Subtraction Journey', icon: Minus, description: 'Learn subtraction with interactive tools', comingSoon: true }
    ]
  },
  {
    grade: 'G2',
    title: 'Place Value Explorer',
    tools: [
      { name: 'Place Value Lab', icon: Calculator, description: 'Understand hundreds, tens, and ones', comingSoon: true },
      { name: 'Super Calculator', icon: Calculator, description: 'Practice addition and subtraction up to 100', comingSoon: true }
    ]
  },
  {
    grade: 'G3',
    title: 'Operation Master Tools',
    tools: [
      { name: 'Multiplication Cave', icon: Calculator, description: 'Learn multiplication through visualization', comingSoon: true },
      { name: 'Division Quest', icon: DivideCircle, description: 'Master division with interactive challenges', comingSoon: true }
    ]
  },
  {
    grade: 'G4',
    title: 'Advanced Explorer Tools',
    tools: [
      { name: 'Fraction Factory', icon: Calculator, description: 'Explore fractions and decimals', comingSoon: true },
      { name: 'Measurement Lab', icon: Ruler, description: 'Learn about different measurements', comingSoon: true }
    ]
  },
  {
    grade: 'G5',
    title: 'Master Mathematician Tools',
    tools: [
      { name: 'Problem Solving Arena', icon: Brain, description: 'Tackle complex math problems', comingSoon: true },
      { name: 'Geometry Workshop', icon: Shapes, description: 'Explore advanced geometric concepts', comingSoon: true }
    ]
  }
];

const GamesGrotto = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleToolClick = (toolName: string) => {
    toast({
      title: "Coming Soon!",
      description: `${toolName} is currently under development. Check back soon!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            className="gap-2"
            onClick={() => navigate('/hero-profile')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Button>
        </div>

        {/* Main Title */}
        <Card className="border-2 border-primary/20 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-3">
              <Gamepad className="h-8 w-8 text-primary" />
              The Games Grotto
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            Welcome to your magical learning playground! Choose your grade level and start exploring interactive math tools.
          </CardContent>
        </Card>

        {/* Grade Sections */}
        <div className="grid gap-6">
          {gradeTools.map((grade) => (
            <Card key={grade.grade} className="border-2 border-primary/10 hover:border-primary/20 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-primary">
                    {grade.title}
                  </CardTitle>
                  <Badge variant="secondary" className="text-sm">
                    Grade {grade.grade}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {grade.tools.map((tool) => (
                    <Button
                      key={tool.name}
                      variant="outline"
                      className="h-auto p-4 text-left flex items-start gap-4 hover:bg-primary-50 hover:border-primary/30 transition-all duration-300"
                      onClick={() => handleToolClick(tool.name)}
                    >
                      <tool.icon className="h-6 w-6 text-primary shrink-0 mt-1" />
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold">{tool.name}</span>
                        <span className="text-sm text-muted-foreground">{tool.description}</span>
                        {tool.comingSoon && (
                          <Badge variant="secondary" className="w-fit mt-1">Coming Soon</Badge>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <FloatingNav />
    </div>
  );
};

export default GamesGrotto;
