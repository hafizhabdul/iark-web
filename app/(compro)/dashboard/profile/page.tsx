'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/providers/AuthContext';
import { useRouter } from 'next/navigation';
import {
    User,
    Save,
    ArrowLeft,
    Camera,
    Loader2,
    Phone,
    MapPin,
    Building,
    GraduationCap,
    Home,
} from 'lucide-react';
import Image from 'next/image';
import { REGIONAL_OPTIONS, ANGKATAN_OPTIONS } from '@/lib/constants/regional';
import { fetchDormitories } from '@/lib/queries/homepage';
import { createClient } from '@/lib/supabase/client';
import type { Dormitory } from '@/lib/supabase/types';

export default function ProfileEditPage() {
    const { user, profile, updateProfile, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [dormitories, setDormitories] = useState<Dormitory[]>([]);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        angkatan: '',
        regional: '',
        kampus: '',
        asrama: '',
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                phone: profile.phone || '',
                angkatan: profile.angkatan?.toString() || '',
                regional: profile.regional || '',
                kampus: profile.kampus || '',
                asrama: profile.asrama || '',
            });
            if (profile.photo) {
                setPhotoPreview(profile.photo);
            }
        }
    }, [profile]);

    useEffect(() => {
        const loadDormitories = async () => {
            try {
                const data = await fetchDormitories();
                setDormitories(data || []);
            } catch (err) {
                console.error('Failed to fetch dormitories:', err);
            }
        };
        loadDormitories();
    }, []);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/masuk');
        }
    }, [authLoading, user, router]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-iark-red animate-spin" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError('Ukuran foto maksimal 2MB');
                return;
            }
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadPhoto = async (): Promise<string | null> => {
        if (!photoFile || !user) return null;

        setUploadingPhoto(true);
        try {
            const supabase = createClient();
            const fileExt = photoFile.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `profiles/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, photoFile, { upsert: true });

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            return data.publicUrl;
        } catch (err) {
            console.error('Photo upload error:', err);
            setError('Gagal mengupload foto');
            return null;
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            setError('Nama lengkap wajib diisi');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess(false);

        let photoUrl: string | null | undefined = undefined;
        if (photoFile) {
            photoUrl = await uploadPhoto();
            if (photoUrl === null && photoFile) {
                setIsLoading(false);
                return;
            }
        }

        const updateData: Record<string, unknown> = {
            name: formData.name.trim(),
            phone: formData.phone || null,
            angkatan: formData.angkatan ? parseInt(formData.angkatan) : null,
            regional: formData.regional || null,
            kampus: formData.kampus || null,
            asrama: formData.asrama || null,
        };

        if (photoUrl) {
            updateData.photo = photoUrl;
        }

        const result = await updateProfile(updateData);

        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(true);
            setPhotoFile(null);
            setTimeout(() => setSuccess(false), 3000);
        }
        setIsLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="relative min-h-screen bg-gray-50 pb-20 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-iark-red/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 pt-10">
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
                        <p className="text-gray-600">Perbarui informasi diri Anda</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        <div className="h-32 bg-gradient-to-r from-iark-red to-iark-blue opacity-90" />

                        <div className="px-8 pb-8">
                            <div className="relative -mt-16 mb-8 flex items-end gap-6">
                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                                    {photoPreview ? (
                                        <Image src={photoPreview} alt={formData.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-iark-red flex items-center justify-center text-white font-bold text-4xl">
                                            {formData.name.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                                        disabled={uploadingPhoto}
                                    >
                                        {uploadingPhoto ? (
                                            <Loader2 className="text-white w-8 h-8 animate-spin" />
                                        ) : (
                                            <Camera className="text-white w-8 h-8" />
                                        )}
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                    />
                                </div>
                                <div className="pb-2">
                                    <h2 className="text-2xl font-bold text-gray-900">{formData.name || 'Nama Anda'}</h2>
                                    <p className="text-gray-600">{user.email}</p>
                                    <p className="text-sm text-gray-400 mt-1">Klik foto untuk mengubah</p>
                                </div>
                            </div>

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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                                        <User size={18} className="text-iark-red" />
                                        Informasi Pribadi
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Nama Lengkap <span className="text-red-500">*</span>
                                            </label>
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
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={user.email}
                                                disabled
                                                className="w-full px-4 py-2 bg-gray-100 border-2 border-transparent rounded-lg text-gray-500 cursor-not-allowed"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                                <Phone size={14} />
                                                No HP
                                            </label>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 bg-gray-50 border-2 border-transparent rounded-lg focus:bg-white focus:border-iark-red focus:outline-none transition-all"
                                                placeholder="08xxxxxxxxxx"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                                <GraduationCap size={14} />
                                                Angkatan
                                            </label>
                                            <select
                                                name="angkatan"
                                                value={formData.angkatan}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 bg-gray-50 border-2 border-transparent rounded-lg focus:bg-white focus:border-iark-red focus:outline-none transition-all"
                                            >
                                                <option value="">Pilih Angkatan</option>
                                                {ANGKATAN_OPTIONS.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                                        <MapPin size={18} className="text-iark-blue" />
                                        Informasi Lokasi
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                                <MapPin size={14} />
                                                Regional
                                            </label>
                                            <select
                                                name="regional"
                                                value={formData.regional}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 bg-gray-50 border-2 border-transparent rounded-lg focus:bg-white focus:border-iark-blue focus:outline-none transition-all"
                                            >
                                                <option value="">Pilih Regional</option>
                                                {REGIONAL_OPTIONS.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                                <Building size={14} />
                                                Kampus
                                            </label>
                                            <input
                                                type="text"
                                                name="kampus"
                                                value={formData.kampus}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 bg-gray-50 border-2 border-transparent rounded-lg focus:bg-white focus:border-iark-blue focus:outline-none transition-all"
                                                placeholder="Contoh: Universitas Indonesia"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                                <Home size={14} />
                                                Asrama
                                            </label>
                                            <select
                                                name="asrama"
                                                value={formData.asrama}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 bg-gray-50 border-2 border-transparent rounded-lg focus:bg-white focus:border-iark-blue focus:outline-none transition-all"
                                            >
                                                <option value="">Pilih Asrama</option>
                                                {dormitories.map((dorm) => (
                                                    <option key={dorm.id} value={dorm.name}>
                                                        {dorm.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading || uploadingPhoto}
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
