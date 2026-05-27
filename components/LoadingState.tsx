'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export default function LoadingState({
  message = 'Đang tải dữ liệu từ hệ thống...',
  className
}: LoadingStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 sm:p-12 space-y-3.5',
      className
    )}>
      <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      <p className="text-xs sm:text-sm text-gray-500 font-semibold uppercase tracking-wider animate-pulse">
        {message}
      </p>
    </div>
  );
}
