'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Header, Footer } from '@/components/layout';
import { ActivityCard, Activity } from '@/components/features/activities';
import { Search, Calendar, Loader2 } from 'lucide-react';
import { fetchActivities } from '@/lib/queries/homepage';
import { queryKeys, staleTime } from '@/lib/queries';

export default function KegiatanPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const { data: activities = [], isLoading } = useQuery({
        queryKey: queryKeys.activities,
        queryFn: fetchActivities,
        staleTime: staleTime.semiDynamic,
    });

    // Extract unique categories from activities
    const categories = useMemo(() => {
        return Array.from(
            new Set(
                activities
                    .map((e) => e.category)
                    .filter((c): c is string => c !== null)
            )
        );
    }, [activities]);

    // Filter activities based on search and category
    const filteredActivities = activities.filter((activity) => {
        const matchesSearch =
            activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (activity.subtitle?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || activity.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-iark-red/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                    {/* Hero Section */}
                    <motion.div
                        className="relative h-80 bg-gradient-to-br from-iark-red via-red-600 to-iark-blue overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Hero Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-10 left-20 w-32 h-32 bg-white rounded-full blur-xl" />
                            <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full blur-xl" />
                            <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white rounded-full blur-xl" />
                        </div>

                        {/* Floating Animated Icons */}
                        <motion.div
                            className="absolute top-20 left-1/4 opacity-20"
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <Calendar size={40} className="text-white" />
                        </motion.div>

                        {/* Hero Content */}
                        <div className="relative h-full max-w-6xl mx-auto px-6 lg:px-8 flex flex-col justify-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-center"
                            >
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                                    Jejak Kegiatan IARK
                                </h1>
                                <p className="text-xl text-white mb-6 max-w-2xl mx-auto drop-shadow-md">
                                    Berbagai kegiatan dan program yang telah kami laksanakan bersama komunitas
                                </p>

                                {/* Quick Stats Badges */}
                                <motion.div
                                    className="flex flex-wrap justify-center gap-4 mb-8"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-semibold text-sm border border-white/30">
                                        {categories.length} Kategori
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-semibold text-sm border border-white/30">
                                        {activities.length} Kegiatan
                                    </div>
                                </motion.div>

                                {/* Search Bar in Hero */}
                                <motion.div
                                    className="max-w-2xl mx-auto"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="text"
                                            placeholder="Cari kegiatan..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 rounded-xl border-0 shadow-2xl focus:outline-none focus:ring-2 focus:ring-white text-gray-900 placeholder:text-gray-500 bg-white"
                                        />
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Wave Divider */}
                        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                            <svg
                                className="relative block w-full h-12"
                                viewBox="0 0 1200 120"
                                preserveAspectRatio="none"
                            >
                                <path
                                    d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                                    className="fill-white"
                                ></path>
                            </svg>
                        </div>
                    </motion.div>

                    {/* Content Section */}
                    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            <button
                                onClick={() => setSelectedCategory('')}
                                className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${selectedCategory === ''
                                        ? 'bg-iark-red text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Semua
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${selectedCategory === cat
                                            ? 'bg-iark-red text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Results Count */}
                        <div className="mb-6">
                            <p className="text-sm text-gray-600">
                                Menampilkan <span className="font-semibold text-gray-900">{filteredActivities.length}</span> dari{' '}
                                <span className="font-semibold text-gray-900">{activities.length}</span> kegiatan
                            </p>
                        </div>

                        {/* Loading State */}
                        {isLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="w-8 h-8 text-iark-red animate-spin" />
                                <span className="ml-3 text-gray-600">Memuat kegiatan...</span>
                            </div>
                        ) : filteredActivities.length > 0 ? (
                            <div className="space-y-6">
                                {filteredActivities.map((activity, index) => (
                                    <ActivityCard key={activity.id} activity={activity} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada kegiatan ditemukan</h3>
                                <p className="text-gray-600">Coba ubah filter atau kata kunci pencarian Anda</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
