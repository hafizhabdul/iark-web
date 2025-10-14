'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import { FinancialReportModal } from './FinancialReportModal';
import { Users, Target, TrendingUp, Building2, Lightbulb, GraduationCap, Handshake, Sparkles, BarChart3, Settings, Calendar } from 'lucide-react';

export interface DonasiPageSectionProps {
  className?: string;
}

const donationTiers = [
  {
    id: 'silver',
    name: 'Silver Supporter',
    price: 'Rp 100,000',
    period: '/ bulan',
    color: 'gray',
    benefits: [
      'Newsletter eksklusif bulanan',
      'Akses ke komunitas alumni online',
      'Update program dan kegiatan',
      'E-certificate sebagai supporter',
    ],
    recommended: false,
  },
  {
    id: 'gold',
    name: 'Gold Supporter',
    price: 'Rp 500,000',
    period: '/ bulan',
    color: 'yellow',
    benefits: [
      'Semua benefit Silver Supporter',
      'Merchandise eksklusif IARK',
      'Undangan ke event tahunan',
      'Prioritas networking session',
      'Laporan dampak tahunan personal',
    ],
    recommended: true,
  },
  {
    id: 'platinum',
    name: 'Platinum Supporter',
    price: 'Rp 1,000,000+',
    period: '/ bulan',
    color: 'blue',
    benefits: [
      'Semua benefit Gold Supporter',
      'Nama tercantum di wall of fame',
      'Akses ke strategic planning meeting',
      'Mentorship session dengan pengurus',
      'Custom program support opportunity',
      'VIP seating di event besar',
    ],
    recommended: false,
  },
];

const faqData = [
  {
    question: 'Apakah donasi saya tax-deductible?',
    answer: 'Ya, IARK terdaftar sebagai organisasi non-profit. Kami akan menyediakan bukti donasi yang dapat digunakan untuk keperluan pajak Anda.',
  },
  {
    question: 'Bagaimana cara saya memantau penggunaan dana?',
    answer: 'Kami menerbitkan laporan keuangan transparan setiap kuartal yang dapat diakses oleh semua donatur. Anda juga akan menerima update reguler tentang program-program yang didanai.',
  },
  {
    question: 'Bisakah saya membatalkan donasi bulanan?',
    answer: 'Tentu saja. Anda dapat membatalkan atau mengubah paket donasi bulanan kapan saja melalui dashboard member Anda atau dengan menghubungi tim kami.',
  },
  {
    question: 'Apakah ada minimum donasi?',
    answer: 'Tidak ada minimum donasi untuk one-time contribution. Untuk donasi bulanan, paket terendah dimulai dari Rp 100,000/bulan, namun Anda bebas menentukan nominal custom.',
  },
  {
    question: 'Bagaimana cara donasi untuk program spesifik?',
    answer: 'Anda dapat memilih program spesifik yang ingin Anda dukung saat melakukan donasi, seperti program beasiswa, pelatihan kepemimpinan, atau program bidang tertentu.',
  },
];

