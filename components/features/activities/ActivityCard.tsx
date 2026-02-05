'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Heart, MessageCircle } from 'lucide-react';
import type { Activity } from './PastActivitiesSection';

export interface ActivityCardProps {
  activity: Activity;
  index?: number;
}

export function ActivityCard({ activity, index = 0 }: ActivityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link href={activity.link || '#'}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group">
          <div className="flex flex-col md:flex-row">
            {/* Content */}
            <div className="flex-1 p-6 md:p-8 flex flex-col">
              {/* Category & Author */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold text-iark-red bg-iark-red/10 px-3 py-1 rounded-full">
                  {activity.category}
                </span>
                {activity.author && <span className="text-sm text-gray-500">{activity.author}</span>}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-iark-red transition-colors duration-300 line-clamp-2">
                {activity.title}
              </h3>

              {/* Subtitle */}
              {activity.subtitle && (
                <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                  {activity.subtitle}
                </p>
              )}

              {/* Date & Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {activity.date && <span>{activity.date}</span>}
                {activity.read_time && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {activity.read_time}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {activity.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {activity.comments}
                </span>
              </div>
            </div>

            {/* Image */}
            <div className="relative w-full md:w-48 lg:w-56 h-48 md:h-auto flex-shrink-0 order-first md:order-last">
              <Image
                src={activity.image_url || '/images/placeholder.jpg'}
                alt={activity.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
