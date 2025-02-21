
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
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4 relative overflow-hidden"
      role="main"
      aria-label={`${title} page`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute top-20 -left-10 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-pulse"></div>
        <div className="absolute bottom-20 -right-10 w-96 h-96 bg-secondary-100 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-pulse animation-delay-1000"></div>
      </div>

      {/* Decorative Math Symbols */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden opacity-5">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl font-bold transform rotate-12"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            {['+', '−', '×', '÷', '=', '∑', 'π'][Math.floor(Math.random() * 7)]}
          </div>
        ))}
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-lg border border-primary-100/50 shadow-xl relative z-10 animate-fade-in">
        <CardHeader className="space-y-2 text-center relative pb-8">
          {/* Icon Container */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-white rounded-full blur-xl opacity-50"></div>
            <div className="relative w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-primary-50">
              <Icon className="h-12 w-12 text-primary-600" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-10">
            <CardTitle 
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800"
              role="heading"
              aria-level={1}
            >
              {title}
            </CardTitle>
            <CardDescription className="text-lg text-primary-600/80 mt-2 font-medium">
              {description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="relative px-8 pb-8">
          {/* Decorative Elements */}
          <div className="absolute -left-3 top-1/2 w-6 h-6 bg-gradient-to-br from-primary-100 to-white rounded-full transform -translate-y-1/2 animate-pulse"></div>
          <div className="absolute -right-3 top-1/2 w-6 h-6 bg-gradient-to-br from-primary-100 to-white rounded-full transform -translate-y-1/2 animate-pulse animation-delay-500"></div>
          
          {children}
        </CardContent>
      </Card>

      {/* Bottom Decorative Elements */}
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/10 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default AuthCard;
