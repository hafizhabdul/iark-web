'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export interface StoryDetailProps {
  story: {
    id: string;
    name: string;
    batch: string;
    title: string;
    photo: string;
    category: 'karir' | 'pengabdian' | 'akademik' | 'kepemimpinan';
    quote?: string;
    publishedDate: string;
    readTime: string;
    heroImage: string;
    content: string;
    tags?: string[];
    relatedStories?: string[];
  };
}

const getCategoryColor = (category: string) => {
  if (category === 'karir') return 'blue';
  if (category === 'pengabdian') return 'red';
  if (category === 'akademik') return 'yellow';
  if (category === 'kepemimpinan') return 'red';
  return 'gray';
};

const getCategoryLabel = (category: string) => {
  if (category === 'karir') return 'Karir & Bisnis';
  if (category === 'pengabdian') return 'Pengabdian';
  if (category === 'akademik') return 'Akademik';
  if (category === 'kepemimpinan') return 'Kepemimpinan';
  return category;
};

export function StoryDetail({ story }: StoryDetailProps) {
  const categoryColor = getCategoryColor(story.category);

  return (
    <article className="w-full">
      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">
        {/* Category Badge */}
        <div className="mb-6">
          <span
            className={`inline-block px-4 py-2 rounded-full text-sm font-bold text-white bg-iark-${categoryColor}`}
          >
            {getCategoryLabel(story.category)}
          </span>
        </div>

        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {story.title}
        </motion.h1>

        {/* Author Info */}
        <motion.div
          className="flex items-center gap-4 pb-8 border-b border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-gray-200">
            <Image
              src={story.photo}
              alt={story.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-lg">{story.name}</p>
            <p className="text-gray-600 text-sm">{story.batch}</p>
          </div>
          <div className="text-right text-gray-600 text-sm">
            <p>{story.publishedDate}</p>
            <p>{story.readTime} baca</p>
          </div>
        </motion.div>
      </div>

      {/* Hero Image */}
      <motion.div
        className="w-full h-96 md:h-[500px] relative bg-gray-200 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Image
          src={story.heroImage}
          alt={story.title}
          fill
          className="object-cover"
          unoptimized
        />
      </motion.div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-6 md:px-8 pb-16">
        {/* Quote if available */}
        {story.quote && (
          <motion.blockquote
            className="border-l-4 border-iark-red pl-6 py-4 mb-12 italic text-xl text-gray-700 bg-gray-50 rounded-r-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            "{story.quote}"
          </motion.blockquote>
        )}

        {/* Main Content */}
        <motion.div
          className="prose prose-lg max-w-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {children}
                </p>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-iark-blue pl-6 py-2 my-8 italic text-xl text-gray-600 bg-blue-50 rounded-r-lg">
                  {children}
                </blockquote>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-3 my-6 text-gray-700 text-lg">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-3 my-6 text-gray-700 text-lg">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="ml-4">{children}</li>
              ),
            }}
          >
            {story.content}
          </ReactMarkdown>
        </motion.div>

        {/* Tags */}
        {story.tags && story.tags.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {story.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        )}

        {/* Share Section */}
        <motion.div
          className="mt-12 pt-8 border-t border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-gray-600 text-sm mb-4">Bagikan cerita ini:</p>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </button>
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Twitter
            </button>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </button>
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-gradient-to-br from-iark-red to-iark-blue text-white rounded-2xl p-12 text-center shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Terinspirasi dari Cerita Ini?
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Bagikan juga perjalanan dan pencapaianmu untuk menginspirasi alumni lainnya!
            </p>
            <button className="bg-white text-iark-red px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg">
              Bagikan Ceritamu
            </button>
          </motion.div>

          {/* Back to Stories */}
          <div className="text-center mt-12">
            <Link
              href="/cerita"
              className="inline-flex items-center gap-2 text-iark-red font-semibold hover:underline"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Semua Cerita
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
