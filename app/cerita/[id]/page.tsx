import { Header, Footer } from '@/components/layout';
import { StoryDetail } from '@/components/features/cerita';
import { notFound } from 'next/navigation';

// This would typically come from a database or API
const storiesData = {
  '1': {
    id: '1',
    name: 'Dr. Sarah Wijaya',
    batch: 'RK Angkatan 15',
    title: 'Dari Rumah Kepemimpinan ke Harvard Medical School',
    excerpt: 'Perjalanan dari mahasiswa RK hingga menjadi peneliti kesehatan global di salah satu universitas terbaik dunia.',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    category: 'akademik' as const,
    quote: 'RK mengajarkan saya bahwa kepemimpinan bukan tentang posisi, tapi tentang memberi dampak positif bagi orang lain.',
    publishedDate: '21 Desember 2024',
    readTime: '8 menit',
    heroImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80',
    content: `
Ketika pertama kali bergabung dengan Rumah Kepemimpinan pada tahun 2015, saya hanya seorang mahasiswa kedokteran biasa yang bermimpi membuat perbedaan. Tidak pernah terbayangkan bahwa perjalanan ini akan membawa saya ke salah satu institusi pendidikan terbaik di dunia - Harvard Medical School.

## Awal Perjalanan di RK

Rumah Kepemimpinan mengajarkan saya lebih dari sekadar teori kepemimpinan. Di sini, saya belajar tentang pentingnya melayani masyarakat, berpikir kritis, dan yang paling penting - berani bermimpi besar sambil tetap membumi.

Program-program di RK seperti Community Service dan Leadership Training membentuk karakter saya. Saya ingat ketika pertama kali memimpin tim untuk program kesehatan gratis di daerah terpencil. Pengalaman itu membuka mata saya tentang realitas kesenjangan akses kesehatan di Indonesia.

## Persiapan Menuju Harvard

Perjalanan ke Harvard bukanlah hal yang mudah. Setelah lulus kedokteran, saya mengabdi sebagai dokter umum di daerah terpencil selama 2 tahun. Pengalaman ini menjadi pondasi kuat untuk riset saya tentang kesehatan global dan akses pelayanan kesehatan di negara berkembang.

> "RK mengajarkan saya bahwa kepemimpinan bukan tentang posisi, tapi tentang memberi dampak positif bagi orang lain."

Dengan dukungan mentor-mentor di RK dan jaringan alumni yang solid, saya mulai mempersiapkan aplikasi untuk program PhD di Harvard. Prosesnya memakan waktu 1,5 tahun - mulai dari persiapan tes GRE, TOEFL, hingga menulis research proposal yang matang.

## Kehidupan di Harvard

Saat ini, saya sedang menjalani tahun kedua program doktoral saya di Department of Global Health and Population. Riset saya fokus pada pengembangan sistem kesehatan primer di negara-negara dengan sumber daya terbatas.

Yang membanggakan, saya berkesempatan membawa perspektif Indonesia ke forum internasional. Pengalaman saya di RK dan pengabdian di daerah terpencil menjadi studi kasus yang menarik perhatian banyak profesor dan peneliti di sini.

## Pesan untuk Adik-Adik RK

Jangan pernah meremehkan pengalaman kalian di RK. Setiap program, setiap tantangan, dan setiap kesempatan melayani adalah investasi untuk masa depan. Harvard mungkin terlihat jauh, tapi dengan persiapan yang matang dan semangat untuk terus belajar, tidak ada yang tidak mungkin.

Tetap connected dengan alumni RK. Jaringan ini adalah aset berharga yang akan terus mendukung perjalanan kalian, di mana pun kalian berada.

## Rencana ke Depan

Setelah menyelesaikan PhD, saya berencana kembali ke Indonesia untuk berkontribusi dalam pengembangan sistem kesehatan nasional. Impian saya adalah mendirikan research center yang fokus pada inovasi kesehatan untuk daerah terpencil, menggabungkan pengetahuan global dengan kearifan lokal.

RK telah mengajarkan saya untuk bermimpi besar sambil tetap ingat akar. Dan itulah yang akan saya lakukan - membawa ilmu dari Harvard untuk Indonesia yang lebih baik.
    `,
    tags: ['Pendidikan', 'Beasiswa', 'Harvard', 'Kesehatan Global', 'Inspirasi'],
    relatedStories: ['2', '6']
  },
  '2': {
    id: '2',
    name: 'Ahmad Fauzi',
    batch: 'RK Angkatan 12',
    title: 'Membangun Startup Edukasi untuk Daerah Terpencil',
    excerpt: 'Kisah mendirikan platform edukasi online yang telah menjangkau ribuan siswa di pelosok Indonesia.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    category: 'karir' as const,
    quote: 'Teknologi adalah jembatan untuk menyamakan akses pendidikan bagi semua anak Indonesia.',
    publishedDate: '18 Desember 2024',
    readTime: '6 menit',
    heroImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
    content: `
Berawal dari pengalaman mengajar di program RK Goes to School, saya melihat langsung kesenjangan akses pendidikan antara kota dan daerah. Dari situlah ide EdukaSI (Edukasi untuk Semua Indonesia) lahir.

## Awal Mula EdukaSI

Tahun 2018, bersama dua teman alumni RK, kami memulai EdukaSI dari kamar kos. Platform sederhana yang menyediakan video pembelajaran gratis untuk siswa SD dan SMP. Modal awal? Laptop bekas, koneksi internet, dan semangat untuk berbagi.

Bulan pertama, hanya 50 siswa yang mengakses platform kami. Tapi kami tidak menyerah. Kami terus memproduksi konten, memperbaiki platform, dan yang paling penting - mendengarkan feedback dari pengguna.

## Tantangan dan Pembelajaran

Membangun startup edukasi bukan jalan yang mulus. Tantangan terbesar kami adalah koneksi internet yang tidak stabil di daerah terpencil. Solusinya? Kami mengembangkan fitur download konten untuk pembelajaran offline.

> "Teknologi adalah jembatan untuk menyamakan akses pendidikan bagi semua anak Indonesia."

Tantangan kedua adalah funding. Tahun pertama, kami bootstrapping - menggunakan uang pribadi dan kerja freelance untuk menghidupi platform. Tapi dengan model bisnis yang jelas dan dampak sosial yang terukur, kami akhirnya mendapat pendanaan seed round dari impact investor.

## Dampak yang Dicapai

Saat ini, EdukaSI telah:
- Menjangkau 50,000+ siswa di 200+ desa
- Menyediakan 5,000+ video pembelajaran gratis
- Melatih 500+ guru lokal untuk menggunakan teknologi
- Bermitra dengan 50+ sekolah di daerah 3T

Yang paling membanggakan adalah surat dari seorang siswa di Papua yang berhasil masuk SMA favorit berkat belajar dari platform kami. Itulah yang membuat semua kerja keras terasa bermakna.

## Pesan untuk Calon Entrepreneur Sosial

1. **Mulai dari masalah nyata** - EdukaSI lahir dari pengalaman langsung melihat kesenjangan pendidikan
2. **Build iteratively** - Mulai kecil, dengarkan feedback, improve terus
3. **Jangan takut gagal** - Versi pertama platform kami jelek banget, tapi kami terus belajar
4. **Network matters** - Alumni RK banyak yang support, dari jadi mentor sampai investor
5. **Stay focused on impact** - Profit penting, tapi dampak sosial adalah kompas utama

## Visi ke Depan

Mimpi kami adalah EdukaSI menjadi platform edukasi terbesar untuk daerah terpencil di Indonesia. Kami sedang develop fitur AI tutor yang bisa menjawab pertanyaan siswa secara real-time, dan expansion ke konten SMA dan persiapan ujian masuk PTN.

Terima kasih RK sudah mengajarkan bahwa entrepreneur bukan cuma soal cari untung, tapi bagaimana bisnis bisa jadi solusi untuk masalah sosial.
    `,
    tags: ['Startup', 'Edukasi', 'Teknologi', 'Social Impact', 'Entrepreneurship'],
    relatedStories: ['1', '5']
  },
  '3': {
    id: '3',
    name: 'Dewi Lestari',
    batch: 'RK Angkatan 14',
    title: 'Mengabdi sebagai Guru di Papua Selama 5 Tahun',
    excerpt: 'Pengalaman menjadi pengajar muda dan membawa perubahan untuk pendidikan anak-anak Papua.',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    category: 'pengabdian' as const,
    quote: 'Mengajar di Papua bukan tentang apa yang saya berikan, tapi tentang apa yang saya terima - pelajaran tentang ketahanan, ketulusan, dan cinta tanpa syarat.',
    publishedDate: '15 Desember 2024',
    readTime: '7 menit',
    heroImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
    content: `
Keputusan untuk mengajar di Papua bukanlah keputusan yang mudah. Keluarga khawatir, teman-teman bertanya "kenapa?", tapi hati saya sudah bulat. Semangat melayani yang ditanamkan RK membawa saya ke tanah Papua yang indah dan menantang.

## Tiba di Kampung Yoboi

Agustus 2019, saya tiba di Kampung Yoboi, Kabupaten Jayapura. Perjalanan dari Jayapura kota memakan waktu 6 jam dengan motor melewati jalan berbatu dan hutan. SD Negeri Yoboi - sekolah tempat saya akan mengajar - memiliki 3 ruang kelas untuk 6 tingkat, dengan total 47 siswa.

Kondisi sekolah sangat minim. Tidak ada listrik, buku pelajaran terbatas, dan banyak anak yang belum lancar membaca di kelas 4-5. Tantangan yang nyata, tapi juga kesempatan untuk membuat perbedaan.

## Menyesuaikan Diri dengan Budaya Lokal

Minggu-minggu pertama adalah proses pembelajaran terbesar dalam hidup saya. Saya harus belajar bahasa lokal, memahami adat istiadat, dan yang paling penting - mendengarkan. Anak-anak Papua sangat cerdas, mereka hanya butuh kesempatan dan metode pembelajaran yang tepat.

> "Mengajar di Papua bukan tentang apa yang saya berikan, tapi tentang apa yang saya terima - pelajaran tentang ketahanan, ketulusan, dan cinta tanpa syarat."

Saya mulai mengintegrasikan budaya lokal ke dalam pembelajaran. Matematika diajarkan dengan menghitung hasil panen sagu, Bahasa Indonesia dengan mendongeng cerita rakyat Papua. Hasilnya? Anak-anak lebih antusias dan cepat memahami materi.

## Membangun Perpustakaan Mini

Salah satu proyek yang paling membanggakan adalah membangun perpustakaan mini. Dengan dukungan donasi dari alumni RK dan komunitas literasi, kami berhasil mengumpulkan 500 buku. Ruang guru yang tidak terpakai disulap menjadi perpustakaan kecil yang penuh warna.

Antusiasme anak-anak luar biasa. Mereka yang tadinya jarang membaca, kini berlomba meminjam buku. Ada anak yang bahkan rela berjalan 2 jam dari rumahnya hanya untuk membaca di perpustakaan setiap sore.

## Tantangan yang Harus Dihadapi

Tidak semua hari indah. Ada masa-masa sulit:
- Sakit malaria di tahun pertama tanpa akses rumah sakit
- Merindukan keluarga, terutama saat hari raya
- Frustasi melihat sistem pendidikan yang timpang
- Keterbatasan fasilitas yang membatasi kreativitas mengajar

Tapi setiap kali ingin menyerah, saya melihat mata berbinar anak-anak yang haus akan ilmu. Senyum mereka yang tulus ketika berhasil membaca kalimat pertama. Itu yang membuat saya bertahan.

## Dampak yang Tercipta

Setelah 5 tahun mengajar, beberapa pencapaian yang membanggakan:
- Tingkat literasi siswa meningkat 70%
- 5 alumni SD berhasil melanjutkan ke SMP di kota
- Perpustakaan mini yang kini memiliki 1,000+ buku
- Program "Kakak Asuh" yang menghubungkan siswa Papua dengan mahasiswa di Jawa

Yang paling membanggakan adalah ketika salah satu murid saya, Yakobus, menjadi juara lomba cerita tingkat kabupaten. Dia bilang, "Ibu Dewi sudah buka jendela dunia untuk kami."

## Pesan untuk Calon Pengajar Muda

1. **Buka hati dan pikiran** - Setiap daerah punya keunikan, hargai itu
2. **Sabar adalah kunci** - Perubahan tidak instan, nikmati prosesnya
3. **Kolaborasi dengan masyarakat** - Melibatkan orang tua dan tokoh adat sangat penting
4. **Jaga kesehatan mental** - Cari support system, tetap terhubung dengan keluarga
5. **Dokumentasikan perjalanan** - Cerita Anda bisa menginspirasi yang lain

## Pulang dengan Hati Penuh

Tahun 2024 ini saya memutuskan kembali ke Jawa untuk melanjutkan studi pendidikan. Tapi Papua akan selalu di hati. Saya tidak meninggalkan Papua, saya hanya sedang mempersiapkan diri untuk kembali dengan ilmu dan pengalaman yang lebih baik.

Terima kasih RK sudah mengajarkan bahwa hidup bukan hanya tentang kesuksesan pribadi, tapi tentang seberapa banyak kita memberi untuk orang lain. Papua telah memberi saya lebih dari yang pernah saya berikan.
    `,
    tags: ['Pengabdian', 'Pendidikan', 'Papua', 'Literasi', 'Inspirasi'],
    relatedStories: ['2', '4']
  },
  '4': {
    id: '4',
    name: 'Budi Santoso',
    batch: 'RK Angkatan 13',
    title: 'Dari Aktivis Kampus ke Anggota DPR Termuda',
    excerpt: 'Perjalanan politik yang dimulai dari kepemimpinan di RK hingga kursi parlemen.',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    category: 'kepemimpinan' as const,
    quote: 'Politik bukan tentang kekuasaan, tapi tentang bagaimana kita menggunakan posisi untuk melayani rakyat dengan integritas.',
    publishedDate: '12 Desember 2024',
    readTime: '9 menit',
    heroImage: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&q=80',
    content: `
Ketika saya terpilih sebagai anggota DPR RI di usia 27 tahun, banyak yang bilang saya beruntung. Tapi mereka tidak tahu perjalanan panjang yang dimulai dari Rumah Kepemimpinan, aktivisme kampus, hingga kerja keras di akar rumput selama 5 tahun.

## Benih Kepemimpinan Politik di RK

Tahun 2016, saya bergabung dengan RK sebagai mahasiswa teknik yang idealis tapi tidak tahu harus mulai dari mana untuk membuat perubahan. RK mengajarkan saya bahwa kepemimpinan itu bukan bakat, tapi skill yang bisa dipelajari dan diasah.

Program Leadership Bootcamp membuka mata saya tentang kompleksitas masalah sosial. Dari kesenjangan ekonomi, akses pendidikan, hingga korupsi sistemik. Saya mulai bertanya: bagaimana cara paling efektif untuk membuat perubahan struktural? Jawabannya: politik.

## Memulai dari Akar Rumput

Lulus kuliah tahun 2018, saya tidak langsung terjun ke politik praktis. Saya mulai sebagai relawan di LSM yang fokus pada advokasi kebijakan publik. Pagi siang malam, saya turun ke desa-desa, mendengar keluh kesah petani, nelayan, pedagang kecil.

> "Politik bukan tentang kekuasaan, tapi tentang bagaimana kita menggunakan posisi untuk melayani rakyat dengan integritas."

Tahun 2019, saya bergabung dengan partai politik yang visinya sejalan dengan nilai-nilai saya. Mulai dari tingkat kecamatan, saya bangun jaringan, dengar aspirasi warga, dan belajar dinamika politik lokal. Prosesnya lambat, tapi fundamental.

## Kampanye dengan Integritas

Tahun 2023, saya mencalonkan diri sebagai anggota DPR. Usia saya baru 26 tahun - sangat muda untuk standar politik Indonesia. Banyak yang meragukan, tapi saya punya modal penting: rekam jejak kerja nyata dan dukungan masyarakat akar rumput.

Kampanye saya fokus pada 3 isu:
1. **Reforma Agraria** - Keadilan tanah untuk petani
2. **Pendidikan Vokasi** - Link and match dengan industri
3. **Anti Korupsi** - Transparansi APBN dan pengadaan publik

Saya tidak pakai politik uang. Tidak ada amplop, tidak ada sembako. Hanya door-to-door, diskusi publik, dan media sosial untuk edukasi pemilih. Strategi berisiko, tapi itulah cara saya.

## Menang Melawan Petahana

Hasil pemilu mengejutkan banyak pihak. Saya menang dengan selisih 7,000 suara, mengalahkan petahana yang sudah 10 tahun berkuasa. Kunci kemenangan? Mobilisasi pemilih muda dan kepercayaan masyarakat akar rumput yang sudah saya bangun selama 5 tahun.

Malam pengumuman hasil, saya tidak merayakan dengan pesta besar. Saya kumpulkan tim dan relawan, lalu bilang: "Ini bukan akhir, ini awal tanggung jawab yang lebih besar. Kita harus deliver."

## Tahun Pertama di DPR: Realitas yang Keras

Menjadi anggota DPR termuda bukan hanya prestise. Ini tantangan besar. Sistem yang rigid, senioritas yang kuat, dan godaan korupsi yang nyata. Beberapa bulan pertama, saya merasa seperti ikan kecil di lautan politik yang kotor.

Tapi saya tetap konsisten dengan prinsip:
- **Hadir di rapat** - 100% tingkat kehadiran saya di Komisi
- **Transparan** - Publikasi laporan kerja setiap bulan
- **Pro rakyat** - Setiap RUU saya uji: apakah ini untungkan rakyat atau elite?
- **Tolak gratifikasi** - Sekecil apapun, saya tolak

## Pencapaian yang Membanggakan

Alhamdulillah, tahun pertama sudah ada beberapa capaian:
- Berhasil dorong revisi UU Agraria yang lebih pro petani
- Inisiasi program magang vokasi dengan 50 perusahaan besar
- Whistleblower korupsi di tender proyek infrastruktur
- Mendirikan "Posko Aspirasi Muda" yang jembatani aspirasi pemilih muda ke DPR

Tapi masih banyak PR. Sistem politik Indonesia butuh reformasi fundamental, dan itu tidak bisa dilakukan sendirian.

## Pesan untuk Generasi Muda yang Ingin Terjun ke Politik

1. **Politik itu mulia** - Jangan takut kotor, tapi pastikan Anda tidak ikut kotor
2. **Mulai dari akar rumput** - Jangan langsung ngejar kursi, bangun foundation dulu
3. **Edukasi diri** - Pahami kebijakan publik, sistem pemerintahan, dan ekonomi politik
4. **Build network** - Aliansi dengan CSO, akademisi, dan media massa
5. **Stay principled** - Ketika semua orang kompromi, prinsip adalah pembeda Anda
6. **Document everything** - Rekam jejak adalah aset terpenting dalam politik

## Visi Jangka Panjang

Target saya bukan hanya satu periode di DPR. Saya ingin membuktikan bahwa politik bersih itu mungkin, dan generasi muda bisa jadi agen perubahan yang efektif. 10 tahun ke depan, saya berharap lebih banyak alumni RK yang terjun ke politik - karena Indonesia butuh pemimpin berintegritas.

Terima kasih RK sudah mengajarkan bahwa kepemimpinan adalah amanah, bukan privilege. Politik adalah medan perjuangan untuk keadilan, bukan ajang cari kekayaan.
    `,
    tags: ['Politik', 'Kepemimpinan', 'DPR', 'Aktivisme', 'Reformasi'],
    relatedStories: ['3', '1']
  },
  '5': {
    id: '5',
    name: 'Siti Nurhaliza',
    batch: 'RK Angkatan 16',
    title: 'Merintis Bisnis Sosial Fashion Berkelanjutan',
    excerpt: 'Membangun brand fashion yang memberdayakan pengrajin lokal dan ramah lingkungan.',
    photo: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80',
    category: 'karir' as const,
    quote: 'Fashion bukan hanya tentang gaya, tapi tentang dampak - untuk lingkungan, untuk pengrajin, dan untuk masa depan planet kita.',
    publishedDate: '10 Desember 2024',
    readTime: '7 menit',
    heroImage: 'https://images.unsplash.com/photo-1558769132-cb1aea48f9d5?w=1200&q=80',
    content: `
TenunKita lahir dari keresahan saya melihat industri fashion yang eksploitatif dan merusak lingkungan. Sebagai pecinta fashion yang juga peduli lingkungan, saya yakin ada cara yang lebih baik - fashion yang indah, sustainable, dan memberdayakan.

## Dari Magang di Brand Internasional

Setelah lulus desain fashion tahun 2020, saya magang di brand fashion internasional. Di sana saya melihat langsung sisi gelap fast fashion: limbah tekstil masif, upah buruh yang tidak layak, dan siklus produksi yang destruktif terhadap lingkungan.

Pengalaman di RK tentang social entrepreneurship membuat saya bertanya: kenapa tidak buat brand sendiri yang berbeda? Brand yang profitable tapi juga purposeful.

## Menemukan Kekayaan Tenun Indonesia

Saya mulai riset tentang tekstil tradisional Indonesia. Perjalanan saya bawa ke Sumba, Toraja, Jepara, dan berbagai daerah penghasil tenun. Yang saya temukan sungguh luar biasa: keahlian pengrajin yang tinggi, motif yang kaya filosofi, tapi harga jual yang sangat rendah.

> "Fashion bukan hanya tentang gaya, tapi tentang dampak - untuk lingkungan, untuk pengrajin, dan untuk masa depan planet kita."

Masalahnya? Tidak ada akses pasar, tidak ada branding yang menarik milenial, dan rantai distribusi yang panjang sehingga pengrajin dapat margin sangat kecil. Di sinilah saya melihat peluang.

## Membangun TenunKita

TenunKita didirikan tahun 2021 dengan model bisnis yang berbeda:
- **Direct partnership** dengan pengrajin - kami beli langsung, tidak ada tengkulak
- **Fair pricing** - pengrajin dapat 60% dari harga jual, 3x lipat dari sistem konvensional
- **Modern design** - kolaborasi dengan desainer untuk bikin produk yang appeal ke anak muda
- **Zero waste production** - sisa kain dimanfaatkan untuk produk accessories

Koleksi pertama kami adalah tote bag dari tenun Sumba. Produksi 100 pcs, sold out dalam 2 minggu melalui Instagram. Itu yang memberi saya kepercayaan diri untuk scale up.

## Tantangan dan Breakthrough

Tahun pertama penuh tantangan:
- **Quality control** - koordinasi dengan pengrajin di berbagai daerah tidak mudah
- **Supply consistency** - produksi handmade butuh waktu, sementara demand tinggi
- **Marketing budget** - kompetisi dengan brand besar yang punya iklan masif
- **Edukasi konsumen** - banyak yang belum paham kenapa produk sustainable lebih mahal

Breakthrough datang ketika kami featured di media nasional dan dapat angel investment dari impact investor. Dana ini kami gunakan untuk:
- Membuka production hub di 3 daerah
- Training pengrajin tentang quality standard dan productivity
- Hiring tim marketing dan expansion retail

## Dampak Sosial yang Tercipta

3 tahun beroperasi, TenunKita telah:
- Bermitra dengan 150+ pengrajin di 8 provinsi
- Meningkatkan income pengrajin rata-rata 200%
- Produksi 10,000+ produk dengan zero waste
- Menyelamatkan 50+ ton limbah tekstil dari TPA
- Membuka 5 toko offline dan export ke 3 negara

Yang paling membanggakan adalah testimoni pengrajin. Ibu Mariana dari Sumba bilang: "Anak saya sekarang bisa kuliah karena income dari TenunKita. Terima kasih sudah hargai karya kami."

## Model Bisnis yang Profitable dan Purposeful

Banyak yang bilang bisnis sosial itu tidak bisa untung. TenunKita membuktikan sebaliknya. Tahun 2023, kami break even dengan revenue 2 miliar rupiah. Tahun 2024, kami targeting 5 miliar dan expansion ke fashion apparel.

Kunci suksesnya:
1. **Premium positioning** - kami jual value, bukan harga murah
2. **Strong storytelling** - setiap produk punya cerita tentang pengrajin
3. **Community engagement** - pelanggan kami adalah brand ambassador
4. **Innovation** - terus experiment dengan desain dan material baru

## Visi untuk Industri Fashion Indonesia

Impian saya adalah TenunKita menjadi bukti bahwa fashion Indonesia bisa bersaing global tanpa mengorbankan nilai sosial dan lingkungan. Kami sedang develop fashion tech platform yang connect pengrajin dengan designer dan buyer secara global.

Indonesia punya 300+ jenis tekstil tradisional. Bayangkan potensinya kalau semua diberdayakan dengan model bisnis yang berkelanjutan!

## Pesan untuk Entrepreneur Muda

1. **Purpose before profit** - Tapi profit tetap penting untuk sustainability
2. **Start small, think big** - TenunKita mulai dari 100 tote bag
3. **Learn from traditional** - Wisdom lokal adalah goldmine untuk inovasi
4. **Build community** - Pelanggan yang percaya misi Anda adalah aset terbesar
5. **Be patient** - Bisnis berkelanjutan butuh waktu, tidak instant

RK mengajarkan saya bahwa bisnis bisa jadi kendaraan untuk perubahan sosial. TenunKita adalah wujud nyata dari pembelajaran itu. Mari kita buktikan bahwa doing good dan doing well bisa berjalan beriringan!
    `,
    tags: ['Fashion', 'Sustainability', 'Social Business', 'Tenun', 'Entrepreneurship'],
    relatedStories: ['2', '6']
  },
  '6': {
    id: '6',
    name: 'Rizki Pratama',
    batch: 'RK Angkatan 11',
    title: 'Raih Beasiswa S3 di MIT untuk Riset AI',
    excerpt: 'Kisah sukses mendapatkan beasiswa penuh untuk program doktoral di Massachusetts Institute of Technology.',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    category: 'akademik' as const,
    quote: 'AI adalah tool yang powerful. Tugas kita adalah memastikan teknologi ini digunakan untuk kebaikan umat manusia, bukan sebaliknya.',
    publishedDate: '8 Desember 2024',
    readTime: '8 menit',
    heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    content: `
Ketika saya diterima di MIT dengan beasiswa penuh untuk program PhD di Computer Science, banyak yang bilang saya jenius. Tapi sebenarnya, ini adalah hasil dari kerja keras, strategic planning, dan support system yang solid dari RK dan keluarga.

## Fondasi di RK: Belajar Berpikir Sistematis

Tahun 2014, saya masuk RK sebagai mahasiswa teknik informatika yang biasa saja. IPK saya 3.2 - tidak terlalu tinggi, tidak terlalu rendah. Yang membuat saya berbeda adalah curiosity dan kemauan untuk terus belajar.

Di RK, saya belajar Critical Thinking dan Systems Thinking yang sangat berguna untuk riset AI nantinya. Kemampuan untuk break down masalah kompleks, think from first principles, dan connect the dots - itu semua diasah di RK.

## Menemukan Passion di Artificial Intelligence

Tahun 2015, saya ikut bootcamp Machine Learning yang diselenggarakan komunitas tech. Di sana, saya bertemu dengan dunia AI yang fascinating. Kemampuan komputer untuk belajar dari data, recognize patterns, dan make predictions - it blew my mind.

> "AI adalah tool yang powerful. Tugas kita adalah memastikan teknologi ini digunakan untuk kebaikan umat manusia, bukan sebaliknya."

Dari situlah saya fokus. Setiap hari saya belajar AI: online courses, research papers, personal projects. Saya bahkan rela skip hangout sama teman demi belajar neural networks dan deep learning.

## Membangun Track Record Riset

Untuk masuk top university, saya tahu harus punya research publications. Tapi dari mana mulainya? Saya mahasiswa S1 biasa, tidak ada koneksi dengan lab riset internasional.

Strategi saya:
1. **Join lab riset di kampus** - Saya volunteer di lab AI, helping professor dengan data cleaning
2. **Cari collaboration** - Email ke professor di luar negeri, offering untuk help dengan riset mereka
3. **Hackathon dan competition** - Ikut Kaggle competition, dapat ranking top 10
4. **Write medium articles** - Explain AI concepts, dapat ribuan views

Hasilnya: sebelum lulus S1, saya sudah punya 2 publikasi di conference internasional dan 1 journal paper (sebagai co-author).

## Persiapan Application MIT

Application ke MIT memakan waktu 1.5 tahun preparation:

**1. Test Preparation (6 bulan)**
- GRE: 170 Quantitative, 158 Verbal
- TOEFL: 110/120
- Kuncinya: konsisten belajar 2 jam sehari

**2. Research Proposal (4 bulan)**
- Topic: "Fair and Explainable AI for Healthcare"
- Saya pilih topic yang specific, relevant, dan sesuai expertise saya
- Minta feedback dari 5 professor dan 3 PhD students

**3. Statement of Purpose (3 bulan)**
- Tulis, revisi, repeat 15x
- Ceritakan journey, motivation, dan future goals dengan compelling
- Minta feedback dari alumni yang sudah di top universities

**4. Letters of Recommendation (2 bulan)**
- Cari professor yang benar-benar kenal saya dan karya saya
- Provide them dengan draft points yang bisa mereka elaborat

## Diterima di MIT: The Dream Comes True

Februari 2023, email dari MIT admission masuk. "Congratulations, you have been admitted to the PhD program..." Saya baca email itu 5x baru percaya. Beasiswa penuh: tuition, living expenses, health insurance - semua covered.

Yang membuat special adalah saya bisa riset dengan Professor Regina Barzilay, pemenang MacArthur Fellowship dan pioneer di AI for Healthcare. Ini opportunity yang tidak bisa saya tolak.

## Kehidupan di MIT: Challenge dan Growth

Semester pertama di MIT adalah reality check. Teman-teman sekelas saya adalah lulusan terbaik dari Stanford, Berkeley, Tsinghua. Level diskusi di kelas sangat tinggi. Impostor syndrome hit me hard.

Tapi saya ingat prinsip dari RK: growth mindset. Saya tidak harus jadi yang terpintar, saya harus jadi yang paling willing to learn. Setiap hari saya:
- Attend all lectures dan note-taking dengan detail
- Join study groups dan teach what I learn
- Office hours dengan professor untuk deeper discussion
- Read 3-5 research papers per week

Gradually, saya catch up. Bahkan di semester kedua, paper riset saya tentang "Fairness in Medical AI" accepted di top conference (NeurIPS).

## Riset AI untuk Healthcare di Indonesia

Meskipun riset saya di MIT, hati saya tetap di Indonesia. Saya sedang develop AI model untuk early detection penyakit tropis seperti TB dan DBD menggunakan data dari rumah sakit di Indonesia.

Kolaborasi dengan RS di Indonesia challenging tapi rewarding:
- Data privacy regulations yang ketat
- Data quality yang varied
- Infrastructure yang limited

Tapi ini adalah riset yang meaningful. Kalau berhasil, ini bisa save thousands of lives di Indonesia dan negara berkembang lainnya.

## Advice untuk Aspiring PhD Students

**1. Build Strong Foundation**
- IPK penting, tapi research experience lebih penting
- Start research early, even as undergrad

**2. Strategic Planning**
- Target universities yang research focus-nya align dengan passion Anda
- Build relationship dengan potential advisors sebelum apply

**3. Prepare Holistically**
- Test scores: penting tapi bukan segalanya
- Research publications: ini yang bikin application stand out
- Statement of Purpose: ini kesempatan Anda untuk storytelling

**4. Find Your Why**
- PhD itu marathon, bukan sprint. 5 tahun itu lama.
- Harus punya strong motivation untuk sustain energy

**5. Build Support System**
- Alumni network RK sangat membantu saya
- Mentor, peer support, family - semua crucial

## Visi ke Depan

Post-PhD, saya ingin kembali ke Indonesia untuk:
1. Establish AI research center yang fokus pada aplikasi AI untuk social good
2. Bridge gap antara academia dan industry
3. Mentor next generation AI researchers dari Indonesia

MIT adalah stepping stone, bukan destination. Destination saya adalah Indonesia yang unggul di AI research dan application.

Terima kasih RK sudah membuka mata saya bahwa dengan strategic planning, hard work, dan support system yang tepat - mimpi setinggi apapun bisa dicapai. MIT bukan lagi hanya mimpi, tapi kenyataan!
    `,
    tags: ['AI', 'MIT', 'Beasiswa', 'Research', 'Teknologi', 'Healthcare'],
    relatedStories: ['1', '2']
  },
};

export async function generateStaticParams() {
  return Object.keys(storiesData).map((id) => ({
    id: id,
  }));
}

export default function StoryDetailPage({ params }: { params: { id: string } }) {
  const story = storiesData[params.id as keyof typeof storiesData];

  if (!story) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <StoryDetail story={story} />
      <Footer />
    </div>
  );
}
