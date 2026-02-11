import type { FeaturedStory } from '@/lib/queries/homepage';
import Image from 'next/image';
import Link from 'next/link';

export interface TestimoniSectionProps {
  className?: string;
  initialData?: FeaturedStory[];
}

export function TestimoniSection({ className = '', initialData }: TestimoniSectionProps) {
  const stories = initialData || [];

  return (
    <section className={`relative py-24 px-8 bg-white overflow-hidden ${className}`}>
      {/* Subtle gradient orbs background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-iark-yellow/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl" />

      {/* Decorative small elements with animations */}
      <div className="absolute top-32 right-1/3 w-10 h-10 bg-iark-red rounded-full opacity-20 animate-pulse-slow" />
      <div className="absolute top-2/3 left-16 w-8 h-8 bg-iark-yellow rounded-full opacity-20 animate-drift" />
      <div className="absolute bottom-1/4 right-20 w-12 h-12 bg-iark-blue rounded-full opacity-30 animate-pulse-slow" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Decorative element */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-iark-yellow/10 rounded-full flex items-center justify-center animate-pulse-slow">
            <div className="w-6 h-6 bg-iark-yellow rounded-full" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-iark-black">
          Kebanggaan Komunitas
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Kisah inspiratif dan blog dari para alumni yang terus berkontribusi
        </p>

        {stories.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada cerita yang dipublikasikan.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/stories/${story.slug}`}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Hero Image */}
                <div className="relative h-48 overflow-hidden">
                  {story.hero_image ? (
                    <Image
                      src={story.hero_image}
                      alt={story.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-iark-blue/20 to-iark-yellow/20" />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-iark-red text-white text-sm font-medium rounded-full">
                      {story.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-iark-black mb-2 line-clamp-2 group-hover:text-iark-red transition-colors">
                    {story.title}
                  </h3>
                  {story.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {story.excerpt}
                    </p>
                  )}

                  {/* Author */}
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                      {story.author_photo ? (
                        <Image
                          src={story.author_photo}
                          alt={story.author_name || 'Author'}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-iark-black">
                        {story.author_name || 'Anonim'}
                      </p>
                      {story.author_angkatan && (
                        <p className="text-xs text-gray-500">
                          Angkatan {story.author_angkatan}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View All Link */}
        {stories.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 px-8 py-3 bg-iark-red text-white font-medium rounded-full hover:bg-iark-red/90 transition-colors"
            >
              Lihat Semua Cerita
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
