'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

export interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className = '' }: HeroSectionProps) {
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
      <div className="relative z-10 flex flex-col items-center justify-center px-8 py-24 min-h-screen">
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
      </div>

      {/* Floating Photo Cards with better separation and animations */}
      {/* Card 1 - Top Left - Red Background - Further left with float animation */}
      <div className="hidden lg:block absolute top-20 left-4 xl:left-8 w-56 h-64 bg-iark-red rounded-3xl p-3 shadow-2xl transform rotate-[-8deg] hover:rotate-[-4deg] transition-transform duration-300 animate-float">
        <div className="w-full h-full rounded-2xl overflow-hidden relative">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80"
            alt="IARK Team Collaboration"
            fill
            className="object-cover"
            unoptimized
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/50 z-10 pointer-events-none" />
        </div>
      </div>

      {/* Card 2 - Top Right - Blue Background - Further right with delayed float animation */}
      <div className="hidden lg:block absolute top-28 right-4 xl:right-8 w-64 h-72 bg-iark-blue rounded-3xl p-3 shadow-2xl transform rotate-[10deg] hover:rotate-[5deg] transition-transform duration-300 animate-float-delayed">
        <div className="w-full h-full rounded-2xl overflow-hidden relative">
          <Image
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80"
            alt="Leadership Training"
            fill
            className="object-cover"
            unoptimized
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/50 z-10 pointer-events-none" />
        </div>
      </div>

      {/* Card 3 - Bottom Center - Yellow Background - Slow float animation */}
      <div className="hidden lg:block absolute bottom-28 left-16 xl:left-24 w-52 h-60 bg-iark-yellow rounded-3xl p-3 shadow-2xl transform rotate-[-4deg] hover:rotate-[-2deg] transition-transform duration-300 animate-float-slow">
        <div className="w-full h-full rounded-2xl overflow-hidden relative">
          <Image
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80"
            alt="Alumni Network"
            fill
            className="object-cover"
            unoptimized
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/50 z-10 pointer-events-none" />
        </div>
      </div>

      {/* Mobile decorative element - small photo preview */}
      <div className="lg:hidden absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-4">
        <div className="w-20 h-20 bg-iark-red rounded-2xl p-1 shadow-lg">
          <div className="w-full h-full rounded-xl overflow-hidden relative">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&q=80"
              alt="Team"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/50 z-10 pointer-events-none" />
          </div>
        </div>
        <div className="w-20 h-20 bg-iark-blue rounded-2xl p-1 shadow-lg">
          <div className="w-full h-full rounded-xl overflow-hidden relative">
            <Image
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=100&q=80"
              alt="Leadership"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/50 z-10 pointer-events-none" />
          </div>
        </div>
        <div className="w-20 h-20 bg-iark-yellow rounded-2xl p-1 shadow-lg">
          <div className="w-full h-full rounded-xl overflow-hidden relative">
            <Image
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&q=80"
              alt="Network"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/50 z-10 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
