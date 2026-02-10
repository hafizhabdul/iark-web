'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { EventWithRegistrationCount } from '@/lib/queries/events';
import { EventLink } from './EventLink';

interface EventCardProps {
  event: EventWithRegistrationCount;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const eventDate = new Date(event.date);
  const now = new Date();
  const isPast = eventDate < now;

  const formattedDate = eventDate.toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = eventDate.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-iark-red/20 flex flex-col h-full">
        {/* Image */}
        <div className="relative w-full aspect-[16/9]">
          {event.image_url ? (
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-iark-red to-iark-blue flex items-center justify-center">
              <Calendar className="w-12 h-12 text-white/50" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-iark-red transition-colors">
            {event.title}
          </h3>

          {/* Price Badge */}
          <div className="mb-3">
            {event.price > 0 ? (
              <span className="inline-block bg-iark-red/10 text-iark-red text-sm font-semibold px-3 py-1 rounded-full">
                Rp {event.price.toLocaleString('id-ID')}
              </span>
            ) : (
              <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                FREE
              </span>
            )}
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Calendar className="w-4 h-4 text-iark-red flex-shrink-0" />
            <span>{formattedDate}</span>
            <Clock className="w-4 h-4 text-iark-red flex-shrink-0 ml-2" />
            <span>{formattedTime} WIB</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4 text-iark-red flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
            {event.description}
          </p>

          {/* Detail Button */}
          <EventLink 
            path={`/${event.slug}`}
            className="w-full text-center bg-iark-red text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            {isPast ? 'Lihat Detail' : 'Detail'}
          </EventLink>
        </div>
      </div>
    </motion.div>
  );
}
