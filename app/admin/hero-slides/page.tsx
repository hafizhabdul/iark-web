'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  X,
  Loader2,
  GripVertical,
} from 'lucide-react';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminHeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  async function fetchSlides() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching slides:', error);
    } else {
      setSlides(data || []);
    }
    setLoading(false);
  }

  function openModal(slide?: HeroSlide) {
    if (slide) {
      setEditingSlide(slide);
      setTitle(slide.title);
      setSubtitle(slide.subtitle || '');
      setImageUrl(slide.image_url);
      setLinkUrl(slide.link_url || '');
      setIsActive(slide.is_active);
    } else {
      setEditingSlide(null);
      setTitle('');
      setSubtitle('');
      setImageUrl('');
      setLinkUrl('');
      setIsActive(true);
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingSlide(null);
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
    const fileName = `hero-${Date.now()}.${fileExt}`;
    const filePath = `general/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('general')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      alert('Gagal mengupload gambar');
    } else {
      const { data } = supabase.storage.from('general').getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
    }

    setUploading(false);
  }

  async function saveSlide() {
    if (!title.trim() || !imageUrl) {
      alert('Judul dan gambar wajib diisi');
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const slideData = {
      title: title.trim(),
      subtitle: subtitle.trim() || null,
      image_url: imageUrl,
      link_url: linkUrl.trim() || null,
      is_active: isActive,
    };

    if (editingSlide) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('hero_slides')
        .update(slideData)
        .eq('id', editingSlide.id);

      if (error) {
        console.error('Error updating slide:', error);
        alert('Gagal mengupdate slide');
      } else {
        fetchSlides();
        closeModal();
      }
    } else {
      // Get next display order
      const maxOrder = slides.length > 0 ? Math.max(...slides.map(s => s.order_index)) : 0;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from('hero_slides').insert({
        ...slideData,
        order_index: maxOrder + 1,
      });

      if (error) {
        console.error('Error creating slide:', error);
        alert('Gagal membuat slide');
      } else {
        fetchSlides();
        closeModal();
      }
    }

    setSaving(false);
  }

  async function deleteSlide(id: string) {
    if (!confirm('Apakah Anda yakin ingin menghapus slide ini?')) return;

    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('hero_slides').delete().eq('id', id);

    if (error) {
      console.error('Error deleting slide:', error);
      alert('Gagal menghapus slide');
    } else {
      fetchSlides();
    }
  }

  async function toggleSlideStatus(id: string, currentStatus: boolean) {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('hero_slides')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      console.error('Error toggling slide status:', error);
    } else {
      fetchSlides();
    }
  }

  async function moveSlide(id: string, direction: 'up' | 'down') {
    const currentIndex = slides.findIndex(s => s.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === slides.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const otherSlide = slides[newIndex];
    const currentSlide = slides[currentIndex];

    const supabase = createClient();

    // Swap display orders
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await Promise.all([
      (supabase as any)
        .from('hero_slides')
        .update({ order_index: otherSlide.order_index })
        .eq('id', currentSlide.id),
      (supabase as any)
        .from('hero_slides')
        .update({ order_index: currentSlide.order_index })
        .eq('id', otherSlide.id),
    ]);

    fetchSlides();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hero Slides</h1>
          <p className="text-gray-600">Kelola banner di halaman utama</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-iark-red text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Slide</span>
        </button>
      </div>

      {/* Slides List */}
      <div className="bg-white rounded-xl shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-iark-red" />
          </div>
        ) : slides.length > 0 ? (
          <div className="divide-y">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`p-4 flex items-center gap-4 ${!slide.is_active ? 'opacity-60' : ''
                  }`}
              >
                {/* Drag Handle & Order */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => moveSlide(slide.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <span className="text-xs text-gray-400">{index + 1}</span>
                  <button
                    onClick={() => moveSlide(slide.id, 'down')}
                    disabled={index === slides.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    ▼
                  </button>
                </div>

                {/* Image Preview */}
                <div className="w-40 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={slide.image_url}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {slide.title}
                    </h3>
                    {!slide.is_active && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        Hidden
                      </span>
                    )}
                  </div>
                  {slide.subtitle && (
                    <p className="text-sm text-gray-600 truncate">{slide.subtitle}</p>
                  )}
                  {slide.link_url && (
                    <p className="text-xs text-blue-500 truncate">{slide.link_url}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal(slide)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleSlideStatus(slide.id, slide.is_active)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title={slide.is_active ? 'Hide' : 'Show'}
                  >
                    {slide.is_active ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteSlide(slide.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada hero slide</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingSlide ? 'Edit Slide' : 'Tambah Slide'}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gambar Banner *
                </label>
                {imageUrl ? (
                  <div className="relative aspect-[21/9] bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={imageUrl}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-[21/9] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-gray-500 text-sm">Upload gambar banner</span>
                        <span className="text-gray-400 text-xs">Ratio 21:9 disarankan</span>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle (Opsional)
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
                />
              </div>

              {/* Link URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link URL (Opsional)
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-iark-red rounded focus:ring-iark-red"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Tampilkan di website
                </label>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={saveSlide}
                disabled={saving}
                className="px-4 py-2 bg-iark-red text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
