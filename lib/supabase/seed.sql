-- =====================================================
-- IARK SEED DATA
-- Run this after schema.sql in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- SEED BATCHES (Angkatan)
-- =====================================================
INSERT INTO batches (angkatan, year, fun_fact) VALUES
(1, '2010', 'Angkatan pertama dengan 25 anggota yang menjadi pionir gerakan kepemimpinan nasional.'),
(2, '2011', 'Dikenal sebagai "Angkatan Harmoni" karena kekompakannya yang luar biasa hingga hari ini.'),
(3, '2012', 'Mencetak pengusaha sosial terbanyak dengan 12 anggota yang mendirikan social enterprise.'),
(4, '2013', 'Memiliki tradisi "Kumpul Bulanan" yang masih rutin dilakukan selama 10+ tahun.'),
(5, '2014', 'Angkatan dengan alumni terbanyak di sektor pemerintahan (8 ASN dan 2 diplomat).'),
(6, '2015', 'Terkenal dengan program mentorship yang telah membimbing 200+ mahasiswa.'),
(7, '2016', 'Menjadi angkatan paling aktif di media sosial dengan konten kepemimpinan viral.'),
(8, '2017', 'Memiliki grup musik "RK8 Band" yang sering tampil di acara IARK.'),
(9, '2018', 'Pelopor inisiatif "Green Leadership" dengan 5 proyek lingkungan berkelanjutan.'),
(10, '2019', 'Angkatan dengan jumlah anggota terbanyak (45 orang) dari berbagai provinsi.'),
(11, '2020', 'Angkatan pandemi yang sukses membangun jaringan virtual paling solid.'),
(12, '2021', 'Memulai tradisi "12 Days of Leadership" - berbagi insight harian selama 12 hari.');

