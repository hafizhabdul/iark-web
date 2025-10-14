'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Alumni } from '@/components/features/dashboard/AlumniCard';
import { ArrowLeft, Mail, Linkedin, MapPin, Briefcase, GraduationCap, Calendar, Award } from 'lucide-react';

// Mock alumni data (same as directory - in real app this would come from API/database)
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

export default function AlumniDetailPage() {
  const params = useParams();
  const router = useRouter();
  const alumniId = params.id as string;

  // Find alumni by ID
  const alumni = mockAlumni.find((a) => a.id === alumniId);

  if (!alumni) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Alumni not found</h2>
          <p className="text-gray-600 mb-4">The alumni profile you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/dashboard/alumni')}
            className="text-iark-red hover:underline font-semibold"
          >
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-iark-red/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-10 h-10 bg-iark-yellow rounded-full opacity-20 animate-pulse-slow pointer-events-none" />
      <div className="absolute top-2/3 left-20 w-8 h-8 bg-iark-red rounded-full opacity-20 animate-drift pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto p-6 lg:p-8">
        {/* Back Button */}
        <motion.button
          onClick={() => router.push('/dashboard/alumni')}
          className="flex items-center gap-2 text-gray-600 hover:text-iark-red mb-6 font-semibold transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowLeft size={20} />
          Back to Directory
        </motion.button>

        {/* Header Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-iark-red/20">
              {alumni.avatar ? (
                <Image src={alumni.avatar} alt={alumni.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-iark-red flex items-center justify-center text-white font-bold text-4xl">
                  {alumni.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{alumni.name}</h1>
              <p className="text-xl text-iark-red font-semibold mb-4">
                {alumni.currentRole} @ {alumni.company}
              </p>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={18} />
                  <span>Angkatan {alumni.batch}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={18} />
                  <span>{alumni.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase size={18} />
                  <span>{alumni.field}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <motion.a
                  href={`mailto:${alumni.email}`}
                  className="flex items-center gap-2 px-4 py-2 bg-iark-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail size={18} />
                  Email
                </motion.a>
                {alumni.linkedin && (
                  <motion.a
                    href={alumni.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Linkedin size={18} />
                    LinkedIn
                  </motion.a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
          <p className="text-gray-700 leading-relaxed">{alumni.bio}</p>
        </motion.div>

        {/* Skills Section */}
        {alumni.skills && alumni.skills.length > 0 && (
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award size={24} className="text-iark-red" />
              Skills & Expertise
            </h2>
            <div className="flex flex-wrap gap-3">
              {alumni.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-iark-red/10 text-iark-red rounded-full font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Experience Section */}
          {alumni.experience && alumni.experience.length > 0 && (
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase size={24} className="text-iark-red" />
                Experience
              </h2>
              <div className="space-y-4">
                {alumni.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-iark-red pl-4">
                    <h3 className="font-bold text-gray-900">{exp.title}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.period}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Education Section */}
          {alumni.education && alumni.education.length > 0 && (
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap size={24} className="text-iark-red" />
                Education
              </h2>
              <div className="space-y-4">
                {alumni.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-iark-blue pl-4">
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500">{edu.year}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* IARK Programs Section */}
        {alumni.programs && alumni.programs.length > 0 && (
          <motion.div
            className="bg-gradient-to-br from-iark-red/5 to-iark-blue/5 rounded-2xl shadow-lg p-8 mt-6 border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">IARK Involvement</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {alumni.programs.map((program, index) => (
                <div
                  key={index}
                  className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200 flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-iark-red rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 font-medium">{program}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
