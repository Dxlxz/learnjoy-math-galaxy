
import { Gamepad, Shapes, Hash, Plus, Minus, ArrowLeft, DivideCircle, Calculator, Ruler, Brain } from 'lucide-react';
import type { Tool, GradeSection } from '@/types/shared';

export const gradeTools: GradeSection[] = [
  {
    grade: 'G3',
    title: 'Operation Master Tools',
    bgColor: 'from-[#E5DEFF] to-[#D3E4FD]',
    tools: [
      { 
        name: 'Number Recognition', 
        icon: Hash, 
        description: 'Practice writing and identifying numbers', 
        comingSoon: false,
        route: '/explorers-toolkit/number-recognition'
      },
      { 
        name: 'Multiplication Cave', 
        icon: Calculator, 
        description: 'Learn multiplication through visualization', 
        comingSoon: true 
      },
      { 
        name: 'Division Quest', 
        icon: DivideCircle, 
        description: 'Master division with interactive challenges', 
        comingSoon: true 
      }
    ]
  },
  {
    grade: 'K1',
    title: 'Early Explorer Tools',
    bgColor: 'from-[#FEF7CD] to-[#FEC6A1]',
    tools: [
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
    grade: 'G4',
    title: 'Advanced Explorer Tools',
    bgColor: 'from-[#FEF7CD] to-[#FEC6A1]',
    tools: [
      { name: 'Fraction Factory', icon: Calculator, description: 'Explore fractions and decimals', comingSoon: true },
      { name: 'Measurement Lab', icon: Ruler, description: 'Learn about measurements', comingSoon: true }
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

