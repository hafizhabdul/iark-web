'use client';

import { useState, useEffect } from 'react';
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
  Loader2,
} from 'lucide-react';
import { createPublicClient as createClient } from '@/lib/supabase/public';
import { queryKeys, staleTime } from '@/lib/queries';
import { useQuery } from '@tanstack/react-query';
import { Cluster } from '@/lib/queries/homepage';

export interface BidangPreviewSectionProps {
  className?: string;
  initialData?: Cluster[];
}

const iconMap: Record<string, LucideIcon | undefined> = {
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

const fetchClusters = async (): Promise<Cluster[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('clusters')
    .select('*')
    .order('order_index');

  if (error) throw error;
  return data || [];
};

function BidangCard({ cluster, index }: { cluster: Cluster; index: number }) {
  const Icon = cluster.icon ? (iconMap[cluster.icon] || Users) : Users;
  const colorKey = (cluster.color as 'red' | 'blue' | 'yellow') || 'blue';
  const colors = colorClasses[colorKey];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true }}
      className={`bg-white rounded-xl p-5 border ${colors.border} ${colors.hoverBorder} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 mb-1 truncate">{cluster.short_name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{cluster.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function BidangPreviewSection({
  className = '',
  initialData
}: BidangPreviewSectionProps) {
  const { data: clusters = [], isLoading } = useQuery({
    queryKey: queryKeys.clusters,
    queryFn: fetchClusters,
    initialData: initialData,
    staleTime: staleTime.static,
  });

  return (
    <section className={`relative py-24 px-8 bg-gray-50 overflow-hidden ${className}`}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-iark-yellow/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl" />

      <div className="absolute top-32 left-1/4 w-10 h-10 bg-iark-red rounded-full opacity-20 animate-pulse-slow" />
      <div className="absolute top-1/2 right-16 w-8 h-8 bg-iark-blue rounded-full opacity-20 animate-drift" />
      <div className="absolute bottom-1/3 left-20 w-12 h-12 bg-iark-yellow rounded-full opacity-30 animate-pulse-slow" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-iark-blue/10 rounded-full flex items-center justify-center animate-pulse-slow">
            <div className="w-6 h-6 bg-iark-blue rounded-full" />
          </div>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-iark-black">
          12 Cluster IARK
        </h2>

        <p className="text-lg md:text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Cluster-cluster yang berdedikasi melayani alumni dan mengembangkan kepemimpinan berintegritas
        </p>

        {isLoading && clusters.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-iark-blue animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
            {clusters.map((cluster, index) => (
              <BidangCard key={cluster.id} cluster={cluster} index={index} />
            ))}
          </div>
        )}

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
