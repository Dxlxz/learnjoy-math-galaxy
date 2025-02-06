
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

type GradeLevel = 'K1' | 'K2' | 'G1' | 'G2' | 'G3' | 'G4' | 'G5';

interface GradeSelectorProps {
  value: GradeLevel;
  onChange: (value: GradeLevel) => void;
}

export const GradeSelector: React.FC<GradeSelectorProps> = ({ value, onChange }) => {
  return (
    <div>
      <Label htmlFor="grade">Grade Level</Label>
      <Select value={value} onValueChange={(value: GradeLevel) => onChange(value)} required>
        <SelectTrigger className="bg-white/50">
          <SelectValue placeholder="Select your grade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="K1">Kindergarten 1</SelectItem>
          <SelectItem value="K2">Kindergarten 2</SelectItem>
          <SelectItem value="G1">Grade 1</SelectItem>
          <SelectItem value="G2">Grade 2</SelectItem>
          <SelectItem value="G3">Grade 3</SelectItem>
          <SelectItem value="G4">Grade 4</SelectItem>
          <SelectItem value="G5">Grade 5</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
