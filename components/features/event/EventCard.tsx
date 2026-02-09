'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react';
import { EventWithRegistrationCount } from '@/lib/queries/events';

interface EventCardProps {
  event: EventWithRegistrationCount;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const eventDate = new Date(event.date);
  const now = new Date();
  const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isPast = daysUntil < 0;
  const isFull = event.max_participants !== null && event.registration_count >= event.max_participants;

  const formattedDate = eventDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
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
      <Link href={`/event/${event.slug}`}>
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-iark-red/20">
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="relative w-full md:w-72 h-48 md:h-auto flex-shrink-0">
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
              
              {/* Status Badge */}
              {!isPast && (
                <div className="absolute top-3 left-3">
                  {isFull ? (
                    <span className="bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Penuh
                    </span>
                  ) : daysUntil <= 3 ? (
                    <span className="bg-iark-red text-white text-xs font-semibold px-3 py-1 rounded-full animate-pulse">
                      {daysUntil === 0 ? 'Hari Ini!' : `${daysUntil} Hari Lagi`}
                    </span>
                  ) : (
                    <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Buka
                    </span>
                  )}
                </div>
              )}

              {/* Event Type Badge */}
              <div className="absolute top-3 right-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  event.event_type === 'online' 
                    ? 'bg-blue-500 text-white' 
                    : event.event_type === 'hybrid'
                    ? 'bg-purple-500 text-white'
                    : 'bg-orange-500 text-white'
                }`}>
                  {event.event_type === 'online' ? 'Online' : event.event_type === 'hybrid' ? 'Hybrid' : 'Offline'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-5">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-iark-red transition-colors line-clamp-2">
                {event.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {event.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-iark-red" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-iark-red" />
                  <span>{formattedTime} WIB</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-iark-red" />
                  <span className="truncate max-w-[150px]">{event.location}</span>
                </div>
                {event.max_participants && (
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-iark-red" />
                    <span>{event.registration_count}/{event.max_participants}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                {/* Price */}
                <div>
                  {event.price > 0 ? (
                    <span className="text-lg font-bold text-iark-red">
                      Rp {event.price.toLocaleString('id-ID')}
                    </span>
                  ) : (
                    <span className="text-lg font-bold text-green-600">Gratis</span>
                  )}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-iark-red font-semibold group-hover:gap-3 transition-all">
                  <span>{isPast ? 'Lihat Detail' : 'Daftar'}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
