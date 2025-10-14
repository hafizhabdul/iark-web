'use client';

import { useState } from 'react';
import { AlumniCard, Alumni } from '@/components/features/dashboard/AlumniCard';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { motion } from 'framer-motion';

// Mock alumni data
const mockAlumni: Alumni[] = [
  {
    id: '1',
    name: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    batch: '2018',
    field: 'Technology',
    location: 'Jakarta',
    avatar: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=E21C24&color=fff',
    bio: 'Passionate technologist and social entrepreneur committed to leveraging technology for positive impact. Alumni of Rumah Kepemimpinan with 6+ years of experience in software engineering and community development.',
    currentRole: 'Senior Software Engineer',
    company: 'Tech for Good Indonesia',
    skills: ['React', 'Node.js', 'Leadership', 'Community Building', 'Social Impact'],
    linkedin: 'https://linkedin.com/in/budisantoso',
    programs: ['Leadership Training 2018', 'Tech Innovation Workshop', 'Alumni Mentorship Program'],
    experience: [
      { title: 'Senior Software Engineer', company: 'Tech for Good Indonesia', period: '2021 - Present' },
      { title: 'Software Engineer', company: 'Startup Hub Jakarta', period: '2018 - 2021' },
    ],
    education: [
      { degree: 'Bachelor of Computer Science', institution: 'Universitas Indonesia', year: '2018' },
    ],
  },
  {
    id: '2',
    name: 'Siti Nurhaliza',
    email: 'siti.nurhaliza@email.com',
    batch: '2019',
    field: 'Education',
    location: 'Bandung',
    avatar: 'https://ui-avatars.com/api/?name=Siti+Nurhaliza&background=1E40AF&color=fff',
    bio: 'Dedicated educator and advocate for quality education for all. Experienced in curriculum development and teacher training programs across Indonesia.',
    currentRole: 'Education Program Manager',
    company: 'Teach for Indonesia',
    skills: ['Curriculum Development', 'Teacher Training', 'Educational Leadership', 'Community Engagement'],
    linkedin: 'https://linkedin.com/in/sitinurhaliza',
    programs: ['Education Leadership Program', 'Community Outreach Initiative 2019'],
    experience: [
      { title: 'Education Program Manager', company: 'Teach for Indonesia', period: '2020 - Present' },
      { title: 'Teacher & Curriculum Developer', company: 'Sekolah Penggerak', period: '2019 - 2020' },
    ],
    education: [
      { degree: 'Master of Education', institution: 'Universitas Pendidikan Indonesia', year: '2019' },
    ],
  },
  {
    id: '3',
    name: 'Ahmad Yani',
    email: 'ahmad.yani@email.com',
    batch: '2017',
    field: 'Healthcare',
    location: 'Surabaya',
    avatar: 'https://ui-avatars.com/api/?name=Ahmad+Yani&background=059669&color=fff',
    bio: 'Healthcare innovator focused on improving access to quality medical services in remote areas. Leading telemedicine initiatives and community health programs across Eastern Indonesia.',
    currentRole: 'Healthcare Innovation Lead',
    company: 'Halodoc',
    skills: ['Healthcare Management', 'Telemedicine', 'Public Health', 'Project Management', 'Community Health'],
    linkedin: 'https://linkedin.com/in/ahmadyani',
    programs: ['Leadership Training 2017', 'Healthcare Innovation Summit', 'Rural Health Initiative'],
    experience: [
      { title: 'Healthcare Innovation Lead', company: 'Halodoc', period: '2019 - Present' },
      { title: 'Community Health Coordinator', company: 'Kementerian Kesehatan RI', period: '2017 - 2019' },
    ],
    education: [
      { degree: 'Bachelor of Public Health', institution: 'Universitas Airlangga', year: '2017' },
    ],
  },
  {
    id: '4',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@email.com',
    batch: '2020',
    field: 'Business',
    location: 'Yogyakarta',
    avatar: 'https://ui-avatars.com/api/?name=Dewi+Lestari&background=DC2626&color=fff',
    bio: 'Social entrepreneur empowering local artisans and women-owned businesses through sustainable business models. Building bridges between traditional crafts and modern markets.',
    currentRole: 'Founder & CEO',
    company: 'Karya Nusantara',
    skills: ['Social Entrepreneurship', 'Business Development', 'Supply Chain Management', 'Women Empowerment', 'Marketing'],
    linkedin: 'https://linkedin.com/in/dewilestari',
    programs: ['Entrepreneurship Training 2020', 'Women Leadership Program', 'Social Business Workshop'],
    experience: [
      { title: 'Founder & CEO', company: 'Karya Nusantara', period: '2020 - Present' },
      { title: 'Business Development Manager', company: 'ANGIN (Angel Investment Network Indonesia)', period: '2018 - 2020' },
    ],
    education: [
      { degree: 'Bachelor of Business Administration', institution: 'Universitas Gadjah Mada', year: '2018' },
    ],
  },
  {
    id: '5',
    name: 'Rudi Hartono',
    email: 'rudi.hartono@email.com',
    batch: '2018',
    field: 'Social Impact',
    location: 'Semarang',
    avatar: 'https://ui-avatars.com/api/?name=Rudi+Hartono&background=7C3AED&color=fff',
    bio: 'Community organizer and advocate for youth empowerment in underserved communities. Passionate about creating pathways for young leaders to drive social change through grassroots movements.',
    currentRole: 'Program Director',
    company: 'Indonesia Mengajar',
    skills: ['Community Organizing', 'Youth Development', 'Program Management', 'Advocacy', 'Public Speaking'],
    linkedin: 'https://linkedin.com/in/rudihartono',
    programs: ['Leadership Training 2018', 'Community Development Program', 'Alumni Mentorship Program'],
    experience: [
      { title: 'Program Director', company: 'Indonesia Mengajar', period: '2020 - Present' },
      { title: 'Community Development Officer', company: 'Plan International Indonesia', period: '2018 - 2020' },
    ],
    education: [
      { degree: 'Bachelor of Sociology', institution: 'Universitas Diponegoro', year: '2018' },
    ],
  },
  {
    id: '6',
    name: 'Maya Putri',
    email: 'maya.putri@email.com',
    batch: '2019',
    field: 'Environment',
    location: 'Bali',
    avatar: 'https://ui-avatars.com/api/?name=Maya+Putri&background=EA580C&color=fff',
    bio: 'Environmental activist and marine conservation specialist working to protect Indonesia\'s ocean ecosystems. Leading coastal community initiatives for sustainable fishing and plastic waste reduction.',
    currentRole: 'Marine Conservation Manager',
    company: 'WWF Indonesia',
    skills: ['Marine Conservation', 'Environmental Policy', 'Community Engagement', 'Sustainability', 'Research & Analysis'],
    linkedin: 'https://linkedin.com/in/mayaputri',
    programs: ['Environmental Leadership 2019', 'Conservation Workshop', 'Sustainable Development Training'],
    experience: [
      { title: 'Marine Conservation Manager', company: 'WWF Indonesia', period: '2021 - Present' },
      { title: 'Environmental Education Coordinator', company: 'Coral Triangle Center', period: '2019 - 2021' },
    ],
    education: [
      { degree: 'Master of Environmental Science', institution: 'Institut Pertanian Bogor', year: '2019' },
    ],
  },
  {
    id: '7',
    name: 'Andi Wijaya',
    email: 'andi.wijaya@email.com',
    batch: '2021',
    field: 'Technology',
    location: 'Medan',
    avatar: 'https://ui-avatars.com/api/?name=Andi+Wijaya&background=0891B2&color=fff',
    bio: 'Full-stack developer and tech educator bridging the digital divide in rural Indonesia. Building educational platforms and training programs to equip youth with in-demand digital skills.',
    currentRole: 'Lead Software Engineer',
    company: 'Ruangguru',
    skills: ['Full-Stack Development', 'EdTech', 'Mobile Development', 'Tech Training', 'Product Management'],
    linkedin: 'https://linkedin.com/in/andiwijaya',
    programs: ['Leadership Training 2021', 'Tech Innovation Workshop', 'Digital Literacy Initiative'],
    experience: [
      { title: 'Lead Software Engineer', company: 'Ruangguru', period: '2022 - Present' },
      { title: 'Software Engineer', company: 'Gojek', period: '2021 - 2022' },
    ],
    education: [
      { degree: 'Bachelor of Computer Engineering', institution: 'Universitas Sumatera Utara', year: '2021' },
    ],
  },
  {
    id: '8',
    name: 'Rina Kusuma',
    email: 'rina.kusuma@email.com',
    batch: '2020',
    field: 'Arts & Culture',
    location: 'Malang',
    avatar: 'https://ui-avatars.com/api/?name=Rina+Kusuma&background=DB2777&color=fff',
    bio: 'Cultural heritage advocate and performing arts director preserving and modernizing traditional Indonesian arts. Creating platforms for young artists to explore their cultural identity through contemporary expressions.',
    currentRole: 'Cultural Program Director',
    company: 'Taman Budaya Jawa Timur',
    skills: ['Cultural Management', 'Performing Arts', 'Event Production', 'Community Arts', 'Heritage Preservation'],
    linkedin: 'https://linkedin.com/in/rinakusuma',
    programs: ['Arts Leadership 2020', 'Cultural Innovation Workshop', 'Community Arts Initiative'],
    experience: [
      { title: 'Cultural Program Director', company: 'Taman Budaya Jawa Timur', period: '2021 - Present' },
      { title: 'Arts Coordinator', company: 'Institut Kesenian Jakarta', period: '2020 - 2021' },
    ],
    education: [
      { degree: 'Bachelor of Performing Arts', institution: 'Institut Seni Indonesia Yogyakarta', year: '2020' },
    ],
  },
];

