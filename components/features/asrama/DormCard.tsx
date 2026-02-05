'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Users } from 'lucide-react';
import type { Dormitory } from './AsramaGallerySection';

export interface DormCardProps {
  dormitory: Dormitory;
  index?: number;
}

export function DormCard({ dormitory, index = 0 }: DormCardProps) {
  const occupied = dormitory.occupied_rooms || 0;
  const total = dormitory.total_rooms || 0;
  const occupancyPercentage = total > 0 ? Math.round((occupied / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={dormitory.image_url || '/placeholder.jpg'}
          alt={dormitory.name || 'Asrama'}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Province Badge */}
        {dormitory.province && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
            {dormitory.province}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Name */}
        <h3 className="font-bold text-lg text-gray-900 mb-2">{dormitory.name}</h3>

        {/* City */}
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4" />
          {dormitory.city}
        </div>

        {/* Description */}
        {dormitory.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{dormitory.description}</p>
        )}

        {/* Occupancy Stats */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>Hunian</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {occupied}/{total} kamar
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-iark-red to-iark-blue rounded-full transition-all duration-500"
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">{occupancyPercentage}% terisi</p>
        </div>
      </div>
    </motion.div>
  );
}
