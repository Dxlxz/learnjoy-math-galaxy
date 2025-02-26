
import React from 'react';
import { Star } from "lucide-react";

export function LoginHeader() {
  return (
    <div className="space-y-2 text-center">
      <div className="flex justify-center">
        <Star className="h-12 w-12 text-primary animate-pulse" />
      </div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
        Welcome Back!
      </h1>
      <p className="text-muted-foreground">
        Continue your mathematical adventure
      </p>
    </div>
  );
}
