-- SEED DATA: Events
-- Berisi contoh event yang akan datang dan event yang sudah selesai

-- Hapus data lama jika ada (opsional, uncomment jika perlu)
-- DELETE FROM public.events;

-- =============================================
-- EVENT YANG AKAN DATANG (UPCOMING)
-- =============================================

INSERT INTO public.events (
  title, slug, description, content, date, location, image_url,
  is_live, registration_enabled, max_participants, registration_deadline,
  event_type, meeting_link, contact_person, contact_whatsapp, price
) VALUES

-- Event 1: Silaturahmi Akbar (Offline, 2 minggu lagi)
(
  'Silaturahmi Akbar IARK 2026',
  'silaturahmi-akbar-2026',
  'Acara tahunan silaturahmi seluruh alumni Rumah Kepemimpinan dari berbagai angkatan dan asrama.',
  '## Silaturahmi Akbar IARK 2026

Selamat datang di acara Silaturahmi Akbar IARK 2026! 🎉

### Rangkaian Acara

1. **08:00 - 09:00** | Registrasi & Coffee Morning
2. **09:00 - 10:00** | Pembukaan & Sambutan Ketua IARK
3. **10:00 - 12:00** | Talkshow: "Peran Alumni RK dalam Pembangunan Bangsa"
4. **12:00 - 13:30** | Ishoma & Makan Siang Bersama
5. **13:30 - 15:00** | Diskusi Kelompok per Regional
6. **15:00 - 17:00** | Games & Networking Session
7. **17:00 - 18:00** | Penutupan & Foto Bersama

### Fasilitas
- Makan siang & coffee break
- Goodie bag eksklusif
- Sertifikat kehadiran
- Door prize menarik

### Dresscode
Batik atau kemeja formal

Sampai jumpa di acara!',
  (CURRENT_DATE + INTERVAL '14 days')::timestamp + TIME '09:00:00',
  'Hotel Grand Sahid Jaya, Jakarta',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
  true,
  true,
  200,
  (CURRENT_DATE + INTERVAL '12 days')::timestamp,
  'offline',
  NULL,
  'Budi Santoso',
  '081234567890',
  0
),

-- Event 2: Webinar Karir (Online, 1 minggu lagi)
(
  'Webinar: Membangun Karir di Era AI',
  'webinar-karir-era-ai',
  'Diskusi mendalam tentang bagaimana alumni RK dapat beradaptasi dan berkembang di era kecerdasan buatan.',
  '## Webinar: Membangun Karir di Era AI

### Pembicara

**Dr. Ahmad Zaky** - Founder Bukalapak
- Pengalaman membangun startup unicorn
- Strategi adaptasi teknologi AI

**Sarah Diorita** - AI Lead Google Indonesia
- Tren AI di industri teknologi
- Skill yang dibutuhkan di masa depan

### Materi Pembahasan

1. Dampak AI terhadap pasar kerja
2. Skill yang tetap relevan di era AI
3. Peluang karir baru yang muncul
4. Tips praktis untuk upskilling
5. Q&A dengan pembicara

### Bonus
- E-certificate
- Recording webinar
- Materi presentasi (PDF)
- Akses grup diskusi eksklusif',
  (CURRENT_DATE + INTERVAL '7 days')::timestamp + TIME '19:00:00',
  'Zoom Meeting',
  'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1200&q=80',
  true,
  true,
  500,
  (CURRENT_DATE + INTERVAL '6 days')::timestamp,
  'online',
  'https://zoom.us/j/123456789',
  'Dewi Lestari',
  '082345678901',
  0
),

