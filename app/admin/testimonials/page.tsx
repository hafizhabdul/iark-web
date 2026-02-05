'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { fetchTestimonialsAdmin } from '@/lib/queries/homepage';
import { queryKeys, staleTime } from '@/lib/queries';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Quote,
  X,
  Loader2,
  User,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  title: string;
  angkatan: string | null;
  photo: string | null;
  quote: string;
  type: 'ketua_angkatan' | 'tokoh_ternama';
  order_index: number | null;
  is_active: boolean;
  created_at: string;
}

const TYPE_LABELS: Record<Testimonial['type'], string> = {
  ketua_angkatan: 'Ketua Angkatan',
  tokoh_ternama: 'Tokoh Ternama',
};

export default function AdminTestimonialsPage() {
  const queryClient = useQueryClient();

  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: queryKeys.testimonialsAdmin,
    queryFn: () => fetchTestimonialsAdmin(),
    staleTime: staleTime.semiDynamic,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [angkatan, setAngkatan] = useState('');
  const [photo, setPhoto] = useState('');
  const [quote, setQuote] = useState('');
  const [type, setType] = useState<Testimonial['type']>('ketua_angkatan');
  const [isActive, setIsActive] = useState(true);
  const [uploading, setUploading] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async (data: {
      isEditing: boolean;
      id?: string;
      payload: {
        name: string;
        title: string;
        angkatan: string | null;
        photo: string | null;
        quote: string;
        type: Testimonial['type'];
        is_active: boolean;
        order_index?: number;
      };
    }) => {
      const supabase = createClient();
      if (data.isEditing && data.id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from('testimonials')
          .update(data.payload)
          .eq('id', data.id);
        if (error) throw error;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any).from('testimonials').insert(data.payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonialsAdmin });
      closeModal();
    },
    onError: (error) => {
      console.error('Error saving testimonial:', error);
      alert('Gagal menyimpan testimonial');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from('testimonials').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonialsAdmin });
    },
    onError: (error) => {
      console.error('Error deleting testimonial:', error);
      alert('Gagal menghapus testimonial');
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: boolean }) => {
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('testimonials')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonialsAdmin });
    },
    onError: (error) => {
      console.error('Error toggling testimonial status:', error);
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({
      currentId,
      swapId,
      currentOrderIndex,
      swapOrderIndex,
    }: {
      currentId: string;
      swapId: string;
      currentOrderIndex: number | null;
      swapOrderIndex: number | null;
    }) => {
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: error1 } = await (supabase as any)
        .from('testimonials')
        .update({ order_index: swapOrderIndex })
        .eq('id', currentId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: error2 } = await (supabase as any)
        .from('testimonials')
        .update({ order_index: currentOrderIndex })
        .eq('id', swapId);
      if (error1 || error2) throw error1 || error2;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonialsAdmin });
    },
    onError: (error) => {
      console.error('Error reordering testimonials:', error);
    },
  });

  function openModal(testimonial?: Testimonial) {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setName(testimonial.name);
      setTitle(testimonial.title);
      setAngkatan(testimonial.angkatan || '');
      setPhoto(testimonial.photo || '');
      setQuote(testimonial.quote);
      setType(testimonial.type);
      setIsActive(testimonial.is_active);
    } else {
      setEditingTestimonial(null);
      setName('');
      setTitle('');
      setAngkatan('');
      setPhoto('');
      setQuote('');
      setType('ketua_angkatan');
      setIsActive(true);
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingTestimonial(null);
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
    const fileName = `testimonial-${Date.now()}.${fileExt}`;
    const filePath = `testimonials/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('general')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading photo:', uploadError);
      alert('Gagal mengupload foto');
    } else {
      const { data } = supabase.storage.from('general').getPublicUrl(filePath);
      setPhoto(data.publicUrl);
    }

    setUploading(false);
  }

  function saveTestimonial() {
    if (!name.trim() || !title.trim() || !quote.trim()) {
      alert('Name, title, dan quote wajib diisi');
      return;
    }

    const payload = {
      name: name.trim(),
      title: title.trim(),
      angkatan: angkatan.trim() || null,
      photo: photo || null,
      quote: quote.trim(),
      type,
      is_active: isActive,
    };

    if (editingTestimonial) {
      saveMutation.mutate({
        isEditing: true,
        id: editingTestimonial.id,
        payload,
      });
    } else {
      const maxOrderIndex = testimonials.reduce(
        (max, t) => Math.max(max, t.order_index || 0),
        0
      );
      saveMutation.mutate({
        isEditing: false,
        payload: { ...payload, order_index: maxOrderIndex + 1 },
      });
    }
  }

  function deleteTestimonial(id: string) {
    if (!confirm('Apakah Anda yakin ingin menghapus testimonial ini?')) return;
    deleteMutation.mutate(id);
  }

  function toggleTestimonialStatus(id: string, currentStatus: boolean) {
    toggleStatusMutation.mutate({ id, currentStatus });
  }

  function moveTestimonial(id: string, direction: 'up' | 'down') {
    const currentIndex = testimonials.findIndex((t) => t.id === id);
    if (currentIndex === -1) return;

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (swapIndex < 0 || swapIndex >= testimonials.length) return;

    const current = testimonials[currentIndex];
    const swap = testimonials[swapIndex];

    reorderMutation.mutate({
      currentId: current.id,
      swapId: swap.id,
      currentOrderIndex: current.order_index,
      swapOrderIndex: swap.order_index,
    });
  }

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch = testimonial.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = !filterType || testimonial.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-600">Kelola testimonial alumni IARK</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-iark-red text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Testimonial</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
          >
            <option value="">Semua Tipe</option>
            <option value="ketua_angkatan">Ketua Angkatan</option>
            <option value="tokoh_ternama">Tokoh Ternama</option>
          </select>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-iark-red" />
          </div>
        ) : filteredTestimonials.length > 0 ? (
          filteredTestimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-xl shadow-sm overflow-hidden ${
                !testimonial.is_active ? 'opacity-60' : ''
              }`}
            >
              <div className="p-4">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden">
                    {testimonial.photo ? (
                      <img
                        src={testimonial.photo}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {testimonial.name}
                      </h3>
                      {!testimonial.is_active && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded flex-shrink-0">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{testimonial.title}</p>
                    {testimonial.angkatan && (
                      <p className="text-xs text-gray-500">
                        Angkatan {testimonial.angkatan}
                      </p>
                    )}
                    <span className="inline-block mt-1 text-xs bg-iark-red/10 text-iark-red px-2 py-0.5 rounded">
                      {TYPE_LABELS[testimonial.type]}
                    </span>
                  </div>
                </div>

                <div className="relative mb-4">
                  <Quote className="absolute -top-1 -left-1 w-5 h-5 text-gray-200" />
                  <p className="text-sm text-gray-600 line-clamp-3 pl-4 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-2 border-t pt-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveTestimonial(testimonial.id, 'up')}
                      disabled={index === 0}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveTestimonial(testimonial.id, 'down')}
                      disabled={index === filteredTestimonials.length - 1}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1" />
                  <button
                    onClick={() => openModal(testimonial)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="text-sm">Edit</span>
                  </button>
                  <button
                    onClick={() =>
                      toggleTestimonialStatus(testimonial.id, testimonial.is_active)
                    }
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title={testimonial.is_active ? 'Hide' : 'Show'}
                  >
                    {testimonial.is_active ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteTestimonial(testimonial.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center">
            <Quote className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Tidak ada testimonial ditemukan</p>
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
                  {editingTestimonial ? 'Edit Testimonial' : 'Tambah Testimonial'}
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
              {/* Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto
                </label>
                {photo ? (
                  <div className="relative w-24 h-24 bg-gray-100 rounded-full overflow-hidden mx-auto">
                    <img
                      src={photo}
                      alt="Photo"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setPhoto('')}
                      className="absolute top-0 right-0 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-24 h-24 mx-auto bg-gray-50 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:bg-gray-100">
                    {uploading ? (
                      <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jabatan/Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
                />
              </div>

              {/* Angkatan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Angkatan
                </label>
                <input
                  type="text"
                  value={angkatan}
                  onChange={(e) => setAngkatan(e.target.value)}
                  placeholder="Contoh: 2010"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipe *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as Testimonial['type'])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
                >
                  <option value="ketua_angkatan">Ketua Angkatan</option>
                  <option value="tokoh_ternama">Tokoh Ternama</option>
                </select>
              </div>

              {/* Quote */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quote/Testimonial *
                </label>
                <textarea
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent resize-none"
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
                onClick={saveTestimonial}
                disabled={saveMutation.isPending}
                className="px-4 py-2 bg-iark-red text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {saveMutation.isPending ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
