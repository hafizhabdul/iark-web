'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  User,
  Instagram,
  Linkedin,
  X,
  Loader2,
  UserCog,
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

interface ManagementMember {
  id: string;
  name: string;
  position: string;
  angkatan: string | null;
  photo: string | null;
  role: 'pengurus_inti' | 'ketua_angkatan';
  instagram: string | null;
  linkedin: string | null;
  order_index: number | null;
  created_at: string;
}

export default function AdminManagementPage() {
  const [members, setMembers] = useState<ManagementMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<ManagementMember | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [angkatan, setAngkatan] = useState('');
  const [photo, setPhoto] = useState('');
  const [role, setRole] = useState<'pengurus_inti' | 'ketua_angkatan'>('pengurus_inti');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('management')
      .select('*')
      .order('order_index', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching management:', error);
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  }

  function openModal(member?: ManagementMember) {
    if (member) {
      setEditingMember(member);
      setName(member.name);
      setPosition(member.position);
      setAngkatan(member.angkatan || '');
      setPhoto(member.photo || '');
      setRole(member.role);
      setInstagram(member.instagram || '');
      setLinkedin(member.linkedin || '');
    } else {
      setEditingMember(null);
      setName('');
      setPosition('');
      setAngkatan('');
      setPhoto('');
      setRole('pengurus_inti');
      setInstagram('');
      setLinkedin('');
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingMember(null);
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
    const fileName = `management-${Date.now()}.${fileExt}`;
    const filePath = `management/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('general')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      alert('Gagal mengupload gambar');
    } else {
      const { data } = supabase.storage.from('general').getPublicUrl(filePath);
      setPhoto(data.publicUrl);
    }

    setUploading(false);
  }

  async function saveMember() {
    if (!name.trim() || !position.trim()) {
      alert('Nama dan posisi wajib diisi');
      return;
    }

    setSaving(true);
    const supabase = createClient();

    if (editingMember) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('management')
        .update({
          name: name.trim(),
          position: position.trim(),
          angkatan: angkatan.trim() || null,
          photo: photo || null,
          role,
          instagram: instagram.trim() || null,
          linkedin: linkedin.trim() || null,
        })
        .eq('id', editingMember.id);

      if (error) {
        console.error('Error updating member:', error);
        alert('Gagal mengupdate anggota');
      } else {
        fetchMembers();
        closeModal();
      }
    } else {
      const maxOrderIndex = members.length > 0
        ? Math.max(...members.map(m => m.order_index || 0)) + 1
        : 0;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from('management').insert({
        name: name.trim(),
        position: position.trim(),
        angkatan: angkatan.trim() || null,
        photo: photo || null,
        role,
        instagram: instagram.trim() || null,
        linkedin: linkedin.trim() || null,
        order_index: maxOrderIndex,
      });

      if (error) {
        console.error('Error creating member:', error);
        alert('Gagal menambahkan anggota');
      } else {
        fetchMembers();
        closeModal();
      }
    }

    setSaving(false);
  }

  async function deleteMember(id: string) {
    if (!confirm('Apakah Anda yakin ingin menghapus anggota ini?')) return;

    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('management').delete().eq('id', id);

    if (error) {
      console.error('Error deleting member:', error);
      alert('Gagal menghapus anggota');
    } else {
      fetchMembers();
    }
  }

  async function moveOrder(member: ManagementMember, direction: 'up' | 'down') {
    const filteredByRole = members.filter(m => m.role === member.role);
    const currentIndex = filteredByRole.findIndex(m => m.id === member.id);
    
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === filteredByRole.length - 1) return;

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const swapMember = filteredByRole[swapIndex];

    const supabase = createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: error1 } = await (supabase as any)
      .from('management')
      .update({ order_index: swapMember.order_index })
      .eq('id', member.id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: error2 } = await (supabase as any)
      .from('management')
      .update({ order_index: member.order_index })
      .eq('id', swapMember.id);

    if (error1 || error2) {
      console.error('Error updating order:', error1 || error2);
    } else {
      fetchMembers();
    }
  }

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'pengurus_inti':
        return 'Pengurus Inti';
      case 'ketua_angkatan':
        return 'Ketua Angkatan';
      default:
        return role;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Management</h1>
          <p className="text-gray-600">Kelola anggota kepengurusan IARK</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-iark-red text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Anggota</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari anggota..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
          >
            <option value="all">Semua Role</option>
            <option value="pengurus_inti">Pengurus Inti</option>
            <option value="ketua_angkatan">Ketua Angkatan</option>
          </select>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-iark-red" />
          </div>
        ) : filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="aspect-square bg-gray-100">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-600 truncate">{member.position}</p>
                {member.angkatan && (
                  <p className="text-xs text-gray-500 mt-1">Angkatan {member.angkatan}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      member.role === 'pengurus_inti'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {getRoleLabel(member.role)}
                  </span>
                </div>
                {(member.instagram || member.linkedin) && (
                  <div className="flex items-center gap-2 mt-3">
                    {member.instagram && (
                      <a
                        href={`https://instagram.com/${member.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin.startsWith('http') ? member.linkedin : `https://linkedin.com/in/${member.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-1 mt-3 pt-3 border-t">
                  <button
                    onClick={() => moveOrder(member, 'up')}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Move Up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveOrder(member, 'down')}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Move Down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="flex-1" />
                  <button
                    onClick={() => openModal(member)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteMember(member.id)}
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
            <UserCog className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Tidak ada anggota ditemukan</p>
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
                  {editingMember ? 'Edit Anggota' : 'Tambah Anggota'}
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
                  <div className="relative aspect-square max-w-[200px] bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={photo}
                      alt="Photo"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setPhoto('')}
                      className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-square max-w-[200px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-gray-500 text-sm">Upload foto</span>
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
                  Nama *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
                />
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posisi *
                </label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
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
                  placeholder="Contoh: 2020"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'pengurus_inti' | 'ketua_angkatan')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
                >
                  <option value="pengurus_inti">Pengurus Inti</option>
                  <option value="ketua_angkatan">Ketua Angkatan</option>
                </select>
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="username"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
                  />
                </div>
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="username atau URL lengkap"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
                  />
                </div>
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
                onClick={saveMember}
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
