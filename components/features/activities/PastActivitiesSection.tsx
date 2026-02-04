import { createPublicClient } from '@/lib/supabase/public';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ActivityCard } from './ActivityCard';
import { unstable_cache } from 'next/cache';

const getActivities = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('is_active', true)
      .order('date', { ascending: false })
      .limit(5);

    if (error) throw error;
    return (data || []) as Activity[];
  },
  ['activities-home'],
  { revalidate: 3600, tags: ['activities'] }
);

export interface Activity {
  id: string;
  category: string;
  author: string;
  title: string;
  subtitle: string;
  date: string;
  read_time: string;
  likes: number;
  comments: number;
  image_url: string;
  link: string;
  is_active: boolean;
}

export interface PastActivitiesSectionProps {
  className?: string;
}

export async function PastActivitiesSection({ className = '' }: PastActivitiesSectionProps) {
  let activities: Activity[] = [];
  try {
    activities = await getActivities();
  } catch (error) {
    console.error('Error fetching activities:', error);
  }

  return (
    <section className={`relative py-24 px-8 bg-gray-50 overflow-hidden ${className}`}>
      {/* Subtle gradient orbs background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-iark-yellow/5 rounded-full blur-3xl" />

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
          Jejak Kegiatan Kami
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Berbagai kegiatan dan program yang telah kami laksanakan bersama
        </p>

        {/* Activity Cards */}
        <div className="space-y-6 mb-12">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <ActivityCard key={activity.id} activity={activity} index={index} />
            ))
          ) : (
            <p className="text-center text-gray-500">Belum ada kegiatan.</p>
          )}
        </div>

        {/* Read More Link */}
        <div className="text-center">
          <Link
            href="/cerita"
            className="inline-flex items-center gap-2 text-iark-red font-semibold hover:text-red-700 transition-colors duration-300 group"
          >
            Lihat Semua Cerita
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
