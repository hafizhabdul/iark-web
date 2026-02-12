'use client';

import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

export interface FunFactCardProps {
  funFact: string;
  angkatan: number;
  year: string;
}

export function FunFactCard({ funFact, angkatan, year }: FunFactCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-iark-yellow/10 to-iark-yellow/5 rounded-2xl p-4 md:p-8 border border-iark-yellow/20"
    >
      <div className="flex items-start gap-3 md:gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-iark-yellow rounded-xl flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-iark-black" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-iark-yellow bg-iark-yellow/20 px-3 py-1 rounded-full">
              Fun Fact
            </span>
            <span className="text-sm text-gray-500">
              Angkatan {angkatan} ({year})
            </span>
          </div>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">{funFact}</p>
        </div>
      </div>
    </motion.div>
  );
}
