'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { 
  ArrowLeft, 
  Search, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock,
  Users,
  Mail,
  Phone,
  Loader2,
  CheckSquare,
  Square,
} from 'lucide-react';

interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  angkatan: number | null;
  asrama: string | null;
  organization: string | null;
  status: string;
  registered_at: string;
}

interface EventInfo {
  id: string;
  title: string;
  date: string;
  max_participants: number | null;
}

export default function EventRegistrationsPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<EventInfo | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [eventId]);

  async function fetchData() {
    const supabase = createClient();

    // Fetch event info
    const { data: eventData } = await supabase
      .from('events')
      .select('id, title, date, max_participants')
      .eq('id', eventId)
      .single();

    if (eventData) {
      setEvent(eventData);
    }

    // Fetch registrations
    const { data: regsData, error } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId)
      .order('registered_at', { ascending: false });

    if (error) {
      console.error('Error fetching registrations:', error);
    } else {
      setRegistrations(regsData || []);
    }

    setLoading(false);
  }

  async function updateStatus(regId: string, newStatus: string) {
    const supabase = createClient();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('event_registrations')
      .update({ status: newStatus })
      .eq('id', regId);

    if (error) {
      console.error('Error updating status:', error);
      alert('Gagal mengupdate status');
    } else {
      setRegistrations(prev =>
        prev.map(reg =>
          reg.id === regId ? { ...reg, status: newStatus } : reg
        )
      );
    }
  }

  async function bulkUpdateStatus(newStatus: string) {
    if (selectedIds.size === 0) return;
    
    const action = newStatus === 'confirmed' ? 'konfirmasi' : newStatus === 'cancelled' ? 'batalkan' : 'update';
    if (!confirm(`Apakah Anda yakin ingin ${action} ${selectedIds.size} pendaftar?`)) return;

    setBulkActionLoading(true);
    const supabase = createClient();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('event_registrations')
      .update({ status: newStatus })
      .in('id', Array.from(selectedIds));

    if (error) {
      console.error('Error bulk updating:', error);
      alert('Gagal mengupdate status');
    } else {
      setRegistrations(prev =>
        prev.map(reg =>
          selectedIds.has(reg.id) ? { ...reg, status: newStatus } : reg
        )
      );
      setSelectedIds(new Set());
    }
    setBulkActionLoading(false);
  }

  function toggleSelectAll() {
    if (selectedIds.size === filteredRegistrations.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRegistrations.map(r => r.id)));
    }
  }

  function toggleSelect(id: string) {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  }

  function exportToCSV() {
    const headers = ['Nama', 'Email', 'Phone', 'Angkatan', 'Asrama', 'Instansi', 'Status', 'Tanggal Daftar'];
    const rows = registrations.map(reg => [
      reg.full_name,
      reg.email,
      reg.phone || '',
      reg.angkatan?.toString() || '',
      reg.asrama || '',
      reg.organization || '',
      reg.status,
      new Date(reg.registered_at).toLocaleString('id-ID'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `registrations-${event?.title || eventId}.csv`;
    link.click();
  }

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch =
      reg.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || reg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    registered: registrations.filter(r => r.status === 'registered').length,
    confirmed: registrations.filter(r => r.status === 'confirmed').length,
    cancelled: registrations.filter(r => r.status === 'cancelled').length,
    attended: registrations.filter(r => r.status === 'attended').length,
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      registered: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      attended: 'bg-blue-100 text-blue-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-iark-red" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/events"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Events
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Registrasi: {event?.title}
          </h1>
          <p className="text-gray-600">
            {new Date(event?.date || '').toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-gray-400" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{registrations.length}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.registered}</p>
              <p className="text-sm text-gray-600">Terdaftar</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.confirmed}</p>
              <p className="text-sm text-gray-600">Konfirmasi</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.attended}</p>
              <p className="text-sm text-gray-600">Hadir</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.cancelled}</p>
              <p className="text-sm text-gray-600">Batal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
          >
            <option value="">Semua Status</option>
            <option value="registered">Terdaftar</option>
            <option value="confirmed">Konfirmasi</option>
            <option value="attended">Hadir</option>
            <option value="cancelled">Batal</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-700">
              {selectedIds.size} dipilih
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => bulkUpdateStatus('confirmed')}
                disabled={bulkActionLoading}
                className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Konfirmasi
              </button>
              <button
                onClick={() => bulkUpdateStatus('attended')}
                disabled={bulkActionLoading}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Tandai Hadir
              </button>
              <button
                onClick={() => bulkUpdateStatus('cancelled')}
                disabled={bulkActionLoading}
                className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Batalkan
              </button>
            </div>
            {bulkActionLoading && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={toggleSelectAll}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {selectedIds.size === filteredRegistrations.length && filteredRegistrations.length > 0 ? (
                      <CheckSquare className="w-5 h-5" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Kontak</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Info</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className={`hover:bg-gray-50 ${selectedIds.has(reg.id) ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleSelect(reg.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {selectedIds.has(reg.id) ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{reg.full_name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(reg.registered_at).toLocaleDateString('id-ID')}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                        <Mail className="w-3.5 h-3.5" />
                        {reg.email}
                      </div>
                      {reg.phone && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="w-3.5 h-3.5" />
                          {reg.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {reg.angkatan && <p>RK {reg.angkatan}</p>}
                      {reg.asrama && <p>{reg.asrama}</p>}
                      {reg.organization && <p className="truncate max-w-[150px]">{reg.organization}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadge(reg.status)}`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={reg.status}
                        onChange={(e) => updateStatus(reg.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="registered">Terdaftar</option>
                        <option value="confirmed">Konfirmasi</option>
                        <option value="attended">Hadir</option>
                        <option value="cancelled">Batal</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    {searchQuery || statusFilter
                      ? 'Tidak ada data yang cocok dengan filter'
                      : 'Belum ada pendaftar'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
