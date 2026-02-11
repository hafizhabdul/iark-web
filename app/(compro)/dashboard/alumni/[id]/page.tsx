'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Alumni } from '@/components/features/dashboard/AlumniCard';
import { ArrowLeft, Mail, Linkedin, MapPin, Briefcase, GraduationCap, Calendar, Award, Pencil } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/supabase/types';
import { useAuth } from '@/components/providers/AuthContext';

export default function AlumniDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const alumniId = params.id as string;

  const [alumni, setAlumni] = useState<Alumni | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlumni() {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', alumniId)
        .single();

      if (error) {
        console.error('Error fetching alumni:', error);
        setAlumni(null);
        setLoading(false);
        return;
      }

      const profile = data as Profile | null;
      if (!profile) {
        setAlumni(null);
        setLoading(false);
        return;
      }

      setAlumni({
        id: profile.id,
        name: profile.name || '',
        email: profile.email || '',
        batch: profile.angkatan ? `RK Angkatan ${profile.angkatan}` : '',
        field: profile.job_title || '',
        location: profile.location || '',
        avatar: profile.photo || undefined,
        currentRole: profile.job_title || undefined,
        company: profile.company || undefined,
        linkedin: profile.linkedin || undefined,
        bio: profile.bio || '',
      });
      setLoading(false);
    }

    fetchAlumni();
  }, [alumniId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-iark-red border-t-transparent"></div>
      </div>
    );
  }

  if (!alumni) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Alumni not found</h2>
          <p className="text-gray-600 mb-4">The alumni profile you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push('/dashboard/alumni')}
            className="text-iark-red hover:underline font-semibold"
          >
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-iark-red/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-10 h-10 bg-iark-yellow rounded-full opacity-20 animate-pulse-slow pointer-events-none" />
      <div className="absolute top-2/3 left-20 w-8 h-8 bg-iark-red rounded-full opacity-20 animate-drift pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto p-6 lg:p-8">
        {/* Back Button */}
        <motion.button
          onClick={() => router.push('/dashboard/alumni')}
          className="flex items-center gap-2 text-gray-600 hover:text-iark-red mb-6 font-semibold transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowLeft size={20} />
          Back to Directory
        </motion.button>

        {/* Header Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-iark-red/20 bg-gray-100">
              {alumni.avatar ? (
                <Image src={alumni.avatar} alt={alumni.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-iark-red flex items-center justify-center text-white font-bold text-4xl">
                  {alumni.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{alumni.name}</h1>

                {/* Edit Button - Right aligned on desktop */}
                {user?.id === alumni.id && (
                  <motion.button
                    onClick={() => router.push('/dashboard/profile')}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-iark-blue text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-md hover:shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Pencil size={18} />
                    Edit Profil
                  </motion.button>
                )}
              </div>

              <p className="text-xl text-iark-red font-semibold mb-4">
                {alumni.currentRole}{alumni.company ? ` @ ${alumni.company}` : ''}
              </p>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={18} />
                  <span>{alumni.batch}</span>
                </div>
                {alumni.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={18} />
                    <span>{alumni.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase size={18} />
                  <span>{alumni.field || 'General'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <motion.a
                  href={`mailto:${alumni.email}`}
                  className="flex items-center gap-2 px-4 py-2 bg-iark-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail size={18} />
                  Email
                </motion.a>
                {alumni.linkedin && (
                  <motion.a
                    href={alumni.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Linkedin size={18} />
                    LinkedIn
                  </motion.a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* About Section */}
        {alumni.bio && (
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{alumni.bio}</p>
          </motion.div>
        )}

        {/* Note about incomplete profile */}
        {user?.id === alumni.id && (!alumni.bio || !alumni.location || !alumni.currentRole) && (
          <motion.div
            className="bg-iark-yellow/10 border-2 border-iark-yellow/20 rounded-2xl p-6 mb-6 flex items-center gap-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-12 h-12 bg-iark-yellow/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Award className="text-iark-yellow w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Profil Anda belum lengkap!</h3>
              <p className="text-gray-600">Lengkapi profil Anda agar alumni lain dapat lebih mudah mengenali dan terhubung dengan Anda.</p>
              <button
                onClick={() => router.push('/dashboard/profile')}
                className="mt-2 text-iark-red font-bold hover:underline"
              >
                Lengkapi Sekarang &rarr;
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
