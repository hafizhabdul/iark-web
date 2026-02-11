'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Loader2,
  Building2,
  MapPin,
  Users,
  Image as ImageIcon,
} from 'lucide-react';

interface Dormitory {
  id: string;
  name: string;
  city: string;
  province: string | null;
  image_url: string | null;
  total_rooms: number | null;
  occupied_rooms: number | null;
  description: string | null;
  created_at: string;
}

export default function AdminDormitoriesPage() {
  const [dormitories, setDormitories] = useState<Dormitory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDormitory, setEditingDormitory] = useState<Dormitory | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [totalRooms, setTotalRooms] = useState('');
  const [occupiedRooms, setOccupiedRooms] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDormitories();
  }, []);

  async function fetchDormitories() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('dormitories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching dormitories:', error);
    } else {
      setDormitories(data || []);
    }
    setLoading(false);
  }

  function openModal(dormitory?: Dormitory) {
    if (dormitory) {
      setEditingDormitory(dormitory);
      setName(dormitory.name);
      setCity(dormitory.city);
      setProvince(dormitory.province || '');
      setImageUrl(dormitory.image_url || '');
      setTotalRooms(dormitory.total_rooms?.toString() || '');
      setOccupiedRooms(dormitory.occupied_rooms?.toString() || '');
      setDescription(dormitory.description || '');
    } else {
      setEditingDormitory(null);
      setName('');
      setCity('');
      setProvince('');
      setImageUrl('');
      setTotalRooms('');
      setOccupiedRooms('');
      setDescription('');
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingDormitory(null);
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
    const fileName = `dormitory-${Date.now()}.${fileExt}`;
    const filePath = `dormitories/${fileName}`;

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

  async function saveDormitory() {
    if (!name.trim() || !city.trim()) {
      alert('Nama dan kota wajib diisi');
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const dormitoryData = {
      name: name.trim(),
      city: city.trim(),
      province: province.trim() || null,
      image_url: imageUrl || null,
      total_rooms: totalRooms ? parseInt(totalRooms) : null,
      occupied_rooms: occupiedRooms ? parseInt(occupiedRooms) : null,
      description: description.trim() || null,
    };

    if (editingDormitory) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('dormitories')
        .update(dormitoryData)
        .eq('id', editingDormitory.id);

      if (error) {
        console.error('Error updating dormitory:', error);
        alert('Gagal mengupdate asrama');
      } else {
        fetchDormitories();
        closeModal();
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from('dormitories').insert(dormitoryData);

      if (error) {
        console.error('Error creating dormitory:', error);
        alert('Gagal membuat asrama');
      } else {
        fetchDormitories();
        closeModal();
      }
    }

    setSaving(false);
  }

  async function deleteDormitory(id: string) {
    if (!confirm('Apakah Anda yakin ingin menghapus asrama ini?')) return;

    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('dormitories').delete().eq('id', id);

    if (error) {
      console.error('Error deleting dormitory:', error);
      alert('Gagal menghapus asrama');
    } else {
      fetchDormitories();
    }
  }

  function getOccupancyPercentage(total: number | null, occupied: number | null): number {
    if (!total || total === 0) return 0;
    return Math.min(100, Math.round(((occupied || 0) / total) * 100));
  }

  const filteredDormitories = dormitories.filter(
    (dormitory) =>
      dormitory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dormitory.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asrama</h1>
          <p className="text-gray-600">Kelola data asrama IARK</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-iark-red text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Asrama</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari asrama berdasarkan nama atau kota..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
          />
        </div>
      </div>

      {/* Dormitories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-iark-red" />
          </div>
        ) : filteredDormitories.length > 0 ? (
          filteredDormitories.map((dormitory) => {
            const occupancy = getOccupancyPercentage(dormitory.total_rooms, dormitory.occupied_rooms);
            return (
              <div
                key={dormitory.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="aspect-video bg-gray-100">
                  {dormitory.image_url ? (
                    <img
                      src={dormitory.image_url}
                      alt={dormitory.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate mb-1">
                    {dormitory.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">
                      {dormitory.city}
                      {dormitory.province && `, ${dormitory.province}`}
                    </span>
                  </div>
                  {dormitory.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {dormitory.description}
                    </p>
                  )}
                  
                  {/* Occupancy */}
                  {dormitory.total_rooms && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Users className="w-3.5 h-3.5" />
                          <span>Hunian</span>
                        </div>
                        <span className="text-gray-900 font-medium">
                          {dormitory.occupied_rooms || 0}/{dormitory.total_rooms} ({occupancy}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            occupancy >= 90
                              ? 'bg-red-500'
                              : occupancy >= 70
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${occupancy}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal(dormitory)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="text-sm">Edit</span>
                    </button>
                    <button
                      onClick={() => deleteDormitory(dormitory.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Tidak ada asrama ditemukan</p>
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
                  {editingDormitory ? 'Edit Asrama' : 'Tambah Asrama'}
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
                  Gambar Asrama
                </label>
                {imageUrl ? (
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={imageUrl}
                      alt="Dormitory"
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
                  <label className="flex flex-col items-center justify-center aspect-video bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-gray-500 text-sm">Upload gambar</span>
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

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Asrama *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kota *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
                />
              </div>

              {/* Province */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provinsi
                </label>
                <input
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
                />
              </div>

              {/* Rooms */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Kamar
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={totalRooms}
                    onChange={(e) => setTotalRooms(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kamar Terisi
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={occupiedRooms}
                    onChange={(e) => setOccupiedRooms(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent resize-none"
                />
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
                onClick={saveDormitory}
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
