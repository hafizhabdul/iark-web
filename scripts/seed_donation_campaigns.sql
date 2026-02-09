-- Seed file for donation campaigns and sample donations
-- Run with: psql -d your_database -f scripts/seed_donation_campaigns.sql

-- ============================================
-- DONATION CAMPAIGNS
-- ============================================

INSERT INTO donation_campaigns (
  slug, title, description, content, target_amount, is_featured, is_active
) VALUES
(
  'donasi-umum',
  'Donasi Umum IARK',
  'Program donasi umum untuk mendukung kegiatan IARK',
  '## Donasi Umum IARK

Donasi umum digunakan untuk mendukung berbagai kegiatan dan program IARK, termasuk:

- Kegiatan sosial dan kemanusiaan
- Program pemberdayaan masyarakat
- Operasional organisasi
- Event dan gathering alumni

Setiap kontribusi Anda sangat berarti bagi keberlangsungan misi IARK.',
  100000000,
  true,
  true
),
(
  'beasiswa-adik-asuh',
  'Beasiswa Adik Asuh RK',
  'Membantu biaya pendidikan adik-adik asuh Rumah Kepemimpinan',
  '## Program Beasiswa Adik Asuh RK

Program ini bertujuan untuk membantu biaya pendidikan adik-adik asuh yang dibina oleh Rumah Kepemimpinan.

### Alokasi Dana

- **70%** - Biaya pendidikan (SPP, buku, seragam)
- **20%** - Biaya hidup dan transportasi
- **10%** - Dana darurat dan kegiatan pengembangan diri

### Dampak Donasi Anda

Dengan berdonasi Rp 500.000/bulan, Anda dapat membantu satu adik asuh melanjutkan pendidikannya.

> "Pendidikan adalah senjata paling ampuh untuk mengubah dunia." - Nelson Mandela

Jadilah bagian dari perubahan!',
  50000000,
  true,
  true
),
(
  'renovasi-rk-bogor',
  'Renovasi Gedung RK Bogor',
  'Mendukung renovasi dan perbaikan fasilitas RK Bogor',
  '## Renovasi Gedung RK Bogor

Gedung RK Bogor membutuhkan renovasi untuk meningkatkan kenyamanan dan keamanan bagi para penghuni.

### Rencana Renovasi

1. **Perbaikan Atap** - Mengatasi kebocoran di beberapa titik
2. **Renovasi Kamar Mandi** - Upgrade fasilitas sanitasi
3. **Pengecatan Ulang** - Memperbaharui tampilan gedung
4. **Perbaikan Listrik** - Upgrade instalasi listrik yang sudah tua

### Timeline

- Fase 1: Januari - Februari 2024
- Fase 2: Maret - April 2024
- Fase 3: Mei 2024 (finishing)

Mari berkontribusi untuk rumah kedua adik-adik RK!',
  200000000,
  false,
  true
),
(
  'wakaf-alquran',
  'Wakaf Al-Quran',
  'Wakaf mushaf Al-Quran untuk masjid dan pesantren',
  '## Program Wakaf Al-Quran

Wakaf Al-Quran adalah program penyaluran mushaf Al-Quran ke masjid-masjid dan pesantren yang membutuhkan.

### Jenis Mushaf

- **Al-Quran Standar** - Rp 50.000/eksemplar
- **Al-Quran Tajwid** - Rp 75.000/eksemplar
- **Al-Quran Terjemah** - Rp 100.000/eksemplar

### Penerima Manfaat

- Masjid di daerah terpencil
- Pesantren dan TPQ
- Rumah tahfidz
- Lembaga dakwah

### Keutamaan Wakaf Al-Quran

Rasulullah SAW bersabda:
> "Sebaik-baik kalian adalah yang mempelajari Al-Quran dan mengajarkannya." (HR. Bukhari)

Setiap kali Al-Quran wakaf Anda dibaca, pahalanya akan terus mengalir.',
  25000000,
  true,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  target_amount = EXCLUDED.target_amount,
  is_featured = EXCLUDED.is_featured,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- ============================================
-- SAMPLE DONATIONS
-- ============================================

-- Get campaign IDs (for reference in donations)
-- We'll use subqueries to get the campaign IDs

-- Donations for "Donasi Umum IARK"
INSERT INTO donations (
  campaign_id, donor_name, donor_email, amount, message, is_anonymous, payment_status, paid_at
) VALUES
(
  (SELECT id FROM donation_campaigns WHERE slug = 'donasi-umum'),
  'Ahmad Rizki',
  'ahmad.rizki@example.com',
  500000,
  'Semoga bermanfaat untuk kegiatan IARK',
  false,
  'paid',
  NOW() - INTERVAL '5 days'
),
(
  (SELECT id FROM donation_campaigns WHERE slug = 'donasi-umum'),
  'Siti Nurhaliza',
  'siti.nur@example.com',
  1000000,
  'Sukses terus IARK!',
  false,
  'paid',
  NOW() - INTERVAL '3 days'
),
(
  (SELECT id FROM donation_campaigns WHERE slug = 'donasi-umum'),
  'Hamba Allah',
  'anonymous1@example.com',
  2500000,
  NULL,
  true,
  'paid',
  NOW() - INTERVAL '2 days'
),
(
  (SELECT id FROM donation_campaigns WHERE slug = 'donasi-umum'),
  'Budi Santoso',
  'budi.santoso@example.com',
  750000,
  'Untuk kemajuan IARK',
  false,
  'paid',
  NOW() - INTERVAL '1 day'
),

-- Donations for "Beasiswa Adik Asuh RK"
(
  (SELECT id FROM donation_campaigns WHERE slug = 'beasiswa-adik-asuh'),
  'Dr. Hendra Wijaya',
  'hendra.w@example.com',
  5000000,
  'Semoga adik-adik sukses dalam pendidikannya',
  false,
  'paid',
  NOW() - INTERVAL '7 days'
),
(
  (SELECT id FROM donation_campaigns WHERE slug = 'beasiswa-adik-asuh'),
  'Hamba Allah',
  'anonymous2@example.com',
  1500000,
  'Untuk masa depan adik-adik',
  true,
  'paid',
  NOW() - INTERVAL '4 days'
),
(
  (SELECT id FROM donation_campaigns WHERE slug = 'beasiswa-adik-asuh'),
  'Maya Putri',
  'maya.putri@example.com',
  500000,
  'Semangat belajar adik-adik!',
  false,
  'paid',
  NOW() - INTERVAL '2 days'
),
(
  (SELECT id FROM donation_campaigns WHERE slug = 'beasiswa-adik-asuh'),
  'Keluarga Bapak Surya',
  'surya.family@example.com',
  2000000,
  'Dari keluarga kami untuk pendidikan anak bangsa',
  false,
  'paid',
  NOW() - INTERVAL '1 day'
),

-- Donations for "Renovasi Gedung RK Bogor"
(
  (SELECT id FROM donation_campaigns WHERE slug = 'renovasi-rk-bogor'),
  'PT Berkah Jaya',
  'donasi@berkahjaya.co.id',
  10000000,
  'CSR perusahaan untuk renovasi RK Bogor',
  false,
  'paid',
  NOW() - INTERVAL '10 days'
),
(
  (SELECT id FROM donation_campaigns WHERE slug = 'renovasi-rk-bogor'),
  'Alumni RK Angkatan 5',
  'alumni.rk5@example.com',
  7500000,
  'Patungan alumni angkatan 5',
  false,
  'paid',
  NOW() - INTERVAL '6 days'
),
(
  (SELECT id FROM donation_campaigns WHERE slug = 'renovasi-rk-bogor'),
  'Hamba Allah',
  'anonymous3@example.com',
  3000000,
  NULL,
  true,
  'paid',
  NOW() - INTERVAL '3 days'
),

-- Donations for "Wakaf Al-Quran"
(
  (SELECT id FROM donation_campaigns WHERE slug = 'wakaf-alquran'),
  'H. Muhammad Yusuf',
  'h.yusuf@example.com',
  1000000,
  'Wakaf untuk 20 mushaf Al-Quran',
  false,
  'paid',
  NOW() - INTERVAL '8 days'
),
(
  (SELECT id FROM donation_campaigns WHERE slug = 'wakaf-alquran'),
  'Ibu Fatimah',
  'fatimah@example.com',
  500000,
  'Semoga menjadi amal jariyah',
  false,
  'paid',
  NOW() - INTERVAL '5 days'
),
(
  (SELECT id FROM donation_campaigns WHERE slug = 'wakaf-alquran'),
  'Hamba Allah',
  'anonymous4@example.com',
  750000,
  'Lillahi taala',
  true,
  'paid',
  NOW() - INTERVAL '2 days'
),
(
  (SELECT id FROM donation_campaigns WHERE slug = 'wakaf-alquran'),
  'Keluarga Alm. Bapak Rahmat',
  'rahmat.family@example.com',
  2000000,
  'Wakaf atas nama Alm. Bapak Rahmat',
  false,
  'paid',
  NOW() - INTERVAL '1 day'
),
(
  (SELECT id FROM donation_campaigns WHERE slug = 'wakaf-alquran'),
  'Ustadz Ahmad Fauzi',
  'ustadz.fauzi@example.com',
  300000,
  'Semoga bermanfaat',
  false,
  'paid',
  NOW() - INTERVAL '12 hours'
)
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION QUERY
-- ============================================

-- Progress is calculated dynamically via vw_donation_campaign_progress view
-- No need to update any columns manually

-- Uncomment to verify the seeded data:
-- SELECT 
--   title,
--   target_amount,
--   paid_amount,
--   paid_count,
--   progress_pct
-- FROM vw_donation_campaign_progress
-- ORDER BY created_at;
