'use client';

import React from 'react';
import { Inbox, Search } from 'lucide-react';
import { cn } from '../lib/utils';

interface EmptyStateProps {
  title?: string;
  description?: string;
  type?: 'box' | 'search';
  className?: string;
}

export default function EmptyState({
  title = 'Không có dữ liệu',
  description = 'Hiện chưa có bản ghi nào được lưu trong hệ thống.',
  type = 'box',
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      'bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 text-center max-w-md mx-auto space-y-4 flex flex-col items-center justify-center shadow-sm',
      className
    )}>
      <div className="bg-gray-50 text-gray-400 p-4 rounded-full border border-gray-100 shadow-inner">
        {type === 'search' ? (
          <Search className="h-8 w-8 text-blue-500 animate-pulse" />
        ) : (
          <Inbox className="h-8 w-8 text-gray-400" />
        )}
      </div>

      <div className="space-y-1">
        <h3 className="font-extrabold text-gray-800 text-base sm:text-lg">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
