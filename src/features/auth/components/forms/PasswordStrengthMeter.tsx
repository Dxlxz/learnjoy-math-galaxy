import React from 'react';
import { Progress } from "@/components/ui/progress";
import { usePasswordStrength } from '@/shared/hooks/auth/usePasswordStrength';
import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const { score, feedback, color } = usePasswordStrength(password);
  const progressValue = (score / 5) * 100;

  return (
    <div className="space-y-2 mt-2">
      <Progress 
        value={progressValue} 
        className={cn("h-2 transition-all duration-300", color)}
      />
      <p className={cn(
        "text-sm transition-all duration-300",
        password ? "opacity-100" : "opacity-70",
        score <= 2 ? "text-red-500" : 
        score <= 3 ? "text-orange-500" : 
        score <= 4 ? "text-green-500" : 
        "text-green-600"
      )}>
        {password ? feedback : "Enter a password to see strength"}
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;