-- Event 3: Workshop Leadership (Hybrid, 3 minggu lagi)
(
  'Workshop: Authentic Leadership for Young Professionals',
  'workshop-authentic-leadership',
  'Workshop intensif 2 hari untuk mengasah kemampuan kepemimpinan autentik bagi profesional muda.',
  '## Workshop: Authentic Leadership

### Tentang Workshop

Workshop intensif selama 2 hari yang dirancang khusus untuk alumni RK yang ingin mengembangkan gaya kepemimpinan autentik mereka.

### Hari 1 - Self Discovery
- Understanding your leadership style
- Values-based leadership
- Emotional intelligence in leadership
- Personal branding sebagai pemimpin

### Hari 2 - Practical Application
- Conflict resolution strategies
- Building high-performance teams
- Communication mastery
- Action plan development

### Fasilitator
**Coach Rendy Saputra** - Executive Coach dengan 15+ tahun pengalaman

### Yang Akan Anda Dapatkan
- Hands-on exercises
- Personal assessment report
- 1-on-1 coaching session (30 menit)
- Lifetime access ke alumni network
- Sertifikat keikutsertaan

### Investasi
Rp 500.000 (termasuk makan siang & materials)',
  (CURRENT_DATE + INTERVAL '21 days')::timestamp + TIME '08:30:00',
  'Co-working Space GoWork, Menteng, Jakarta & Online via Zoom',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80',
  true,
  true,
  50,
  (CURRENT_DATE + INTERVAL '18 days')::timestamp,
  'hybrid',
  'https://zoom.us/j/987654321',
  'Andi Firmansyah',
  '083456789012',
  500000
),

-- Event 4: Buka Puasa Bersama (Offline, 1 bulan lagi)
(
  'Buka Puasa Bersama IARK Jabodetabek',
  'bukber-iark-jabodetabek-2026',
  'Momen kebersamaan alumni RK se-Jabodetabek untuk berbuka puasa bersama di bulan Ramadhan.',
  '## Buka Puasa Bersama IARK Jabodetabek

### Detail Acara

Ayo kumpul bareng untuk berbuka puasa bersama! 🌙

**Waktu:** Pukul 16:30 - 20:00 WIB
**Tempat:** Restoran Sari Ratu, Cikini, Jakarta Pusat

### Rundown
- 16:30 - Registrasi & Ngobrol santai
- 17:30 - Kultum singkat
- 18:00 - Buka puasa bersama
- 19:00 - Sholat Maghrib berjamaah
- 19:30 - Sharing session & networking
- 20:00 - Selesai

### Menu
All you can eat buffet dengan menu:
- Aneka takjil
- Nasi kebuli
- Ayam bakar
- Sate kambing
- Dan masih banyak lagi!

### Kontribusi
GRATIS! Ditanggung IARK 💝

### Note
- Ajak keluarga juga boleh!
- Parkir tersedia di basement',
  (CURRENT_DATE + INTERVAL '30 days')::timestamp + TIME '16:30:00',
  'Restoran Sari Ratu, Cikini, Jakarta Pusat',
  'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=1200&q=80',
  true,
  true,
  100,
  (CURRENT_DATE + INTERVAL '28 days')::timestamp,
  'offline',
  NULL,
  'Fatimah Zahra',
  '084567890123',
  0
),

-- =============================================
-- EVENT YANG SUDAH SELESAI (PAST)
-- =============================================

-- Event 5: Webinar yang sudah lewat (2 minggu lalu)
(
  'Webinar: Financial Planning untuk Milenial',
  'webinar-financial-planning-milenial',
  'Belajar mengelola keuangan dengan bijak untuk mencapai financial freedom di usia muda.',
  '## Webinar: Financial Planning untuk Milenial

Terima kasih kepada 324 peserta yang sudah hadir di webinar ini! 🎉

### Materi yang Dibahas
1. Mindset keuangan yang sehat
2. Budgeting 50/30/20
3. Emergency fund - berapa idealnya?
4. Investasi untuk pemula
5. Asuransi yang wajib dimiliki

### Pembicara
**Ligwina Hananto** - CEO QM Financial

Recording sudah dikirim ke email peserta.',
  (CURRENT_DATE - INTERVAL '14 days')::timestamp + TIME '19:00:00',
  'Zoom Meeting',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
  true,
  false,
  NULL,
  (CURRENT_DATE - INTERVAL '15 days')::timestamp,
  'online',
  NULL,
  'Rina Amelia',
  '085678901234',
  0
),

