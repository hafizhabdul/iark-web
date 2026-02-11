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
  Layers,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

interface Cluster {
  id: string;
  name: string;
  short_name: string;
  description: string | null;
  icon: string | null;
  color: 'red' | 'blue' | 'yellow' | null;
  order_index: number | null;
  created_at: string;
}

const colorStyles: Record<string, string> = {
  red: 'bg-red-100 text-red-700',
  blue: 'bg-blue-100 text-blue-700',
  yellow: 'bg-yellow-100 text-yellow-700',
};

export default function AdminClustersPage() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCluster, setEditingCluster] = useState<Cluster | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState<'red' | 'blue' | 'yellow' | ''>('');

  useEffect(() => {
    fetchClusters();
  }, []);

  async function fetchClusters() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('clusters')
      .select('*')
      .order('order_index', { ascending: true, nullsFirst: false });

    if (error) {
      console.error('Error fetching clusters:', error);
    } else {
      setClusters(data || []);
    }
    setLoading(false);
  }

  function openModal(cluster?: Cluster) {
    if (cluster) {
      setEditingCluster(cluster);
      setName(cluster.name);
      setShortName(cluster.short_name);
      setDescription(cluster.description || '');
      setIcon(cluster.icon || '');
      setColor(cluster.color || '');
    } else {
      setEditingCluster(null);
      setName('');
      setShortName('');
      setDescription('');
      setIcon('');
      setColor('');
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingCluster(null);
  }

  async function saveCluster() {
    if (!name.trim() || !shortName.trim()) {
      alert('Nama dan short name wajib diisi');
      return;
    }

    setSaving(true);
    const supabase = createClient();

    if (editingCluster) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('clusters')
        .update({
          name: name.trim(),
          short_name: shortName.trim(),
          description: description.trim() || null,
          icon: icon.trim() || null,
          color: color || null,
        })
        .eq('id', editingCluster.id);

      if (error) {
        console.error('Error updating cluster:', error);
        alert('Gagal mengupdate cluster');
      } else {
        fetchClusters();
        closeModal();
      }
    } else {
      const maxOrder = clusters.reduce((max, c) => Math.max(max, c.order_index || 0), 0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from('clusters').insert({
        name: name.trim(),
        short_name: shortName.trim(),
        description: description.trim() || null,
        icon: icon.trim() || null,
        color: color || null,
        order_index: maxOrder + 1,
      });

      if (error) {
        console.error('Error creating cluster:', error);
        alert('Gagal membuat cluster');
      } else {
        fetchClusters();
        closeModal();
      }
    }

    setSaving(false);
  }

  async function deleteCluster(id: string) {
    if (!confirm('Apakah Anda yakin ingin menghapus cluster ini?')) return;

    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('clusters').delete().eq('id', id);

    if (error) {
      console.error('Error deleting cluster:', error);
      alert('Gagal menghapus cluster');
    } else {
      fetchClusters();
    }
  }

  async function moveCluster(id: string, direction: 'up' | 'down') {
    const currentIndex = clusters.findIndex((c) => c.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= clusters.length) return;

    const currentCluster = clusters[currentIndex];
    const targetCluster = clusters[targetIndex];

    const supabase = createClient();

    // Swap order_index values
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: error1 } = await (supabase as any)
      .from('clusters')
      .update({ order_index: targetCluster.order_index })
      .eq('id', currentCluster.id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: error2 } = await (supabase as any)
      .from('clusters')
      .update({ order_index: currentCluster.order_index })
      .eq('id', targetCluster.id);

    if (error1 || error2) {
      console.error('Error reordering clusters:', error1 || error2);
    } else {
      fetchClusters();
    }
  }

  const filteredClusters = clusters.filter((cluster) =>
    cluster.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clusters</h1>
          <p className="text-gray-600">Kelola cluster dan kategori IARK</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-iark-red text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Cluster</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari cluster..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
          />
        </div>
      </div>

      {/* Clusters Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-iark-red" />
          </div>
        ) : filteredClusters.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Short Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Color
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Icon
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClusters.map((cluster, index) => (
                <tr key={cluster.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveCluster(cluster.id, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveCluster(cluster.id, 'down')}
                        disabled={index === filteredClusters.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-gray-500 ml-1">
                        {cluster.order_index ?? '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{cluster.name}</div>
                    {cluster.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {cluster.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{cluster.short_name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {cluster.color ? (
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colorStyles[cluster.color]}`}
                      >
                        {cluster.color}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{cluster.icon || '-'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal(cluster)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCluster(cluster.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center">
            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Tidak ada cluster ditemukan</p>
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
                  {editingCluster ? 'Edit Cluster' : 'Tambah Cluster'}
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
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Cluster *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
                />
              </div>

              {/* Short Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Name *
                </label>
                <input
                  type="text"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
                />
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

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon (Lucide icon name)
                </label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="e.g., Layers, Users, Settings"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value as 'red' | 'blue' | 'yellow' | '')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
                >
                  <option value="">Pilih warna</option>
                  <option value="red">Red</option>
                  <option value="blue">Blue</option>
                  <option value="yellow">Yellow</option>
                </select>
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
                onClick={saveCluster}
                disabled={saving}
                className="px-4 py-2 bg-iark-red text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </span>
                ) : (
                  'Simpan'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
