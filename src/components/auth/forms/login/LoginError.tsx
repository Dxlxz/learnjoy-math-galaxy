
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginErrorProps {
  error: string | null;
}

export function LoginError({ error }: LoginErrorProps) {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="animate-in fade-in-50">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
