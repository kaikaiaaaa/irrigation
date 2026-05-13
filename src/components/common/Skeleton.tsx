import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-20 h-3" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <Skeleton className="h-8" />
      <Skeleton className="h-8" />
    </div>
  </div>
);

export const ListSkeleton: React.FC = () => (
  <div className="space-y-4">
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
  </div>
);
