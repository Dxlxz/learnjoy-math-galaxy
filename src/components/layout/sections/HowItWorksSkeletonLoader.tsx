
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const HowItWorksSkeletonLoader = () => {
  return (
    <div className="container mx-auto px-4">
      <Skeleton className="h-8 w-64 mx-auto mb-12" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(4)].map((_, index) => (
          <div 
            key={index}
            className="relative p-6 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-primary-100"
          >
            <Skeleton className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full" />
            <div className="mt-8 space-y-4">
              <Skeleton className="h-6 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6 mx-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorksSkeletonLoader;
