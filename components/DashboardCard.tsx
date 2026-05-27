'use client';

import React from 'react';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: string;
  color?: 'blue' | 'emerald' | 'amber' | 'red' | 'indigo' | 'gray';
}

export default function DashboardCard({
  title,
  value,
  subtext,
  icon,
  color = 'blue'
}: DashboardCardProps) {
  const LucideIcon =
    (Icons as unknown as Record<string, LucideIcon>)[icon] ?? Icons.TrendingUp;

  const colorStyles = {
    blue: {
      bg: 'bg-blue-50/50 hover:bg-blue-50 border-blue-100',
      iconBg: 'bg-blue-600 text-white shadow-blue-200',
      valueText: 'text-blue-600',
    },
    emerald: {
      bg: 'bg-emerald-50/50 hover:bg-emerald-50 border-emerald-100',
      iconBg: 'bg-emerald-600 text-white shadow-emerald-200',
      valueText: 'text-emerald-600',
    },
    amber: {
      bg: 'bg-amber-50/50 hover:bg-amber-50 border-amber-100',
      iconBg: 'bg-amber-500 text-white shadow-amber-200',
      valueText: 'text-amber-600',
    },
    red: {
      bg: 'bg-red-50/50 hover:bg-red-50 border-red-100',
      iconBg: 'bg-red-600 text-white shadow-red-200',
      valueText: 'text-red-600',
    },
    indigo: {
      bg: 'bg-indigo-50/50 hover:bg-indigo-50 border-indigo-100',
      iconBg: 'bg-indigo-600 text-white shadow-indigo-200',
      valueText: 'text-indigo-600',
    },
    gray: {
      bg: 'bg-gray-50/50 hover:bg-gray-50 border-gray-150',
      iconBg: 'bg-gray-600 text-white shadow-gray-200',
      valueText: 'text-gray-800',
    }
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div className={cn(
      'bg-white border rounded-2xl p-6 shadow-sm transition-all duration-300 flex items-center justify-between group',
      style.bg
    )}>
      <div className="space-y-2">
        <span className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">
          {title}
        </span>
        <h4 className={cn('text-2xl sm:text-3xl font-extrabold tracking-tight', style.valueText)}>
          {value}
        </h4>
        {subtext && (
          <p className="text-xs text-gray-500 font-semibold">
            {subtext}
          </p>
        )}
      </div>

      <div className={cn(
        'p-3.5 rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110 flex-shrink-0',
        style.iconBg
      )}>
        <LucideIcon className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>
    </div>
  );
}
