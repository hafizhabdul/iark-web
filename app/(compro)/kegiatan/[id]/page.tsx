import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Heart, MessageCircle, MapPin, User } from 'lucide-react';
import type { Metadata } from 'next';

interface Activity {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  date: string | null;
  location: string | null;
  image_url: string | null;
  category: string;
  author: string | null;
  read_time: string | null;
  likes: number;
  comments: number;
  link: string | null;
  is_active: boolean;
  created_at: string;
}

async function getActivity(id: string): Promise<Activity | null> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('activities')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const activity = await getActivity(id);

  if (!activity) {
    return { title: 'Kegiatan Tidak Ditemukan' };
  }

  return {
    title: `${activity.title} - IARK`,
    description: activity.subtitle || activity.description || undefined,
    openGraph: {
      title: activity.title,
      description: activity.subtitle || undefined,
      images: activity.image_url ? [activity.image_url] : undefined,
    },
  };
}

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const activity = await getActivity(id);

  if (!activity) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Image */}
      {activity.image_url && (
        <div className="relative h-64 md:h-96 w-full">
          <Image
            src={activity.image_url}
            alt={activity.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link
          href="/kegiatan"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-iark-red mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Kegiatan
        </Link>

        {/* Category Badge */}
        <div className="mb-4">
          <span className="text-sm font-semibold text-iark-red bg-iark-red/10 px-3 py-1 rounded-full">
            {activity.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {activity.title}
        </h1>

        {/* Subtitle */}
        {activity.subtitle && (
          <p className="text-lg text-gray-600 mb-6">{activity.subtitle}</p>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
          {activity.date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {activity.date}
            </span>
          )}
          {activity.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {activity.location}
            </span>
          )}
          {activity.author && (
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {activity.author}
            </span>
          )}
          {activity.read_time && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {activity.read_time}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Heart className="w-4 h-4" />
            {activity.likes}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4" />
            {activity.comments}
          </span>
        </div>

        {/* Description / Content */}
        {activity.description ? (
          <div className="prose prose-lg max-w-none text-gray-700">
            {activity.description.split('\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Detail kegiatan belum tersedia.</p>
        )}

        {/* External Link */}
        {activity.link && activity.link.startsWith('http') && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <a
              href={activity.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-iark-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Lihat Selengkapnya
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
