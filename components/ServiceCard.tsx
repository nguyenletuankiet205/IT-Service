'use client';

import React from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Service } from '../lib/types';
import { formatPrice } from '../lib/utils';
import { Clock, Tag, ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  // Dynamically map icon string name from database to Lucide icons
  const LucideIcon =
    (Icons as unknown as Record<string, LucideIcon>)[service.icon] ?? Icons.HelpCircle;

  return (
    <div className="bg-white rounded-2xl border border-gray-150 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col h-full group overflow-hidden">
      
      {/* Upper Color accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      
      <div className="p-6 sm:p-8 flex flex-col flex-grow space-y-4 sm:space-y-5">
        
        {/* Icon & Category */}
        <div className="flex justify-between items-start">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner">
            <LucideIcon className="h-6 w-6" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full">
            {service.category === 'computer' && 'Máy tính'}
            {service.category === 'camera' && 'Giám sát'}
            {service.category === 'network' && 'Hệ thống Mạng'}
            {service.category === 'website' && 'Phần mềm / Web'}
            {service.category === 'cloud' && 'Điện toán Cloud'}
            {service.category === 'maintenance' && 'Bảo trì Outsource'}
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2 flex-grow">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
            {service.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Metadata: Price & Duration */}
        <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center space-x-1.5">
            <Tag className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-semibold leading-none uppercase">Giá tham khảo</span>
              <span className="font-bold text-gray-800 pt-0.5">
                {service.price_min === service.price_max
                  ? formatPrice(service.price_min)
                  : `${formatPrice(service.price_min)} - ${formatPrice(service.price_max)}`}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1.5">
            <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-semibold leading-none uppercase">Thời gian</span>
              <span className="font-bold text-gray-800 pt-0.5">{service.duration}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            href={`/booking?service=${service.slug}`}
            className="w-full inline-flex items-center justify-center bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all group-hover:shadow-md group-hover:shadow-blue-100"
          >
            <span>Đặt lịch hẹn ngay</span>
            <ArrowRight className="ml-1.5 h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
