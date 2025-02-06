
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
    bgColor: 'from-[#FEF7CD] to-[#FEC6A1]',
    tools: [
      { name: 'Number Recognition', icon: Hash, description: 'Practice writing and identifying numbers', comingSoon: true },
      { name: 'Shapes Workshop', icon: Shapes, description: 'Learn about basic shapes through fun activities', comingSoon: true }
    ]
  },
  {
    grade: 'K2',
    title: 'Pattern Seeker Tools',
    bgColor: 'from-[#D3E4FD] to-[#E5DEFF]',
    tools: [
      { name: 'Counting Adventure', icon: Calculator, description: 'Interactive counting and grouping games', comingSoon: true },
      { name: 'Pattern Magic', icon: Shapes, description: 'Create and complete exciting patterns', comingSoon: true }
    ]
  },
  {
    grade: 'G1',
    title: 'Number Wizard Tools',
    bgColor: 'from-[#F2FCE2] to-[#FDE1D3]',
    tools: [
      { name: 'Addition Quest', icon: Plus, description: 'Master addition through visual challenges', comingSoon: true },
      { name: 'Subtraction Journey', icon: Minus, description: 'Learn subtraction with interactive tools', comingSoon: true }
    ]
  },
  {
    grade: 'G2',
    title: 'Place Value Explorer',
    bgColor: 'from-[#FFDEE2] to-[#FDE1D3]',
    tools: [
      { name: 'Place Value Lab', icon: Calculator, description: 'Understand hundreds, tens, and ones', comingSoon: true },
      { name: 'Super Calculator', icon: Calculator, description: 'Practice addition and subtraction up to 100', comingSoon: true }
    ]
  },
  {
    grade: 'G3',
    title: 'Operation Master Tools',
    bgColor: 'from-[#E5DEFF] to-[#D3E4FD]',
    tools: [
      { name: 'Multiplication Cave', icon: Calculator, description: 'Learn multiplication through visualization', comingSoon: true },
      { name: 'Division Quest', icon: DivideCircle, description: 'Master division with interactive challenges', comingSoon: true }
    ]
  },
  {
    grade: 'G4',
    title: 'Advanced Explorer Tools',
    bgColor: 'from-[#FEF7CD] to-[#FEC6A1]',
    tools: [
      { name: 'Fraction Factory', icon: Calculator, description: 'Explore fractions and decimals', comingSoon: true },
      { name: 'Measurement Lab', icon: Ruler, description: 'Learn about different measurements', comingSoon: true }
    ]
  },
  {
    grade: 'G5',
    title: 'Master Mathematician Tools',
    bgColor: 'from-[#F2FCE2] to-[#FDE1D3]',
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

        {/* Grade Sections */}
        <div className="grid gap-8">
          {gradeTools.map((grade, index) => (
            <Card 
              key={grade.grade}
              className={`border-none shadow-lg bg-gradient-to-r ${grade.bgColor} hover:shadow-xl transition-all duration-300 animate-fade-in`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-primary-700">
                    {grade.title}
                  </CardTitle>
                  <Badge variant="secondary" className="text-sm px-4 py-1 bg-white/80 backdrop-blur-sm font-semibold">
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
                      className="h-auto p-6 text-left flex items-start gap-4 bg-white/80 backdrop-blur-sm border-2 hover:bg-white hover:border-primary/30 transition-all duration-300 group"
                      onClick={() => handleToolClick(tool.name)}
                    >
                      <tool.icon className="h-8 w-8 text-primary-600 shrink-0 mt-1 group-hover:scale-110 transition-transform duration-200" />
                      <div className="flex flex-col gap-2">
                        <span className="font-bold text-lg text-primary-700">{tool.name}</span>
                        <span className="text-sm text-muted-foreground">{tool.description}</span>
                        {tool.comingSoon && (
                          <Badge 
                            variant="secondary" 
                            className="w-fit mt-1 animate-pulse bg-primary-100 text-primary-700"
                          >
                            Coming Soon
                          </Badge>
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
