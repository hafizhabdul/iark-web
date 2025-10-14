'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  imageUrl: string;
  isLive: boolean;
  capacity: number;
  registered: number;
  organizer: string;
}

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const spotsLeft = event.capacity - event.registered;
  const isAlmostFull = spotsLeft <= 10;

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer border border-gray-200 hover:border-iark-red transition-colors"
      whileHover={{ y: -4 }}
      onClick={onClick}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <div className="flex flex-col md:flex-row">
        {/* Event Image */}
        <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0 bg-gray-200">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-iark-red to-iark-blue flex items-center justify-center">
              <Calendar size={48} className="text-white" />
            </div>
          )}

          {/* Live Badge */}
          {event.isLive && (
            <div className="absolute top-3 left-3 bg-iark-red text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              LIVE
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
            {event.category}
          </div>
        </div>

        {/* Event Details */}
        <div className="flex-1 p-6">
          <div className="flex flex-col h-full">
            {/* Title & Description */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {event.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                {event.description}
              </p>
            </div>

            {/* Event Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar size={16} className="text-iark-red flex-shrink-0" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock size={16} className="text-iark-red flex-shrink-0" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <MapPin size={16} className="text-iark-red flex-shrink-0" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Users size={16} className="text-iark-red flex-shrink-0" />
                <span>
                  {event.registered} / {event.capacity} terdaftar
                  {isAlmostFull && (
                    <span className="ml-2 text-iark-red font-semibold">
                      • Hampir penuh!
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-auto">
              <motion.button
                className="w-full md:w-auto px-6 py-2.5 bg-iark-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle registration
                }}
              >
                Daftar Sekarang
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
