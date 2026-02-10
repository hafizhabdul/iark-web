'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SocialButton } from './SocialButton';
import { useAuth } from '@/components/providers/AuthContext';
import { createClient } from '@/lib/supabase/client';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await signIn(email, password);
    
    if (result.error) {
      setError(result.error);
    } else {
      const redirectTo = searchParams.get('redirectTo');
      if (redirectTo) {
        window.location.href = redirectTo;
        return;
      }
    }
    
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    const supabase = createClient();
    const params = new URLSearchParams(window.location.search);
    const redirectTo = params.get('redirectTo');
    const callbackUrl = new URL('/auth/callback', window.location.origin);
    if (redirectTo) {
      callbackUrl.searchParams.set('next', redirectTo);
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });
    
    if (error) {
      setError(error.message);
    }
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
            Selamat Datang Kembali
          </h1>
          <p className="text-gray-600">
            Masuk untuk melanjutkan kontribusi Anda
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Social Login */}
        <div className="mb-6">
          <SocialButton provider="google" onClick={handleGoogleSignIn} />
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

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              href="/lupa-password"
              className="text-sm text-iark-red hover:underline font-semibold"
            >
              Lupa password?
            </Link>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full bg-iark-red text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </motion.button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?{' '}
          <Link href="/daftar" className="text-iark-red hover:underline font-semibold">
            Daftar sekarang
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