export function DonasiPageSection({ className = '' }: DonasiPageSectionProps) {
  const [donationType, setDonationType] = useState<'monthly' | 'onetime'>('monthly');
  const [customAmount, setCustomAmount] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={`relative bg-white overflow-hidden ${className}`}>
      {/* Subtle gradient orbs background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-iark-red/5 rounded-full blur-3xl" />

      {/* Decorative small elements */}
      <div className="absolute top-32 left-1/4 w-10 h-10 bg-iark-red rounded-full opacity-20 animate-pulse-slow" />
      <div className="absolute top-2/3 right-16 w-8 h-8 bg-iark-yellow rounded-full opacity-20 animate-drift" />
      <div className="absolute bottom-1/4 left-20 w-12 h-12 bg-iark-blue rounded-full opacity-30 animate-pulse-slow" />

      <div className="relative z-10">
        {/* Impact Statistics Section */}
        <section className="py-16 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Users, number: '1,500+', label: 'Alumni Terjangkau', color: 'text-blue-600' },
                { icon: Target, number: '50+', label: 'Program per Tahun', color: 'text-red-600' },
                { icon: TrendingUp, number: 'Rp 500 Juta+', label: 'Dana Terkumpul', color: 'text-green-600' },
                { icon: Building2, number: '12', label: 'Bidang Aktif', color: 'text-purple-600' },
              ].map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className={`${stat.color} mb-3 flex justify-center`}>
                      <IconComponent size={48} strokeWidth={1.5} />
                    </div>
                    <div className="text-3xl font-bold text-iark-red mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Donate Section */}
        <section className="py-16 px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Mengapa Berdonasi?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Kontribusi Anda membantu kami menciptakan dampak nyata bagi ribuan alumni RK
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Lightbulb,
                  title: 'Program Pengembangan',
                  description: 'Workshop, training, dan seminar untuk skill development alumni',
                  color: 'text-amber-600',
                  bgColor: 'bg-amber-50',
                },
                {
                  icon: GraduationCap,
                  title: 'Beasiswa & Pendampingan',
                  description: 'Bantuan pendidikan dan mentoring untuk alumni yang membutuhkan',
                  color: 'text-blue-600',
                  bgColor: 'bg-blue-50',
                },
                {
                  icon: Handshake,
                  title: 'Jaringan & Kolaborasi',
                  description: 'Platform networking dan kolaborasi antar alumni di berbagai bidang',
                  color: 'text-purple-600',
                  bgColor: 'bg-purple-50',
                },
                {
                  icon: Sparkles,
                  title: 'Dampak Sosial',
                  description: 'Program pengabdian masyarakat dan social impact projects',
                  color: 'text-green-600',
                  bgColor: 'bg-green-50',
                },
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:-translate-y-1"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className={`${item.bgColor} ${item.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
                      <IconComponent size={28} strokeWidth={2} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Donation Tiers Section */}
        <section className="py-16 px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Pilih Paket Donasi
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                Setiap kontribusi membuat perbedaan. Pilih paket yang sesuai dengan kemampuan Anda
              </p>

              {/* Toggle Monthly/One-time */}
              <div className="flex justify-center gap-4 mb-8">
                <button
                  onClick={() => setDonationType('monthly')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    donationType === 'monthly'
                      ? 'bg-iark-red text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-iark-red'
                  }`}
                >
                  Donasi Bulanan
                </button>
                <button
                  onClick={() => setDonationType('onetime')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    donationType === 'onetime'
                      ? 'bg-iark-red text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-iark-red'
                  }`}
                >
                  Donasi Sekali
                </button>
              </div>
            </motion.div>

            {/* Donation Tier Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {donationTiers.map((tier, index) => (
                <motion.div
                  key={tier.id}
                  className={`relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                    tier.recommended
                      ? 'border-iark-yellow shadow-xl scale-105'
                      : 'border-gray-200 hover:border-iark-red'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {tier.recommended && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                        ⭐ Paling Populer
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <div className="text-4xl font-bold text-iark-red mb-1">{tier.price}</div>
                    <div className="text-gray-600">{tier.period}</div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <svg
                          className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
                      tier.recommended
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg'
                        : 'bg-iark-red text-white hover:bg-red-700'
                    }`}
                  >
                    Pilih Paket
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Custom Amount Option */}
            <motion.div
              className="max-w-2xl mx-auto bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Atau Tentukan Nominal Sendiri
              </h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Masukkan nominal (misal: 250000)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iark-red focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <button className="px-8 py-3 bg-iark-blue text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-300">
                  Donasi
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Payment Methods Section */}
        <section className="py-16 px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Metode Pembayaran
              </h2>
              <p className="text-lg text-gray-600">
                Kami menerima berbagai metode pembayaran untuk kemudahan Anda
              </p>
            </motion.div>

            {/* Single Unified Card */}
            <motion.div
              className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200 max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {/* Kartu & QRIS */}
              <div className="mb-10">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Kartu & QRIS
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                    <Image
                      src="/images/payment-methods/cards/qris.svg"
                      alt="QRIS"
                      width={100}
                      height={45}
                      className="object-contain"
                    />
                  </div>
                  <div className="bg-white rounded-lg p-4 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                    <Image
                      src="/images/payment-methods/cards/mastercard.svg"
                      alt="Mastercard"
                      width={70}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div className="bg-white rounded-lg p-4 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                    <Image
                      src="/images/payment-methods/cards/visa.svg"
                      alt="Visa"
                      width={70}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-8"></div>

              {/* Transfer Bank */}
              <div className="mb-10">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Transfer Bank
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'BCA', src: '/images/payment-methods/banks/bca.svg' },
                    { name: 'BNI', src: '/images/payment-methods/banks/bni.svg' },
                    { name: 'BRI', src: '/images/payment-methods/banks/bri.svg' },
                    { name: 'Mandiri', src: '/images/payment-methods/banks/mandiri.svg' },
                  ].map((bank) => (
                    <div
                      key={bank.name}
                      className="bg-white rounded-lg p-4 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                    >
                      <Image
                        src={bank.src}
                        alt={bank.name}
                        width={80}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-8"></div>

              {/* E-Wallet */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  E-Wallet
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'GoPay', src: '/images/payment-methods/e-wallets/gopay.svg' },
                    { name: 'OVO', src: '/images/payment-methods/e-wallets/ovo.webp' },
                    { name: 'Dana', src: '/images/payment-methods/e-wallets/dana.webp' },
                    { name: 'LinkAja', src: '/images/payment-methods/e-wallets/linkaja.webp' },
                  ].map((wallet) => (
                    <div
                      key={wallet.name}
                      className="bg-white rounded-lg p-4 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                    >
                      <Image
                        src={wallet.src}
                        alt={wallet.name}
                        width={80}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Transparency Section */}
        <section className="py-16 px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold mb-4">
                ✓ 100% Transparan
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Alokasi Dana Donasi
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Setiap rupiah yang Anda donasikan dikelola dengan penuh tanggung jawab
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                {
                  percentage: '60%',
                  label: 'Program Development',
                  amount: 'Rp 360M',
                  description: 'Workshop, pelatihan, dan pengembangan skill',
                  color: 'text-red-600',
                  bgColor: 'bg-red-50',
                  ringColor: 'stroke-red-600',
                  icon: Lightbulb,
                },
                {
                  percentage: '25%',
                  label: 'Scholarships',
                  amount: 'Rp 150M',
                  description: 'Beasiswa pendidikan dan mentoring',
                  color: 'text-blue-600',
                  bgColor: 'bg-blue-50',
                  ringColor: 'stroke-blue-600',
                  icon: GraduationCap,
                },
                {
                  percentage: '10%',
                  label: 'Operations',
                  amount: 'Rp 60M',
                  description: 'Operasional dan administrasi',
                  color: 'text-amber-600',
                  bgColor: 'bg-amber-50',
                  ringColor: 'stroke-amber-600',
                  icon: Settings,
                },
                {
                  percentage: '5%',
                  label: 'Events',
                  amount: 'Rp 30M',
                  description: 'Event dan kegiatan alumni',
                  color: 'text-green-600',
                  bgColor: 'bg-green-50',
                  ringColor: 'stroke-green-600',
                  icon: Calendar,
                },
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {/* Icon */}
                    <div className={`${item.bgColor} ${item.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                      <IconComponent size={24} strokeWidth={2} />
                    </div>

                    {/* Ring Chart */}
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        {/* Background circle */}
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="12"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          fill="none"
                          className={item.ringColor}
                          strokeWidth="12"
                          strokeDasharray={`${parseInt(item.percentage) * 3.14} 314`}
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Percentage in center */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-3xl font-bold ${item.color}`}>{item.percentage}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-gray-900 mb-1 text-center">{item.label}</h3>
                    <p className={`text-xl font-bold ${item.color} mb-2 text-center`}>{item.amount}</p>
                    <p className="text-sm text-gray-600 text-center">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-iark-blue text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors shadow-md hover:shadow-lg"
              >
                <BarChart3 size={20} strokeWidth={2} />
                Lihat Laporan Keuangan Lengkap
              </button>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Pertanyaan yang Sering Diajukan
              </h2>
            </motion.div>

            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                        openFaqIndex === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaqIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 text-gray-600">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="bg-gradient-to-br from-iark-red to-iark-blue text-white rounded-2xl p-12 text-center shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Mulai Berkontribusi Hari Ini
              </h2>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                Setiap kontribusi Anda membuat perbedaan nyata untuk alumni RK dan Indonesia yang lebih baik
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-iark-red px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg">
                  Donasi Sekarang
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-iark-red transition-all duration-200">
                  Hubungi Kami
                </button>
              </div>
              <p className="text-sm mt-6 opacity-90">
                Untuk donasi korporat atau partnership, silakan hubungi tim kami
              </p>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Financial Report Modal */}
      <FinancialReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
