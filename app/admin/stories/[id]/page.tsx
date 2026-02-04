'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import DOMPurify from 'isomorphic-dompurify';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

interface Story {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  hero_image: string | null;
  status: 'draft' | 'pending' | 'published' | 'rejected';
  rejected_reason: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  profiles: {
    name: string;
    email: string;
    photo: string | null;
    angkatan: number | null;
  };
}

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: FileText },
  pending: { label: 'Menunggu Review', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  published: { label: 'Dipublikasi', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  rejected: { label: 'Ditolak', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function StoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchStory();
  }, [params.id]);

  async function fetchStory() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('stories')
      .select(
        `
        *,
        profiles(name, email, photo, angkatan)
      `
      )
      .eq('id', params.id as string)
      .single();

    if (error) {
      console.error('Error fetching story:', error);
    } else {
      setStory(data as Story);
    }
    setLoading(false);
  }

  async function approveStory() {
    if (!story) return;
    setActionLoading(true);

    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('stories')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
      })
      .eq('id', story.id);

    if (error) {
      console.error('Error approving story:', error);
      alert('Gagal menyetujui cerita');
    } else {
      router.push('/admin/stories?status=pending');
    }
    setActionLoading(false);
  }

  async function rejectStory() {
    if (!story) return;
    if (!rejectionReason.trim()) {
      alert('Mohon berikan alasan penolakan');
      return;
    }

    setActionLoading(true);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('stories')
      .update({
        status: 'rejected',
        rejected_reason: rejectionReason,
      })
      .eq('id', story.id);

    if (error) {
      console.error('Error rejecting story:', error);
      alert('Gagal menolak cerita');
    } else {
      router.push('/admin/stories?status=pending');
    }
    setActionLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iark-red" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Cerita tidak ditemukan</p>
        <Link href="/admin/stories" className="text-iark-red hover:underline mt-4 inline-block">
          Kembali ke daftar cerita
        </Link>
      </div>
    );
  }

  const status = statusConfig[story.status];
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/stories"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </Link>

        {story.status === 'pending' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              <span>Tolak</span>
            </button>
            <button
              onClick={approveStory}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Setujui & Publish</span>
            </button>
          </div>
        )}
      </div>

      {/* Story Info */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Featured Image */}
        {story.hero_image && (
          <div className="aspect-[21/9] bg-gray-100">
            <img
              src={story.hero_image}
              alt={story.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 lg:p-8">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}
            >
              <StatusIcon className="w-4 h-4" />
              {status.label}
            </span>

            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Calendar className="w-4 h-4" />
              <span>
                Dibuat:{' '}
                {new Date(story.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            {story.published_at && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>
                  Dipublikasi:{' '}
                  {new Date(story.published_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{story.title}</h1>

          {/* Excerpt */}
          <p className="text-lg text-gray-600 mb-6 italic">{story.excerpt}</p>

          {/* Author Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-8">
            <div className="w-12 h-12 rounded-full bg-iark-red/10 flex items-center justify-center">
              {story.profiles?.photo ? (
                <img
                  src={story.profiles.photo}
                  alt={story.profiles.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-iark-red" />
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {story.profiles?.name || 'Anonymous'}
              </p>
              <p className="text-sm text-gray-500">
                {story.profiles?.email}
                {story.profiles?.angkatan && ` • Angkatan ${story.profiles.angkatan}`}
              </p>
            </div>
          </div>

          {/* Rejection Reason */}
          {story.status === 'rejected' && story.rejected_reason && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-8">
              <p className="text-sm font-medium text-red-800 mb-1">Alasan Penolakan:</p>
              <p className="text-red-700">{story.rejected_reason}</p>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(story.content) }}
              className="whitespace-pre-wrap"
            />
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tolak Cerita
            </h3>
            <p className="text-gray-600 mb-4">
              Berikan alasan penolakan agar penulis dapat memperbaiki ceritanya:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Tulis alasan penolakan..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent min-h-[120px]"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={rejectStory}
                disabled={actionLoading || !rejectionReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Tolak Cerita
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
