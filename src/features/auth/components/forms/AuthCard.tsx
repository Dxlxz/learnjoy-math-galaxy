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
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white p-4 relative overflow-hidden"
      role="main"
      aria-label={`${title} page`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-4000"></div>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/90 border-2 border-primary-100 shadow-xl relative z-10 animate-fade-in">
        <CardHeader className="space-y-2 text-center relative">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center">
            <Icon className="h-10 w-10 text-primary-600" aria-hidden="true" />
          </div>
          <div className="mt-8">
            <CardTitle 
              className="text-3xl font-bold text-primary-600"
              role="heading"
              aria-level={1}
            >
              {title}
            </CardTitle>
            <CardDescription className="text-lg text-primary-500/80 mt-2">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="relative">
          {/* Decorative Elements */}
          <div className="absolute -left-3 top-1/2 w-6 h-6 bg-primary-100 rounded-full transform -translate-y-1/2"></div>
          <div className="absolute -right-3 top-1/2 w-6 h-6 bg-primary-100 rounded-full transform -translate-y-1/2"></div>
          {children}
        </CardContent>
      </Card>

      {/* Decorative Bottom Elements */}
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-contain bg-no-repeat opacity-20 transform -scale-x-100" style={{ backgroundImage: "url('/placeholder.svg')" }}></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-contain bg-no-repeat opacity-20" style={{ backgroundImage: "url('/placeholder.svg')" }}></div>
    </div>
  );
};

export default AuthCard;
