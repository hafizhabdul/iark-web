'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export interface Alumni {
  id: string;
  name: string;
  email: string;
  batch: string;
  field: string;
  location: string;
  avatar?: string;
  bio?: string;
  currentRole?: string;
  company?: string;
  skills?: string[];
  linkedin?: string;
  programs?: string[];
  experience?: {
    title: string;
    company: string;
    period: string;
  }[];
  education?: {
    degree: string;
    institution: string;
    year: string;
  }[];
}

export interface AlumniCardProps {
  alumni: Alumni;
  onClick?: () => void;
}

export function AlumniCard({ alumni, onClick }: AlumniCardProps) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer border border-gray-200 hover:border-iark-red transition-colors"
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <div className="p-6">
        {/* Avatar & Name */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
            {alumni.avatar ? (
              <Image src={alumni.avatar} alt={alumni.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-iark-red flex items-center justify-center text-white font-bold text-xl">
                {alumni.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 truncate">{alumni.name}</h3>
            <p className="text-sm text-gray-600 truncate">{alumni.email}</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-gray-700">Angkatan {alumni.batch}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-700">{alumni.field}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-gray-700">{alumni.location}</span>
          </div>
        </div>
      </div>

      {/* View Profile CTA */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-iark-red font-semibold">View Profile</span>
          <svg className="w-4 h-4 text-iark-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
