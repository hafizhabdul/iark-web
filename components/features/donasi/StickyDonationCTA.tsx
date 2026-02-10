'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, X } from 'lucide-react';
import { DonasiLink } from './DonasiLink';

export interface StickyDonationCTAProps {
  className?: string;
}

export function StickyDonationCTA({ className = '' }: StickyDonationCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isDismissed) return;

      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Show after scrolling past hero (approx 1 viewport height)
      const showThreshold = viewportHeight * 0.8;

      // Hide when near footer (last 400px of page)
      const hideThreshold = documentHeight - viewportHeight - 400;

      if (scrollY > showThreshold && scrollY < hideThreshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Mobile: Full-width bottom bar */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 shadow-2xl z-50 ${className}`}
          >
            <div className="flex items-center justify-between gap-3 p-4">
              <DonasiLink
                path="/"
                className="flex-1 bg-iark-red hover:bg-red-700 text-white font-bold py-3 px-4 rounded-full text-center flex items-center justify-center gap-2 transition-colors duration-300"
              >
                <Heart className="w-5 h-5" />
                Donasi Sekarang
              </DonasiLink>
              <a
                href="https://wa.me/6281234567890?text=Halo%20IARK,%20saya%20ingin%20bertanya%20tentang%20donasi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors duration-300"
                aria-label="Contact via WhatsApp"
              >
                <MessageCircle className="w-6 h-6" />
              </a>
              <button
                onClick={handleDismiss}
                className="w-10 h-10 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors duration-300"
                aria-label="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Desktop: Floating pill on right */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed bottom-8 right-8 hidden md:flex flex-col gap-3 z-50 ${className}`}
          >
            <button
              onClick={handleDismiss}
              className="self-end w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex items-center justify-center transition-colors duration-300"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex flex-col gap-3">
              <p className="text-sm text-gray-600 font-medium text-center max-w-[180px]">
                Dukung gerakan kepemimpinan berintegritas
              </p>

              <DonasiLink
                path="/"
                className="bg-iark-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full text-center flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg"
              >
                <Heart className="w-5 h-5" />
                Donasi Sekarang
              </DonasiLink>

              <a
                href="https://wa.me/6281234567890?text=Halo%20IARK,%20saya%20ingin%20bertanya%20tentang%20donasi"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-full text-center flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
