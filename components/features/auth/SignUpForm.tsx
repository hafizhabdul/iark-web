'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { SocialButton } from './SocialButton';
import { useAuth } from '@/components/providers/AuthContext';

export function SignUpForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      alert('Password tidak cocok!');
      return;
    }

    // Simple validation: all fields must not be empty
    if (name.trim() && email.trim() && password.trim()) {
      login(email, name);
    }
  };

  const handleGoogleSignUp = () => {
    // Mock Google sign up - using a default email
    login('user@google.com', 'Google User');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Bergabung dengan IARK
          </h1>
          <p className="text-gray-600">
            Mulai perjalanan kontribusi Anda hari ini
          </p>
        </div>

        {/* Social Login */}
        <div className="mb-6">
          <SocialButton provider="google" onClick={handleGoogleSignUp} />
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">atau</span>
          </div>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-iark-red focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-iark-red focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-iark-red focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
              required
              minLength={8}
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              Konfirmasi Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-iark-red focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
              required
              minLength={8}
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full bg-iark-red text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            Daftar
          </motion.button>
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <Link href="/masuk" className="text-iark-red hover:underline font-semibold">
            Masuk di sini
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
