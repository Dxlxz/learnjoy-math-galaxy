
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { usePasswordStrength } from '@/hooks/auth/usePasswordStrength';
import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const { score, feedback, color } = usePasswordStrength(password);
  const progressValue = (score / 5) * 100;

  return (
    <div className="space-y-2">
      <Progress 
        value={progressValue} 
        className={cn("h-2", color)}
      />
      <p className="text-sm text-muted-foreground">{feedback}</p>
    </div>
  );
};

export default PasswordStrengthMeter;
