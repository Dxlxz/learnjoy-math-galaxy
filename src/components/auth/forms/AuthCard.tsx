
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ 
  icon: Icon,
  title, 
  description, 
  children 
}) => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-[url('/placeholder.svg')] bg-cover bg-center p-4"
      role="main"
      aria-label={`${title} page`}
    >
      <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/90">
        <CardHeader className="space-y-2 text-center">
          <CardTitle 
            className="text-3xl font-bold text-primary flex items-center justify-center gap-2"
            role="heading"
            aria-level={1}
          >
            <Icon className="h-6 w-6" aria-hidden="true" />
            {title}
          </CardTitle>
          <CardDescription className="text-lg">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCard;
