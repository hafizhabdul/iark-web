'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
export interface BatchLeader {
  name: string;
  photo: string | null;
  quote: string | null;
  job_title: string | null;
}

export interface LeaderProfileCardProps {
  leader: BatchLeader;
  angkatan: number;
}

export function LeaderProfileCard({ leader, angkatan }: LeaderProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Photo */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0 mx-auto md:mx-0">
          <Image
            src={leader.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(leader.name) + '&background=C41E3A&color=fff'}
            alt={leader.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h4 className="font-bold text-xl text-gray-900 mb-1">{leader.name}</h4>
          <p className="text-sm text-iark-red font-medium mb-1">
            Ketua Angkatan {angkatan}
          </p>
          <p className="text-sm text-gray-500 mb-4">{leader.job_title}</p>

          {/* Quote */}
          <div className="relative">
            <Quote className="absolute -top-2 -left-2 w-8 h-8 text-iark-red/20" />
            <p className="text-gray-600 italic pl-6 leading-relaxed">
              &ldquo;{leader.quote}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
