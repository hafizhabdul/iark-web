'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
export interface Testimonial {
  id: string;
  name: string;
  title: string;
  angkatan: string | null;
  photo: string | null;
  quote: string;
}

export interface TestimoniSliderProps {
  testimonials: Testimonial[];
  autoPlayInterval?: number;
  itemsPerView?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export function TestimoniSlider({
  testimonials,
  autoPlayInterval = 5000,
  itemsPerView = { mobile: 1, tablet: 2, desktop: 3 },
}: TestimoniSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleItems, setVisibleItems] = useState(itemsPerView.mobile);

  // Handle responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleItems(itemsPerView.desktop);
      } else if (window.innerWidth >= 768) {
        setVisibleItems(itemsPerView.tablet);
      } else {
        setVisibleItems(itemsPerView.mobile);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerView]);

  const maxIndex = Math.max(0, testimonials.length - visibleItems);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlayInterval, isPaused, nextSlide]);

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + visibleItems);

  // If we're near the end, wrap around
  if (visibleTestimonials.length < visibleItems) {
    const remaining = visibleItems - visibleTestimonials.length;
    visibleTestimonials.push(...testimonials.slice(0, remaining));
  }

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slider Container */}
      <div className="relative">
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white hover:bg-gray-50 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-iark-red transition-all duration-300 z-10"
          aria-label="Previous testimonials"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white hover:bg-gray-50 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-iark-red transition-all duration-300 z-10"
          aria-label="Next testimonials"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Cards */}
        <div className="overflow-hidden px-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {visibleTestimonials.map((testimonial, idx) => (
                <div
                  key={`${testimonial.id}-${idx}`}
                  className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
                >
                  {/* Quote Icon */}
                  <Quote className="w-10 h-10 text-iark-red/20 mb-4" />

                  {/* Quote Text */}
                  <p className="text-gray-700 leading-relaxed mb-6 flex-grow italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Person Info */}
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                    {/* Photo */}
                    <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={testimonial.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=C41E3A&color=fff`}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Name & Title */}
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        {testimonial.title}
                      </p>
                      <p className="text-sm text-iark-red font-medium">
                        {testimonial.angkatan}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-iark-red w-8'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
