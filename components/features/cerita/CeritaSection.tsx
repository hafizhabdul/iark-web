'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchPublishedStories, type Story as APIStory } from '@/lib/queries/stories';
import { queryKeys, staleTime } from '@/lib/queries';
import type { StoryCategory } from '@/lib/supabase/types';

export interface CeritaSectionProps {
  className?: string;
  initialData?: APIStory[];
}

interface Story {
  id: string;
  slug: string;
  name: string;
  batch: string;
  title: string;
  excerpt: string;
  photo: string;
  category: StoryCategory;
  featured?: boolean;
  quote?: string;
}

const categories = [
  { id: 'semua', label: 'Semua Cerita', color: 'gray' },
  { id: 'karir', label: 'Karir & Bisnis', color: 'blue' },
  { id: 'pengabdian', label: 'Pengabdian Masyarakat', color: 'red' },
  { id: 'akademik', label: 'Prestasi Akademik', color: 'yellow' },
  { id: 'kepemimpinan', label: 'Kepemimpinan', color: 'red' },
];

function mapStory(story: APIStory): Story {
  return {
    id: story.id,
    slug: story.slug,
    name: story.author_name,
    batch: story.author_angkatan ? `RK Angkatan ${story.author_angkatan}` : '',
    title: story.title,
    excerpt: story.excerpt || '',
    photo: story.hero_image || story.author_photo || '/images/placeholder.jpg',
    category: story.category as StoryCategory,
    featured: story.featured,
  };
}

export function CeritaSection({
  className = '',
  initialData
}: CeritaSectionProps) {
  const [activeCategory, setActiveCategory] = useState('semua');

  const { data: apiStories = [], isLoading } = useQuery({
    queryKey: queryKeys.storiesPublished(activeCategory === 'semua' ? undefined : activeCategory),
    queryFn: () => fetchPublishedStories(20, 0, activeCategory === 'semua' ? undefined : activeCategory as StoryCategory),
    initialData: activeCategory === 'semua' ? initialData : undefined,
    staleTime: staleTime.static,
  });

  const stories = apiStories.map(mapStory);

  const featuredStory = stories.find((story) => story.featured);
  const regularStories = stories.filter((story) => !story.featured);

  const filteredStories =
    activeCategory === 'semua'
      ? regularStories
      : regularStories.filter((story) => story.category === activeCategory);

  const getCategoryColor = (category: string) => {
    const cat = categories.find((c) => c.id === category);
    return cat?.color || 'gray';
  };

  const getCategoryLabel = (category: string) => {
    if (category === 'karir') return 'Karir & Bisnis';
    if (category === 'pengabdian') return 'Pengabdian';
    if (category === 'akademik') return 'Akademik';
    if (category === 'kepemimpinan') return 'Kepemimpinan';
    return category;
  };

  if (isLoading) {
    return (
      <section className={`relative py-16 px-8 bg-white overflow-hidden ${className}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iark-red"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`relative py-16 px-8 bg-white overflow-hidden ${className}`}>
      {/* Subtle gradient orbs background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-iark-red/5 rounded-full blur-3xl" />

      {/* Decorative small elements with animations */}
      <div className="absolute top-32 left-1/4 w-10 h-10 bg-iark-red rounded-full opacity-20 animate-pulse-slow" />
      <div className="absolute top-2/3 right-16 w-8 h-8 bg-iark-yellow rounded-full opacity-20 animate-drift" />
      <div className="absolute bottom-1/4 left-20 w-12 h-12 bg-iark-blue rounded-full opacity-30 animate-pulse-slow" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Featured Story */}
        {featuredStory && (
          <div className="mb-16">
            <motion.div
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Photo */}
                <div className="relative h-80 md:h-auto">
                  <Image
                    src={featuredStory.photo}
                    alt={featuredStory.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex gap-2 mb-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-iark-${getCategoryColor(
                        featuredStory.category
                      )}`}
                    >
                      {getCategoryLabel(featuredStory.category)}
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Cerita Pilihan
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {featuredStory.title}
                  </h2>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-iark-red/20">
                      <Image
                        src={featuredStory.photo}
                        alt={featuredStory.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{featuredStory.name}</p>
                      <p className="text-sm text-gray-600">{featuredStory.batch}</p>
                    </div>
                  </div>

                  {featuredStory.quote && (
                    <blockquote className="border-l-4 border-iark-red pl-4 py-2 mb-6 italic text-gray-700">
                      &ldquo;{featuredStory.quote}&rdquo;
                    </blockquote>
                  )}

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredStory.excerpt}
                  </p>

                  <Link href={`/cerita/${featuredStory.slug}`}>
                    <button className="bg-iark-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 self-start">
                      Baca Cerita Lengkap →
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Filter Bar */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeCategory === category.id
                  ? category.color === 'gray'
                    ? 'bg-gray-800 text-white shadow-lg scale-105'
                    : `bg-iark-${category.color} text-white shadow-lg scale-105`
                  : 'bg-white text-gray-700 hover:shadow-md hover:scale-102'
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Story Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredStories.map((story, index) => (
            <Link href={`/cerita/${story.slug}`} key={story.id}>
              <motion.div
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {/* Photo */}
                <div className="relative h-48 bg-gray-200">
                  <Image
                    src={story.photo}
                    alt={story.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  <div className="absolute top-4 right-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-iark-${getCategoryColor(
                        story.category
                      )}`}
                    >
                      {getCategoryLabel(story.category)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-200">
                      <Image
                        src={story.photo}
                        alt={story.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{story.name}</p>
                      <p className="text-xs text-gray-600">{story.batch}</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-iark-red transition-colors">
                    {story.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                    {story.excerpt}
                  </p>

                  <span className="text-iark-red font-semibold text-sm group-hover:underline">
                    Baca Selengkapnya →
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="bg-gradient-to-br from-iark-red to-iark-blue text-white rounded-2xl p-12 text-center shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Punya Cerita Inspiratif?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Jadilah Inspirasi untuk Alumni Lainnya. Bagikan perjalananmu dan
            dampak positif yang telah kamu ciptakan!
          </p>
          <button className="bg-white text-iark-red px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg">
            Bagikan Ceritamu
          </button>
        </motion.div>
      </div>
    </section>
  );
}
