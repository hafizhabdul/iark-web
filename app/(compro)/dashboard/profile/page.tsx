'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/providers/AuthContext';
import { useRouter } from 'next/navigation';
import {
    User,
    Briefcase,
    MapPin,
    Calendar,
    Building,
    Save,
    ArrowLeft,
    Camera,
    Loader2,
    Linkedin,
    Instagram,
    Phone,
} from 'lucide-react';
import Image from 'next/image';

export default function ProfileEditPage() {
    const { user, profile, updateProfile, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        angkatan: '',
        job_title: '',
        company: '',
        location: '',
        bio: '',
        linkedin: '',
        instagram: '',
        phone: '',
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                angkatan: profile.angkatan?.toString() || '',
                job_title: profile.job_title || '',
                company: profile.company || '',
                location: profile.location || '',
                bio: profile.bio || '',
                linkedin: profile.linkedin || '',
                instagram: profile.instagram || '',
                phone: profile.phone || '',
            });
        }
    }, [profile]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-iark-red animate-spin" />
            </div>
        );
    }

    if (!user) {
        router.push('/masuk');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess(false);

        const result = await updateProfile({
            name: formData.name,
            angkatan: formData.angkatan ? parseInt(formData.angkatan) : null,
            job_title: formData.job_title,
            company: formData.company,
            location: formData.location,
            bio: formData.bio,
            linkedin: formData.linkedin,
            instagram: formData.instagram,
            phone: formData.phone,
        });

        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }
        setIsLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="relative min-h-screen bg-gray-50 pb-20 overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-iark-red/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 pt-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-600 hover:text-iark-red mb-4 font-semibold transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Kembali
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Profil</h1>
                        <p className="text-gray-600">Perbarui informasi diri Anda untuk koneksi yang lebih baik</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        {/* Cover/Header area in card */}
                        <div className="h-32 bg-gradient-to-r from-iark-red to-iark-blue opacity-90" />

                        <div className="px-8 pb-8">
                            {/* Profile Avatar Section */}
                            <div className="relative -mt-16 mb-8 flex items-end gap-6">
                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                                    {profile?.photo ? (
                                        <Image src={profile.photo} alt={formData.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-iark-red flex items-center justify-center text-white font-bold text-4xl">
                                            {formData.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="text-white w-8 h-8" />
                                    </div>
                                </div>
                                <div className="pb-2">
                                    <h2 className="text-2xl font-bold text-gray-900">{formData.name}</h2>
                                    <p className="text-gray-600">{user.email}</p>
                                </div>
                            </div>

                            {/* Status Messages */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-3">
                                    <div className="w-2 h-2 bg-red-600 rounded-full" />
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                                    Profil berhasil diperbarui!
                                </div>
                            )}

                            {/* Sections */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Personal Info */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                                        <User size={18} className="text-iark-red" />
                                        Informasi Pribadi
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 bg-gray-50 border-2 border-transparent rounded-lg focus:bg-white focus:border-iark-red focus:outline-none transition-all"
                                                placeholder="Nama lengkap Anda"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                                <Calendar size={14} />
                                                Angkatan RK
                                            </label>
                                            <input
                                                type="number"
                                                name="angkatan"
                                                value={formData.angkatan}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 bg-gray-50 border-2 border-transparent rounded-lg focus:bg-white focus:border-iark-red focus:outline-none transition-all"
                                                placeholder="Contoh: 18"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                                <MapPin size={14} />
                                                Domisili Saat Ini
                                            </label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 bg-gray-50 border-2 border-transparent rounded-lg focus:bg-white focus:border-iark-red focus:outline-none transition-all"
                                                placeholder="Contoh: Jakarta Selatan"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                                <Phone size={14} />
                                                No. WhatsApp
                                            </label>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 bg-gray-50 border-2 border-transparent rounded-lg focus:bg-white focus:border-iark-red focus:outline-none transition-all"
                                                placeholder="Contoh: 0812..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Professional Info */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                                        <Briefcase size={18} className="text-iark-blue" />
                                        Profesional
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                                Pekerjaan / Jabatan
                                            </label>
                                            <input
                                                type="text"
                                                name="job_title"
                                                value={formData.job_title}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 bg-gray-50 border-2 border-transparent rounded-lg focus:bg-white focus:border-iark-blue focus:outline-none transition-all"
                                                placeholder="Contoh: Software Engineer"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                                <Building size={14} />
                                                Instansi / Perusahaan
                                            </label>
                                            <input
                                                type="text"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 bg-gray-50 border-2 border-transparent rounded-lg focus:bg-white focus:border-iark-blue focus:outline-none transition-all"
                                                placeholder="Contoh: Google Indonesia"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                                <Linkedin size={14} />
                                                Link LinkedIn
                                            </label>
                                            <input
                                                type="text"
                                                name="linkedin"
                                                value={formData.linkedin}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 bg-gray-50 border-2 border-transparent rounded-lg focus:bg-white focus:border-iark-blue focus:outline-none transition-all"
                                                placeholder="https://linkedin.com/in/..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                                <Instagram size={14} />
                                                Username Instagram
                                            </label>
                                            <input
                                                type="text"
                                                name="instagram"
                                                value={formData.instagram}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 bg-gray-50 border-2 border-transparent rounded-lg focus:bg-white focus:border-iark-blue focus:outline-none transition-all"
                                                placeholder="@username"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Bio Section - Full Width */}
                                <div className="md:col-span-2 space-y-4">
                                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Bio Singkat</h3>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-iark-red focus:outline-none transition-all resize-none"
                                        placeholder="Ceritakan sedikit tentang diri Anda..."
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-10 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-iark-red text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 active:translate-y-0"
                                >
                                    {isLoading ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <Save size={20} />
                                    )}
                                    {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
