'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/lib/supabase/types';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'alumni' | 'public';
  angkatan?: number | null;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Fetch profile data
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // Only log non-abort errors
        const isAbort = error.message?.includes('AbortError') ||
          error.details?.includes('AbortError') ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any).name === 'AbortError';

        if (!isAbort) {
          console.error('Error fetching profile:', error);
        }
        return null;
      }

      return data as Profile;
    } catch (err) {
      // Silently ignore abort errors
      return null;
    }
  };

  // Set user from Supabase user and profile
  const setUserFromSupabase = (supabaseUser: User | null, profileData: Profile | null) => {
    if (supabaseUser && profileData) {
      setUser({
        id: supabaseUser.id,
        name: profileData.name,
        email: profileData.email,
        avatar: profileData.photo || undefined,
        role: profileData.role,
        angkatan: profileData.angkatan,
      });
      setProfile(profileData);
    } else {
      setUser(null);
      setProfile(null);
    }
  };

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();

        if (supabaseUser && isMounted) {
          const profileData = await fetchProfile(supabaseUser.id);
          if (isMounted) {
            setUserFromSupabase(supabaseUser, profileData);
          }
        }
      } catch (error) {
        // Silently ignore abort errors
        if (error instanceof Error && !error.message.includes('AbortError')) {
          console.error('Error initializing auth:', error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          const profileData = await fetchProfile(session.user.id);
          if (isMounted) {
            setUserFromSupabase(session.user, profileData);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        const profileData = await fetchProfile(data.user.id);
        setUserFromSupabase(data.user, profileData);
        
        // Redirect admin to admin panel, others to dashboard
        const redirectPath = profileData?.role === 'admin' ? '/admin' : '/dashboard';
        router.push(redirectPath);
      }

      return { error: null };
    } catch (err) {
      return { error: 'Terjadi kesalahan saat login' };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      // Profile will be auto-created by database trigger
      return { error: null };
    } catch (err) {
      return { error: 'Terjadi kesalahan saat mendaftar' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.push('/');
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) {
        return { error: error.message };
      }

      // Refresh profile
      const profileData = await fetchProfile(user.id);
      if (profileData) {
        setProfile(profileData);
        setUser((prev) => prev ? {
          ...prev,
          name: profileData.name,
          avatar: profileData.photo || undefined,
          angkatan: profileData.angkatan,
        } : null);
      }

      return { error: null };
    } catch (err) {
      return { error: 'Terjadi kesalahan saat update profile' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
        isAdmin: user?.role === 'admin',
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
