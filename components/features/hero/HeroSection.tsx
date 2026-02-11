'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { EventCarousel, type HeroSlide } from './EventCarousel';

export interface HeroSectionProps {
  className?: string;
  initialData?: HeroSlide[];
}

export function HeroSection({ className = '', initialData }: HeroSectionProps) {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <section className={`relative min-h-screen bg-white overflow-hidden ${className}`}>

      {/* Subtle gradient orbs background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-iark-red/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl" />

      {/* Decorative small elements with animations */}
      <div className="absolute top-32 right-1/4 w-12 h-12 bg-iark-red rounded-full opacity-20 animate-pulse-slow" />
      <div className="absolute top-1/3 left-20 w-8 h-8 bg-iark-blue rounded-full opacity-20 animate-drift" />
      <div className="absolute bottom-1/3 right-20 w-10 h-10 bg-iark-yellow rounded-full opacity-30 animate-pulse-slow" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-8 pt-24 pb-16 min-h-screen">
        {/* Decorative icon with animation */}
        <div className="mb-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-iark-red/20 rounded-lg rotate-12 animate-pulse-slow" />
          <div className="w-6 h-6 bg-iark-blue/20 rounded-full animate-drift" />
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center text-gray-900 mb-6 max-w-5xl leading-tight"
          style={{
            textShadow: '2px 2px 0 white, -2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 0 2px 0 white, 0 -2px 0 white, 2px 0 0 white, -2px 0 0 white'
          }}>
          Menginspirasi Kepemimpinan
          <br />
          <span className="text-iark-red">Berintegritas</span> untuk
          <br />
          Indonesia
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-center text-gray-600 mb-10 max-w-2xl">
          Wadah kolaborasi alumni Rumah Kepemimpinan yang menumbuhkan
          semangat kepemimpinan sejati dan berdampak nyata
        </p>

        {/* CTA Button */}
        <Link href="/masuk">
          <motion.div
            className="bg-iark-red text-white font-bold px-8 py-4 rounded-full text-lg shadow-lg flex items-center gap-2 cursor-pointer relative overflow-hidden"
            onHoverStart={() => setIsButtonHovered(true)}
            onHoverEnd={() => setIsButtonHovered(false)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Background shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: isButtonHovered ? '100%' : '-100%' }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
            />

            <span className="relative z-10">Bergabung Sekarang</span>
            <motion.svg
              className="w-5 h-5 relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: isButtonHovered ? 5 : 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </motion.svg>
          </motion.div>
        </Link>

        {/* Event Carousel */}
        <div className="mt-16 w-full">
          <EventCarousel initialData={initialData} />
        </div>
      </div>
    </section>
  );
}