-- =====================================================
-- SEED BATCH LEADERS
-- =====================================================
INSERT INTO batch_leaders (batch_id, name, photo, quote, job_title, is_ketua) VALUES
(1, 'Hendra Wijaya', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80', 'Menjadi yang pertama adalah tanggung jawab besar untuk membuka jalan bagi generasi berikutnya.', 'CEO PT Nusantara Tech', true),
(2, 'Nurul Hidayah', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80', 'Kebersamaan adalah kunci - kami bukan hanya rekan, tapi keluarga.', 'Direktur Yayasan Pendidikan Cahaya', true),
(3, 'Agung Setiawan', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80', 'Kepemimpinan sejati adalah tentang menciptakan dampak positif bagi sesama.', 'Founder Social Impact Lab', true),
(4, 'Maya Sari', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', 'Konsistensi dalam silaturahmi adalah bentuk komitmen kami terhadap nilai RK.', 'Country Manager Fintech Global', true),
(5, 'Dimas Ardianto', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', 'Melayani negara adalah panggilan, bukan sekadar pekerjaan.', 'Kepala Dinas Pemuda & Olahraga', true),
(6, 'Fitria Rahmawati', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80', 'Berbagi ilmu adalah investasi terbaik untuk masa depan bangsa.', 'Head of People Development, Unicorn Startup', true),
(7, 'Farhan Ramadhan', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', 'Di era digital, pengaruh positif bisa menjangkau lebih banyak orang.', 'Content Creator & Public Speaker', true),
(8, 'Aisyah Putri', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', 'Kreativitas adalah cara kami mengekspresikan nilai kepemimpinan.', 'Produser Musik & Founder Record Label', true),
(9, 'Bayu Pratama', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', 'Kepemimpinan harus peduli pada keberlanjutan bumi kita.', 'Environmental Consultant', true),
(10, 'Citra Dewi', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80', 'Keberagaman adalah kekuatan, bukan hambatan untuk kolaborasi.', 'Regional Manager Multinational Corp', true),
(11, 'Evan Kurniawan', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', 'Pandemi mengajarkan kami bahwa adaptasi adalah kunci survival.', 'Tech Entrepreneur & Investor', true),
(12, 'Gita Pramesti', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80', 'Konsistensi dalam berbagi adalah cara kami meneruskan api kepemimpinan.', 'Management Consultant', true);

-- =====================================================
-- SEED CLUSTERS (formerly Bidang)
-- =====================================================
INSERT INTO clusters (name, short_name, description, icon, color, order_index) VALUES
('Cluster IELTS', 'IELTS', 'Subsidi IELTS dan Pendampingan Beasiswa', 'GraduationCap', 'red', 1),
('Cluster Keputrian', 'Keputrian', 'Keputrian dan Kekeluargaan', 'Heart', 'red', 2),
('Cluster Ngaji', 'Ngaji', 'Ngaji Sebentar dan Asah Nurani', 'BookOpen', 'red', 3),
('Cluster Bisnis', 'Bisnis', 'Kolaborasi Bisnis Alumni', 'Briefcase', 'blue', 4),
('Cluster Politik', 'Politik', 'Pendampingan dan Kaderisasi Politik', 'Landmark', 'blue', 5),
('Cluster Distrik Barat', 'Distrik Barat', 'Koordinasi Alumni Wilayah Barat', 'MapPin', 'blue', 6),
('Cluster Distrik Timur', 'Distrik Timur', 'Koordinasi Alumni Wilayah Timur', 'MapPin', 'yellow', 7),
('Cluster Karir', 'Karir', 'Persiapan dan Pengembangan Karir Alumni', 'TrendingUp', 'yellow', 8),
('Cluster Kajian', 'Kajian', 'Sharing Alumni dan Kolaborasi Kajian Strategis', 'Lightbulb', 'yellow', 9),
('Cluster HFVN RK', 'HFVN RK', 'Program HFVN Rumah Kepemimpinan', 'Users', 'red', 10),
('Cluster IT Center', 'IT Center', 'Teknologi Informasi dan Digital', 'Monitor', 'blue', 11),
('Cluster Media', 'Media', 'Media dan Komunikasi', 'Megaphone', 'yellow', 12);

-- =====================================================
-- SEED MANAGEMENT
-- =====================================================
INSERT INTO management (name, position, angkatan, photo, role, instagram, linkedin, order_index) VALUES
-- Pengurus Inti
('Ahmad Fauzan', 'Ketua Umum', 'Angkatan 5', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', 'pengurus_inti', 'https://instagram.com/ahmadfauzan', 'https://linkedin.com/in/ahmadfauzan', 1),
('Siti Rahma', 'Wakil Ketua Umum', 'Angkatan 7', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', 'pengurus_inti', 'https://instagram.com/sitirahma', 'https://linkedin.com/in/sitirahma', 2),
('Budi Santoso', 'Sekretaris Jenderal', 'Angkatan 8', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', 'pengurus_inti', 'https://instagram.com/budisantoso', 'https://linkedin.com/in/budisantoso', 3),
('Dewi Kusuma', 'Bendahara Umum', 'Angkatan 6', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80', 'pengurus_inti', 'https://instagram.com/dewikusuma', 'https://linkedin.com/in/dewikusuma', 4),
('Rizky Pratama', 'Ketua Bidang Program', 'Angkatan 9', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', 'pengurus_inti', 'https://instagram.com/rizkypratama', 'https://linkedin.com/in/rizkypratama', 5),
('Putri Handayani', 'Ketua Bidang Keanggotaan', 'Angkatan 10', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80', 'pengurus_inti', 'https://instagram.com/putrihandayani', 'https://linkedin.com/in/putrihandayani', 6),
-- Ketua Angkatan
('Hendra Wijaya', 'Ketua Angkatan 1', 'Angkatan 1', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80', 'ketua_angkatan', 'https://instagram.com/hendrawijaya', 'https://linkedin.com/in/hendrawijaya', 7),
('Nurul Hidayah', 'Ketua Angkatan 2', 'Angkatan 2', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80', 'ketua_angkatan', 'https://instagram.com/nurulhidayah', 'https://linkedin.com/in/nurulhidayah', 8),
('Agung Setiawan', 'Ketua Angkatan 3', 'Angkatan 3', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80', 'ketua_angkatan', 'https://instagram.com/agungsetiawan', 'https://linkedin.com/in/agungsetiawan', 9),
('Maya Sari', 'Ketua Angkatan 4', 'Angkatan 4', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', 'ketua_angkatan', 'https://instagram.com/mayasari', 'https://linkedin.com/in/mayasari', 10),
('Dimas Ardianto', 'Ketua Angkatan 5', 'Angkatan 5', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', 'ketua_angkatan', 'https://instagram.com/dimasardianto', 'https://linkedin.com/in/dimasardianto', 11),
('Fitria Rahmawati', 'Ketua Angkatan 6', 'Angkatan 6', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80', 'ketua_angkatan', 'https://instagram.com/fitriarahmawati', 'https://linkedin.com/in/fitriarahmawati', 12);

-- =====================================================
-- SEED TESTIMONIALS
-- =====================================================
INSERT INTO testimonials (name, title, angkatan, photo, quote, type, order_index, is_active) VALUES
-- Ketua Angkatan
('Hendra Wijaya', 'CEO PT Nusantara Tech', 'Ketua Angkatan 1', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80', 'Rumah Kepemimpinan membentuk karakter saya dalam memimpin dengan integritas. IARK menjadi wadah untuk terus berkontribusi dan berbagi dengan generasi selanjutnya.', 'ketua_angkatan', 1, true),
('Nurul Hidayah', 'Direktur Yayasan Pendidikan Cahaya', 'Ketua Angkatan 2', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80', 'Kebersamaan di RK mengajarkan saya bahwa kepemimpinan bukan tentang posisi, tapi tentang bagaimana kita mengangkat orang lain.', 'ketua_angkatan', 2, true),
('Agung Setiawan', 'Founder Social Impact Lab', 'Ketua Angkatan 3', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80', 'Nilai-nilai yang ditanamkan RK menjadi kompas dalam setiap keputusan bisnis sosial saya. IARK adalah rumah untuk terus belajar dan berbagi.', 'ketua_angkatan', 3, true),
('Maya Sari', 'Country Manager Fintech Global', 'Ketua Angkatan 4', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', 'Konsistensi dalam silaturahmi adalah bentuk nyata dari nilai kepemimpinan RK yang kami jaga hingga hari ini.', 'ketua_angkatan', 4, true),
('Dimas Ardianto', 'Kepala Dinas Pemuda & Olahraga', 'Ketua Angkatan 5', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', 'Melayani negara adalah manifestasi nilai kepemimpinan RK. IARK membantu saya tetap terhubung dengan tujuan mulia ini.', 'ketua_angkatan', 5, true),
('Fitria Rahmawati', 'Head of People Development', 'Ketua Angkatan 6', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80', 'Program mentorship yang kami jalankan adalah cara konkret mengimplementasikan nilai berbagi yang diajarkan RK.', 'ketua_angkatan', 6, true),
-- Tokoh Ternama
('Dr. Rizal Ramli', 'Ekonom & Mantan Menteri', NULL, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', 'Alumni RK memiliki karakteristik unik - mereka tidak hanya cerdas, tapi juga memiliki integritas tinggi. IARK adalah wadah yang tepat untuk menyatukan potensi ini.', 'tokoh_ternama', 13, true),
('Prof. Rhenald Kasali', 'Guru Besar UI & Founder Rumah Perubahan', NULL, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', 'Saya melihat alumni RK sebagai agen perubahan yang memiliki visi jelas untuk Indonesia. IARK adalah platform yang memperkuat jaringan mereka.', 'tokoh_ternama', 14, true),
('Nadiem Makarim', 'Menteri Pendidikan', NULL, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', 'Kepemimpinan yang diajarkan di Rumah Kepemimpinan sejalan dengan transformasi pendidikan yang kita cita-citakan. IARK menjadi perpanjangan dari misi tersebut.', 'tokoh_ternama', 15, true),
('Sandiaga Uno', 'Menteri Pariwisata & Ekonomi Kreatif', NULL, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80', 'Semangat entrepreneurship dan kepemimpinan yang ditanamkan RK sangat penting untuk ekonomi kreatif Indonesia. IARK adalah jaringan yang kuat.', 'tokoh_ternama', 16, true),
('Erick Thohir', 'Menteri BUMN', NULL, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', 'Transformasi BUMN membutuhkan pemimpin muda berintegritas seperti alumni RK. IARK berperan penting dalam menyiapkan talenta terbaik bangsa.', 'tokoh_ternama', 17, true);

-- =====================================================
-- SEED HERO SLIDES
-- =====================================================
INSERT INTO hero_slides (title, subtitle, image_url, link_url, order_index, is_active) VALUES
('Rakernas IARK 2024', 'Bersama Membangun Indonesia', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80', '/events/rakernas-2024', 1, true),
('Leadership Summit', 'Inspiring Future Leaders', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=80', '/events/leadership-summit', 2, true),
('Alumni Gathering', 'Reconnecting & Networking', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80', '/events/alumni-gathering', 3, true),
('Community Impact', 'Making Real Difference', 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=80', '/donasi', 4, true),
('Join IARK', 'Be Part of the Movement', 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&q=80', '/daftar', 5, true);

-- =====================================================
-- SEED DORMITORIES
-- =====================================================
INSERT INTO dormitories (name, city, province, image_url, total_rooms, occupied_rooms, description) VALUES
('Asrama RK Jakarta', 'Jakarta', 'DKI Jakarta', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80', 50, 45, 'Asrama utama di ibu kota dengan fasilitas lengkap dan akses strategis'),
('Asrama RK Bandung', 'Bandung', 'Jawa Barat', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', 40, 38, 'Asrama di kota pendidikan dengan suasana sejuk pegunungan'),
('Asrama RK Yogyakarta', 'Yogyakarta', 'DI Yogyakarta', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80', 35, 30, 'Asrama di kota budaya dengan nuansa tradisional Jawa'),
('Asrama RK Surabaya', 'Surabaya', 'Jawa Timur', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', 30, 28, 'Asrama di kota pahlawan dengan semangat juang tinggi'),
('Asrama RK Makassar', 'Makassar', 'Sulawesi Selatan', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', 25, 20, 'Asrama di pintu gerbang Indonesia Timur'),
('Asrama RK Medan', 'Medan', 'Sumatera Utara', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', 25, 22, 'Asrama di kota metropolitan Sumatera dengan keberagaman budaya');

-- =====================================================
-- SEED ACTIVITIES
-- =====================================================
INSERT INTO activities (category, author, title, subtitle, date, read_time, likes, comments, image_url, link, is_active) VALUES
('Event', 'Tim Redaksi', 'Rakernas IARK 2024', 'Rapat kerja nasional tahunan IARK yang mempertemukan seluruh pengurus dan perwakilan angkatan', '2024-03-15', '5 min', 245, 32, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', '/events/rakernas-2024', true),
('Program', 'Bidang IELTS', 'Subsidi IELTS Batch 10', 'Program subsidi IELTS untuk alumni yang ingin melanjutkan studi ke luar negeri', '2024-02-20', '3 min', 189, 45, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80', '/programs/ielts-subsidi', true),
('Sosial', 'Bidang Distrik Barat', 'Bakti Sosial Ramadan', 'Kegiatan berbagi dengan masyarakat sekitar asrama selama bulan Ramadan', '2024-03-25', '4 min', 312, 28, 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80', '/activities/baksos-ramadan', true),
('Event', 'Tim Media', 'Leadership Talk Series #5', 'Diskusi bulanan dengan tokoh inspiratif tentang kepemimpinan masa kini', '2024-02-28', '6 min', 156, 19, 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80', '/events/leadership-talk-5', true),
('Program', 'Bidang Karir', 'Career Coaching Session', 'Sesi coaching karir bersama alumni senior untuk membantu pengembangan karir', '2024-03-01', '4 min', 203, 37, 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', '/programs/career-coaching', true),
('Sosial', 'Bidang Keputrian', 'Womens Leadership Forum', 'Forum khusus untuk alumni perempuan membahas kepemimpinan dan pemberdayaan', '2024-03-08', '5 min', 178, 24, 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80', '/events/womens-forum', true);
