import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-48 relative overflow-hidden">
      <div>
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="h-5 w-2/3 skeleton-pulse rounded-md" />
          <div className="h-6 w-16 skeleton-pulse rounded-full" />
        </div>
        <div className="space-y-2 mt-2">
          <div className="h-4 w-full skeleton-pulse rounded-md" />
          <div className="h-4 w-5/6 skeleton-pulse rounded-md" />
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 border-t border-slate-100 dark:border-slate-800/40 pt-4">
        <div className="h-4 w-24 skeleton-pulse rounded-md" />
        <div className="flex gap-2">
          <div className="h-8 w-8 skeleton-pulse rounded-lg" />
          <div className="h-8 w-8 skeleton-pulse rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton = () => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/40 flex justify-between">
        <div className="h-5 w-32 skeleton-pulse rounded-md" />
        <div className="h-5 w-24 skeleton-pulse rounded-md" />
        <div className="h-5 w-20 skeleton-pulse rounded-md" />
        <div className="h-5 w-24 skeleton-pulse rounded-md" />
      </div>
      <div className="divide-y divide-slate-150 dark:divide-slate-800/20">
        {[1, 2, 3, 4, 5].map((idx) => (
          <div key={idx} className="p-4 flex justify-between items-center">
            <div className="h-4 w-40 skeleton-pulse rounded-md" />
            <div className="h-5 w-20 skeleton-pulse rounded-full" />
            <div className="h-5 w-16 skeleton-pulse rounded-full" />
            <div className="h-4 w-24 skeleton-pulse rounded-md" />
            <div className="h-8 w-16 skeleton-pulse rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[1, 2, 3, 4].map((idx) => (
        <div key={idx} className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-20 skeleton-pulse rounded-md" />
            <div className="h-8 w-12 skeleton-pulse rounded-md" />
          </div>
          <div className="h-12 w-12 skeleton-pulse rounded-xl" />
        </div>
      ))}
    </div>
  );
};

const SkeletonLoader = ({ type = 'card', count = 6 }) => {
  if (type === 'stats') return <StatsSkeleton />;
  if (type === 'table') return <TableSkeleton />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
