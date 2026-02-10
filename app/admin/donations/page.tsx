'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Search,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Users,
  Loader2,
  Eye,
  X,
} from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  slug: string;
}

interface Donation {
  id: string;
  order_id: string;
  amount: number;
  donor_name: string;
  donor_email: string;
  donor_phone: string | null;
  message: string | null;
  is_anonymous: boolean;
  is_guest: boolean;
  payment_status: string;
  payment_method: string | null;
  paid_at: string | null;
  created_at: string;
  campaign_id: string | null;
}

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [campaignFilter, setCampaignFilter] = useState('');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const supabase = createClient();

    // Fetch donations and campaigns in parallel
    const [donationsRes, campaignsRes] = await Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any)
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any)
        .from('donation_campaigns')
        .select('id, title, slug')
        .order('title', { ascending: true }),
    ]);

    if (donationsRes.error) {
      console.error('Error fetching donations:', donationsRes.error);
    } else {
      setDonations(donationsRes.data || []);
    }

    if (!campaignsRes.error) {
      setCampaigns(campaignsRes.data || []);
    }

    setLoading(false);
  }

  function exportToCSV() {
    const headers = ['Order ID', 'Nama', 'Email', 'Phone', 'Jumlah', 'Status', 'Metode', 'Tanggal'];
    const rows = donations.map(d => [
      d.order_id,
      d.is_anonymous ? 'Anonim' : d.donor_name,
      d.donor_email,
      d.donor_phone || '',
      d.amount.toString(),
      d.payment_status,
      d.payment_method || '',
      new Date(d.created_at).toLocaleDateString('id-ID'),
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `donations_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  const filteredDonations = donations.filter(d => {
    const matchesSearch =
      d.donor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.donor_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.order_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || d.payment_status === statusFilter;
    const matchesCampaign = !campaignFilter || d.campaign_id === campaignFilter;
    return matchesSearch && matchesStatus && matchesCampaign;
  });

  const stats = {
    total: donations.length,
    pending: donations.filter(d => d.payment_status === 'pending').length,
    paid: donations.filter(d => d.payment_status === 'paid').length,
    totalAmount: donations
      .filter(d => d.payment_status === 'paid')
      .reduce((sum, d) => sum + d.amount, 0),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'expired':
        return 'bg-gray-100 text-gray-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-iark-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donasi</h1>
          <p className="text-gray-600">Kelola donasi masuk</p>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-gray-400" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.paid}</p>
              <p className="text-sm text-gray-600">Berhasil</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-iark-red" />
            <div>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
              <p className="text-sm text-gray-600">Terkumpul</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama, email, atau order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-iark-red"
          />
        </div>
        <select
          value={campaignFilter}
          onChange={(e) => setCampaignFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-iark-red"
        >
          <option value="">Semua Kampanye</option>
          {campaigns.map(c => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-iark-red"
        >
          <option value="">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Berhasil</option>
          <option value="expired">Expired</option>
          <option value="failed">Gagal</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Donatur</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Jumlah</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tanggal</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDonations.length > 0 ? (
                filteredDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">
                        {donation.is_anonymous ? 'Anonim' : donation.donor_name}
                      </p>
                      <p className="text-xs text-gray-500">{donation.donor_email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {donation.order_id}
                      </code>
                    </td>
                    <td className="px-4 py-3 font-semibold text-iark-red">
                      {formatCurrency(donation.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadge(donation.payment_status)}`}>
                        {donation.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(donation.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedDonation(donation)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    {searchQuery || statusFilter
                      ? 'Tidak ada data yang cocok dengan filter'
                      : 'Belum ada donasi'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Detail Donasi</h3>
              <button
                onClick={() => setSelectedDonation(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono">{selectedDonation.order_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Donatur</p>
                <p className="font-medium">
                  {selectedDonation.is_anonymous ? 'Anonim' : selectedDonation.donor_name}
                  {selectedDonation.is_guest && (
                    <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Hamba Allah</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{selectedDonation.donor_email}</p>
              </div>
              {selectedDonation.donor_phone && (
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{selectedDonation.donor_phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Jumlah</p>
                <p className="text-xl font-bold text-iark-red">
                  {formatCurrency(selectedDonation.amount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${getStatusBadge(selectedDonation.payment_status)}`}>
                  {selectedDonation.payment_status}
                </span>
              </div>
              {selectedDonation.payment_method && (
                <div>
                  <p className="text-sm text-gray-500">Metode Pembayaran</p>
                  <p>{selectedDonation.payment_method}</p>
                </div>
              )}
              {selectedDonation.message && (
                <div>
                  <p className="text-sm text-gray-500">Pesan</p>
                  <p className="italic text-gray-700">&ldquo;{selectedDonation.message}&rdquo;</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Dibuat</p>
                <p>{new Date(selectedDonation.created_at).toLocaleString('id-ID')}</p>
              </div>
              {selectedDonation.paid_at && (
                <div>
                  <p className="text-sm text-gray-500">Dibayar</p>
                  <p>{new Date(selectedDonation.paid_at).toLocaleString('id-ID')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
