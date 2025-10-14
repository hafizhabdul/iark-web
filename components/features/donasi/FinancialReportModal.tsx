'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export interface FinancialReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Sample Financial Data
const monthlyData = [
  { month: 'Jan', income: 45000000, expenses: 38000000, donations: 42000000 },
  { month: 'Feb', income: 52000000, expenses: 41000000, donations: 48000000 },
  { month: 'Mar', income: 48000000, expenses: 39000000, donations: 45000000 },
  { month: 'Apr', income: 55000000, expenses: 43000000, donations: 52000000 },
  { month: 'May', income: 58000000, expenses: 45000000, donations: 55000000 },
  { month: 'Jun', income: 62000000, expenses: 48000000, donations: 59000000 },
  { month: 'Jul', income: 60000000, expenses: 46000000, donations: 57000000 },
  { month: 'Aug', income: 65000000, expenses: 50000000, donations: 62000000 },
  { month: 'Sep', income: 63000000, expenses: 49000000, donations: 60000000 },
  { month: 'Oct', income: 68000000, expenses: 52000000, donations: 65000000 },
  { month: 'Nov', income: 70000000, expenses: 54000000, donations: 67000000 },
  { month: 'Dec', income: 75000000, expenses: 58000000, donations: 72000000 },
];

const programSpending = [
  { name: 'Program Development', value: 360000000, percentage: 60 },
  { name: 'Scholarships', value: 150000000, percentage: 25 },
  { name: 'Operations', value: 60000000, percentage: 10 },
  { name: 'Events', value: 30000000, percentage: 5 },
];

const quarterlyData = [
  { quarter: 'Q1 2024', revenue: 145000000, expenses: 118000000, surplus: 27000000 },
  { quarter: 'Q2 2024', revenue: 175000000, expenses: 136000000, surplus: 39000000 },
  { quarter: 'Q3 2024', revenue: 188000000, expenses: 145000000, surplus: 43000000 },
  { quarter: 'Q4 2024', revenue: 213000000, expenses: 164000000, surplus: 49000000 },
];

const COLORS = ['#E21C24', '#2E3192', '#FFD200', '#10B981'];

const formatRupiah = (value: number) => {
  return `Rp ${(value / 1000000).toFixed(0)}M`;
};

export function FinancialReportModal({ isOpen, onClose }: FinancialReportModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto my-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Laporan Keuangan IARK 2024
                    </h2>
                    <p className="text-gray-600">Transparansi penuh penggunaan dana donasi</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Close modal"
                  >
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-6 space-y-8">
                {/* Summary Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="text-green-600 text-sm font-semibold mb-2">Total Donasi 2024</div>
                    <div className="text-3xl font-bold text-green-900">Rp 721M</div>
                    <div className="text-green-600 text-sm mt-2">↑ 23% dari 2023</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="text-blue-600 text-sm font-semibold mb-2">Total Pengeluaran</div>
                    <div className="text-3xl font-bold text-blue-900">Rp 563M</div>
                    <div className="text-blue-600 text-sm mt-2">Program & Operasional</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="text-purple-600 text-sm font-semibold mb-2">Surplus</div>
                    <div className="text-3xl font-bold text-purple-900">Rp 158M</div>
                    <div className="text-purple-600 text-sm mt-2">Untuk cadangan & investasi</div>
                  </div>
                </div>

                {/* Monthly Income vs Expenses */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Pendapatan vs Pengeluaran Bulanan
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" tickFormatter={formatRupiah} />
                      <Tooltip
                        formatter={(value: number) => formatRupiah(value)}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="income" name="Pendapatan" fill="#10B981" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="expenses" name="Pengeluaran" fill="#E21C24" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Donation Trends */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Tren Donasi 2024
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2E3192" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#2E3192" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" tickFormatter={formatRupiah} />
                      <Tooltip
                        formatter={(value: number) => formatRupiah(value)}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="donations"
                        name="Donasi"
                        stroke="#2E3192"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorDonations)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Program Spending Distribution */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Pie Chart */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Distribusi Alokasi Dana
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={programSpending}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name} (${percentage}%)`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {programSpending.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatRupiah(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Breakdown Table */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Detail Alokasi
                    </h3>
                    <div className="space-y-3">
                      {programSpending.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: COLORS[index] }}
                            />
                            <span className="font-medium text-gray-900">{item.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">{formatRupiah(item.value)}</div>
                            <div className="text-sm text-gray-600">{item.percentage}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quarterly Performance */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Performa Kuartalan 2024
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={quarterlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="quarter" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" tickFormatter={formatRupiah} />
                      <Tooltip
                        formatter={(value: number) => formatRupiah(value)}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Pendapatan"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="expenses"
                        name="Pengeluaran"
                        stroke="#E21C24"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="surplus"
                        name="Surplus"
                        stroke="#2E3192"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Footer Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <h4 className="font-bold text-blue-900 mb-1">Catatan Audit</h4>
                      <p className="text-blue-800 text-sm">
                        Laporan keuangan ini telah diaudit oleh KAP independen dan tersedia untuk
                        diunduh. Untuk pertanyaan lebih lanjut, silakan hubungi tim keuangan IARK.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-8 py-6 rounded-b-2xl">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Terakhir diperbarui: Desember 2024
                  </p>
                  <div className="flex gap-3">
                    <button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                      Download PDF
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-2 bg-iark-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
