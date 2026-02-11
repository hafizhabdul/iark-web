'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Instagram, Linkedin } from 'lucide-react';
import type { ManagementMember } from './ManagementGrid';

export interface ManagementCardProps {
  member: ManagementMember;
  index?: number;
}

export function ManagementCard({ member, index = 0 }: ManagementCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Photo Container */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={member.photo || '/images/placeholder-avatar.png'}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          unoptimized
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Hover Overlay with Social Icons */}
        <div className="absolute inset-0 bg-iark-red/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          {member.instagram && (
            <a
              href={member.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-iark-red hover:scale-110 transition-transform duration-200"
              aria-label={`${member.name} Instagram`}
            >
              <Instagram className="w-6 h-6" />
            </a>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-iark-blue hover:scale-110 transition-transform duration-200"
              aria-label={`${member.name} LinkedIn`}
            >
              <Linkedin className="w-6 h-6" />
            </a>
          )}
        </div>

        {/* Info at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-bold text-lg mb-1 drop-shadow-md">{member.name}</h3>
          <p className="text-sm text-white/90 drop-shadow-md">{member.position}</p>
          {member.angkatan && (
            <p className="text-xs text-iark-yellow font-medium mt-1 drop-shadow-md">
              {member.angkatan}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