export default function AlumniDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');

  // Filter alumni based on search and batch
  const filteredAlumni = mockAlumni.filter((alumni) => {
    const matchesSearch = alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alumni.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alumni.field.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch = !selectedBatch || alumni.batch === selectedBatch;
    return matchesSearch && matchesBatch;
  });

  // Get unique batches for filter
  const batches = Array.from(new Set(mockAlumni.map((a) => a.batch))).sort();

  // Create dropdown options
  const batchOptions = [
    { value: '', label: 'All Batches' },
    ...batches.map(batch => ({ value: batch, label: `Angkatan ${batch}` }))
  ];

  const handleAlumniClick = (alumni: Alumni) => {
    // Use Next.js router for client-side navigation (no page reload)
    window.location.href = `/dashboard/alumni/${alumni.id}`;
  };

  return (
    <div className="relative min-h-screen bg-white p-6 lg:p-8 overflow-hidden">
      {/* Subtle gradient orbs background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-iark-red/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative small elements with animations */}
      <div className="absolute top-20 right-1/4 w-10 h-10 bg-iark-yellow rounded-full opacity-20 animate-pulse-slow pointer-events-none" />
      <div className="absolute top-1/2 left-16 w-8 h-8 bg-iark-red rounded-full opacity-20 animate-drift pointer-events-none" />
      <div className="absolute bottom-1/3 right-20 w-12 h-12 bg-iark-blue rounded-full opacity-30 animate-pulse-slow pointer-events-none" />

      {/* Main content - with relative positioning to stay above decorations */}
      <div className="relative z-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Alumni Directory</h1>
        <p className="text-gray-600">Browse and connect with IARK alumni members</p>
      </div>

      {/* Search & Filter */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by name, email, or field..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-iark-red focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Batch Filter */}
        <div className="sm:w-48">
          <CustomDropdown
            options={batchOptions}
            value={selectedBatch}
            onChange={setSelectedBatch}
            placeholder="All Batches"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredAlumni.length}</span> of{' '}
          <span className="font-semibold text-gray-900">{mockAlumni.length}</span> alumni
        </p>
      </div>

      {/* Alumni Grid */}
      {filteredAlumni.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredAlumni.map((alumni, index) => (
            <motion.div
              key={alumni.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <AlumniCard alumni={alumni} onClick={() => handleAlumniClick(alumni)} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No alumni found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
      </div>
    </div>
  );
}
