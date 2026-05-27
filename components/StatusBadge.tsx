'use client';

import React from 'react';
import { AppointmentStatus } from '../lib/types';
import { cn } from '../lib/utils';
import { AlertCircle, CheckCircle2, Clock, PlayCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: AppointmentStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: 'Chờ xử lý',
      bgClass: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Clock
    },
    confirmed: {
      label: 'Đã xác nhận',
      bgClass: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: CheckCircle2
    },
    in_progress: {
      label: 'Đang xử lý',
      bgClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: PlayCircle
    },
    completed: {
      label: 'Hoàn thành',
      bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2
    },
    cancelled: {
      label: 'Đã hủy',
      bgClass: 'bg-red-50 text-red-700 border-red-200',
      icon: XCircle
    }
  };

  const config = statusConfig[status] || {
    label: 'Không xác định',
    bgClass: 'bg-gray-50 text-gray-700 border-gray-200',
    icon: AlertCircle
  };

  const IconComponent = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold border leading-none tracking-wide select-none',
        config.bgClass
      )}
    >
      <IconComponent className="h-3.5 w-3.5 flex-shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}
