'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { fetchAllUsers } from '@/lib/queries/dashboard';
import { queryKeys, staleTime } from '@/lib/queries';
import type { Profile } from '@/lib/supabase/types';
import { REGIONAL_OPTIONS, ANGKATAN_OPTIONS } from '@/lib/constants/regional';
import {
  Search,
  Shield,
  ShieldOff,
  User,
  Mail,
  Calendar,
  GraduationCap,
  Download,
  X,
} from 'lucide-react';

const ASRAMA_OPTIONS = [
  'Bogor',
  'Makassar',
  'Yogyakarta',
  'Surabaya',
  'Malang',
  'Bandung',
  'Jakarta',
];

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'alumni'>('all');
  const [angkatanFilter, setAngkatanFilter] = useState<string>('');
  const [regionalFilter, setRegionalFilter] = useState<string>('');
  const [asramaFilter, setAsramaFilter] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery<Profile[]>({
    queryKey: [...queryKeys.profiles, roleFilter],
    queryFn: () => fetchAllUsers(roleFilter === 'all' ? undefined : roleFilter),
    staleTime: staleTime.semiDynamic,
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles });
    },
  });

  function toggleAdminRole(userId: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'alumni' : 'admin';
    const action = newRole === 'admin' ? 'menjadikan admin' : 'mencabut hak admin';

    if (!confirm(`Apakah Anda yakin ingin ${action} user ini?`)) return;

    updateRoleMutation.mutate(
      { userId, newRole },
      {
        onError: () => {
          alert('Gagal mengubah role user');
        },
      }
    );
  }

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !searchQuery ||
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.kampus?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAngkatan =
        !angkatanFilter || user.angkatan?.toString() === angkatanFilter;

      const matchesRegional =
        !regionalFilter || user.regional === regionalFilter;

      const matchesAsrama =
        !asramaFilter || user.asrama === asramaFilter;

      return matchesSearch && matchesAngkatan && matchesRegional && matchesAsrama;
    });
  }, [users, searchQuery, angkatanFilter, regionalFilter, asramaFilter]);

  const hasActiveFilters = angkatanFilter || regionalFilter || asramaFilter;

  function clearFilters() {
    setAngkatanFilter('');
    setRegionalFilter('');
    setAsramaFilter('');
  }

  function exportToCSV() {
    const headers = ['Nama', 'Email', 'Angkatan', 'Regional', 'Asrama', 'Kampus', 'Phone', 'Role', 'Bergabung'];
    const rows = filteredUsers.map((user) => [
      user.name || '',
      user.email || '',
      user.angkatan?.toString() || '',
      REGIONAL_OPTIONS.find((r) => r.value === user.regional)?.label || user.regional || '',
      user.asrama || '',
      user.kampus || '',
      user.phone || '',
      user.role || '',
      new Date(user.created_at).toLocaleDateString('id-ID'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Kelola user dan hak akses</p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={filteredUsers.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
        {/* Search Row */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama, email, atau kampus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-iark-red focus:border-transparent"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-iark-red focus:border-transparent"
          >
            <option value="all">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="alumni">Alumni</option>
          </select>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-500 font-medium">Filter:</span>
          
          <select
            value={angkatanFilter}
            onChange={(e) => setAngkatanFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-iark-red focus:border-transparent"
          >
            <option value="">Semua Angkatan</option>
            {ANGKATAN_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={regionalFilter}
            onChange={(e) => setRegionalFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-iark-red focus:border-transparent"
          >
            <option value="">Semua Regional</option>
            {REGIONAL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={asramaFilter}
            onChange={(e) => setAsramaFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-iark-red focus:border-transparent"
          >
            <option value="">Semua Asrama</option>
            {ASRAMA_OPTIONS.map((asrama) => (
              <option key={asrama} value={asrama}>
                {asrama}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-500">
          Menampilkan {filteredUsers.length} dari {users.length} user
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-iark-red" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Angkatan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Bergabung
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-iark-red/10 flex items-center justify-center flex-shrink-0">
                          {user.photo ? (
                            <img
                              src={user.photo}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-iark-red" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {user.name || 'No Name'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.angkatan ? (
                        <div className="flex items-center gap-2 text-gray-600">
                          <GraduationCap className="w-4 h-4" />
                          <span>{user.angkatan}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-700'
                          }`}
                      >
                        {user.role === 'admin' ? (
                          <Shield className="w-3.5 h-3.5" />
                        ) : (
                          <User className="w-3.5 h-3.5" />
                        )}
                        {user.role === 'admin' ? 'Admin' : 'Alumni'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(user.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => toggleAdminRole(user.id, user.role)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${user.role === 'admin'
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-purple-600 hover:bg-purple-50'
                            }`}
                          title={user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        >
                          {user.role === 'admin' ? (
                            <>
                              <ShieldOff className="w-4 h-4" />
                              <span>Remove Admin</span>
                            </>
                          ) : (
                            <>
                              <Shield className="w-4 h-4" />
                              <span>Make Admin</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Tidak ada user ditemukan</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">Admin</p>
          <p className="text-2xl font-bold text-purple-600">
            {users.filter((u) => u.role === 'admin').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">Alumni</p>
          <p className="text-2xl font-bold text-gray-600">
            {users.filter((u) => u.role === 'alumni').length}
          </p>
        </div>
      </div>
    </div>
  );
}