-- Event 6: Olahraga bersama (1 bulan lalu)
(
  'Fun Run & Senam Pagi IARK',
  'fun-run-senam-pagi-iark',
  'Olahraga pagi bersama alumni RK untuk menjaga kesehatan dan mempererat silaturahmi.',
  '## Fun Run & Senam Pagi IARK

Event ini sudah selesai dengan sukses! 🏃‍♂️

### Highlight
- 87 peserta hadir
- Cuaca cerah mendukung
- Senam bersama dipimpin instruktur profesional
- Fun run 5K mengelilingi area Monas
- Sarapan sehat bersama

### Dokumentasi
Foto-foto sudah diupload di grup WhatsApp IARK.

Sampai jumpa di event olahraga berikutnya!',
  (CURRENT_DATE - INTERVAL '30 days')::timestamp + TIME '06:00:00',
  'Lapangan Monas, Jakarta Pusat',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80',
  true,
  false,
  NULL,
  (CURRENT_DATE - INTERVAL '32 days')::timestamp,
  'offline',
  NULL,
  'Dimas Prasetyo',
  '086789012345',
  0
),

-- Event 7: Talkshow yang sudah lewat (2 bulan lalu)
(
  'Talkshow: Kisah Sukses Alumni RK di Berbagai Bidang',
  'talkshow-kisah-sukses-alumni-rk',
  'Mendengar langsung cerita inspiratif dari alumni RK yang sukses di berbagai bidang profesional.',
  '## Talkshow: Kisah Sukses Alumni RK

Acara yang sangat inspiring dengan 4 pembicara hebat!

### Pembicara

1. **dr. Reisa Broto Asmoro** (RK Angkatan 2)
   - Dokter & Juru Bicara COVID-19
   
2. **Nadiem Makarim** (RK Angkatan 1)
   - Founder Gojek, Menteri Pendidikan
   
3. **Maudy Ayunda** (RK Angkatan 5)
   - Penyanyi, Aktris, & Aktivis Pendidikan
   
4. **Gita Wirjawan** (RK Angkatan 1)
   - Mantan Menteri Perdagangan, Investor

### Key Takeaways
- Pentingnya networking dan relasi
- Konsistensi dalam berproses
- Berani mengambil risiko terukur
- Giving back to community

Recording tersedia di YouTube IARK Official.',
  (CURRENT_DATE - INTERVAL '60 days')::timestamp + TIME '14:00:00',
  'Auditorium Universitas Indonesia, Depok',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=80',
  true,
  false,
  NULL,
  (CURRENT_DATE - INTERVAL '62 days')::timestamp,
  'offline',
  NULL,
  'Ahmad Fauzi',
  '087890123456',
  0
),

-- Event 8: Workshop yang sudah lewat (3 bulan lalu)
(
  'Workshop: Public Speaking Mastery',
  'workshop-public-speaking-mastery',
  'Workshop intensif untuk meningkatkan kemampuan berbicara di depan publik dengan percaya diri.',
  '## Workshop: Public Speaking Mastery

Workshop sudah selesai dengan feedback yang sangat positif! ⭐⭐⭐⭐⭐

### Testimoni Peserta

> "Sangat aplikatif! Langsung bisa dipraktekkan di kantor." - Budi, RK Angkatan 7

> "Coach nya keren, materinya daging semua!" - Sari, RK Angkatan 9

> "Worth it banget, sekarang lebih pede presentasi." - Andi, RK Angkatan 8

### Statistik
- 35 peserta
- 8 jam pembelajaran
- 4.9/5.0 rating kepuasan
- 100% merekomendasikan

Sampai jumpa di workshop berikutnya!',
  (CURRENT_DATE - INTERVAL '90 days')::timestamp + TIME '09:00:00',
  'Hotel Novotel, Mangga Dua, Jakarta',
  'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1200&q=80',
  true,
  false,
  NULL,
  (CURRENT_DATE - INTERVAL '92 days')::timestamp,
  'offline',
  NULL,
  'Putri Handayani',
  '088901234567',
  250000
);

-- Verifikasi data
SELECT 
  title,
  date,
  is_live,
  registration_enabled,
  event_type,
  CASE 
    WHEN date > NOW() THEN 'UPCOMING'
    ELSE 'PAST'
  END as status
FROM public.events
ORDER BY date DESC;
