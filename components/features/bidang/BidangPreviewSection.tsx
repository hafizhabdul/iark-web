'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Heart,
  BookOpen,
  Briefcase,
  Landmark,
  MapPin,
  TrendingUp,
  Lightbulb,
  Users,
  Monitor,
  Megaphone,
  ArrowRight,
  LucideIcon,
} from 'lucide-react';
import { bidangData, BidangPreview } from '@/lib/data/bidangData';

export interface BidangPreviewSectionProps {
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  Heart,
  BookOpen,
  Briefcase,
  Landmark,
  MapPin,
  TrendingUp,
  Lightbulb,
  Users,
  Monitor,
  Megaphone,
};

const colorClasses = {
  red: {
    bg: 'bg-iark-red/10',
    text: 'text-iark-red',
    border: 'border-iark-red/20',
    hoverBorder: 'hover:border-iark-red/50',
  },
  blue: {
    bg: 'bg-iark-blue/10',
    text: 'text-iark-blue',
    border: 'border-iark-blue/20',
    hoverBorder: 'hover:border-iark-blue/50',
  },
  yellow: {
    bg: 'bg-iark-yellow/10',
    text: 'text-iark-yellow',
    border: 'border-iark-yellow/20',
    hoverBorder: 'hover:border-iark-yellow/50',
  },
};

function BidangCard({ bidang, index }: { bidang: BidangPreview; index: number }) {
  const Icon = iconMap[bidang.icon] || Users;
  const colors = colorClasses[bidang.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true }}
      className={`bg-white rounded-xl p-5 border ${colors.border} ${colors.hoverBorder} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 mb-1 truncate">{bidang.shortName}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{bidang.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function BidangPreviewSection({ className = '' }: BidangPreviewSectionProps) {
  return (
    <section className={`relative py-24 px-8 bg-gray-50 overflow-hidden ${className}`}>
      {/* Subtle gradient orbs background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-iark-yellow/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl" />

      {/* Decorative elements */}
      <div className="absolute top-32 left-1/4 w-10 h-10 bg-iark-red rounded-full opacity-20 animate-pulse-slow" />
      <div className="absolute top-1/2 right-16 w-8 h-8 bg-iark-blue rounded-full opacity-20 animate-drift" />
      <div className="absolute bottom-1/3 left-20 w-12 h-12 bg-iark-yellow rounded-full opacity-30 animate-pulse-slow" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Decorative element */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-iark-blue/10 rounded-full flex items-center justify-center animate-pulse-slow">
            <div className="w-6 h-6 bg-iark-blue rounded-full" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-iark-black">
          12 Cluster IARK
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Cluster-cluster yang berdedikasi melayani alumni dan mengembangkan kepemimpinan berintegritas
        </p>

        {/* Bidang Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {bidangData.map((bidang, index) => (
            <BidangCard key={bidang.id} bidang={bidang} index={index} />
          ))}
        </div>

        {/* CTA Link */}
        <div className="text-center">
          <Link
            href="/bidang"
            className="inline-flex items-center gap-2 bg-iark-blue hover:bg-blue-800 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
          >
            Lihat Struktur Lengkap
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
