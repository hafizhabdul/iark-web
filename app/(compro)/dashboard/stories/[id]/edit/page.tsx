'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/providers/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Send,
  Image as ImageIcon,
  X,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

export default function EditStoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<'draft' | 'pending' | 'published' | 'rejected'>('draft');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStory();
  }, [params.id]);

  async function fetchStory() {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('stories')
      .select('*')
      .eq('id', params.id as string)
      .eq('author_id', user?.id as string)
      .single();

    if (error || !data) {
      console.error('Error fetching story:', error);
      router.push('/dashboard/stories');
      return;
    }

    setTitle(data.title);
    setExcerpt(data.excerpt || '');
    setContent(data.content);
    setFeaturedImage(data.hero_image);
    setStatus(data.status);
    setLoading(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar yang diperbolehkan');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }

    setUploading(true);
    const supabase = createClient();

    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
    const filePath = `stories/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('stories')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      alert('Gagal mengupload gambar');
    } else {
      const { data } = supabase.storage.from('stories').getPublicUrl(filePath);
      setFeaturedImage(data.publicUrl);
    }

    setUploading(false);
  }

  async function saveStory(newStatus: 'draft' | 'pending') {
    if (!title.trim()) {
      alert('Judul cerita wajib diisi');
      return;
    }

    if (!content.trim()) {
      alert('Konten cerita wajib diisi');
      return;
    }

    if (newStatus === 'pending' && !excerpt.trim()) {
      alert('Ringkasan cerita wajib diisi sebelum mengirim untuk review');
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const updateData: {
      title: string;
      excerpt: string;
      content: string;
      hero_image: string | null;
      status: string;
      rejected_reason?: null;
    } = {
      title: title.trim(),
      excerpt: excerpt.trim() || title.trim().substring(0, 150),
      content: content.trim(),
      hero_image: featuredImage,
      status: newStatus,
    };

    // Clear rejection reason if resubmitting
    if (status === 'rejected' && newStatus === 'pending') {
      updateData.rejected_reason = null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('stories')
      .update(updateData)
      .eq('id', params.id as string);

    if (error) {
      console.error('Error saving story:', error);
      alert('Gagal menyimpan cerita');
    } else {
      if (newStatus === 'pending') {
        router.push('/dashboard/stories?submitted=true');
      } else {
        router.push('/dashboard/stories');
      }
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iark-red" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/dashboard/stories"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => saveStory('draft')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Simpan Draft</span>
          </button>
          <button
            onClick={() => saveStory('pending')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-iark-red text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{status === 'rejected' ? 'Kirim Ulang' : 'Kirim untuk Review'}</span>
          </button>
        </div>
      </div>

      {status === 'rejected' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-sm">
            <strong>Catatan:</strong> Cerita ini sebelumnya ditolak. Silakan perbaiki
            sesuai feedback dan kirim ulang untuk direview kembali.
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Cerita</h1>

        {/* Featured Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gambar Utama (Opsional)
          </label>
          {featuredImage ? (
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={featuredImage}
                alt="Featured"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setFeaturedImage(null)}
                className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center aspect-video bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              {uploading ? (
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-gray-500 text-sm">
                    Klik untuk upload gambar
                  </span>
                  <span className="text-gray-400 text-xs mt-1">
                    Maksimal 5MB (JPG, PNG, WebP)
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Judul Cerita <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masukkan judul cerita..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent text-lg"
          />
        </div>

        {/* Excerpt */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ringkasan Cerita <span className="text-red-500">*</span>
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Tulis ringkasan singkat cerita Anda..."
            rows={3}
            maxLength={300}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            {excerpt.length}/300 karakter
          </p>
        </div>

        {/* Content */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Konten Cerita <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tulis cerita Anda di sini..."
            rows={15}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent resize-none"
          />
        </div>

        {/* Info */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Catatan:</strong> Setelah Anda mengirim cerita untuk review,
            admin akan meninjau konten dalam 1-3 hari kerja.
          </p>
        </div>
      </div>
    </div>
  );
}
