'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
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
  const signOutFlagRef = useRef<(value: boolean) => void>(() => { });

  // Fetch profile data with retry for production resilience
  const fetchProfile = async (userId: string, retries = 2): Promise<Profile | null> => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          const errorMsg = error.message?.toLowerCase() || '';
          const isAbort = errorMsg.includes('abort') ||
            (error as { name?: string }).name === 'AbortError' ||
            String((error as { code?: string | number }).code) === '20';

          if (isAbort) return null;

          // Retry on transient errors
          if (attempt < retries) {
            await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
            continue;
          }
          console.error('Error fetching profile:', error);
          return null;
        }

        return data as Profile;
      } catch (err: any) {
        const errMsg = err?.message?.toLowerCase() || '';
        if (errMsg.includes('abort') || err?.name === 'AbortError') return null;

        if (attempt < retries) {
          await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
          continue;
        }
        console.error('Unexpected profile fetch error:', err);
        return null;
      }
    }
    return null;
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

  const profileRef = useRef<Profile | null>(null);
  const fetchingProfileRef = useRef<string | null>(null);

  // Keep profileRef in sync with profile state
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;
    let isSigningOut = false;

    // Safety timeout: if onAuthStateChange never fires (e.g., network issues),
    // stop showing loading after 5 seconds
    const loadingTimeout = setTimeout(() => {
      if (isMounted && isLoading) {
        setIsLoading(false);
      }
    }, 5000);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        if (!isMounted || isSigningOut) return;

        if (session?.user) {
          // Only fetch profile if we don't have it for this user yet
          // and no other fetch is in progress for this user (prevents race with signIn)
          if (
            profileRef.current?.id !== session.user.id &&
            fetchingProfileRef.current !== session.user.id
          ) {
            fetchingProfileRef.current = session.user.id;
            try {
              const profileData = await fetchProfile(session.user.id);
              if (isMounted) {
                setUserFromSupabase(session.user, profileData);
              }
            } catch (error) {
              console.error('Error in auth state change:', error);
            } finally {
              fetchingProfileRef.current = null;
            }
          }
        } else {
          if (isMounted) {
            setUser(null);
            setProfile(null);
          }
        }

        if (isMounted) {
          setIsLoading(false);
        }
      }
    );

    // Expose signout flag setter
    signOutFlagRef.current = (value: boolean) => { isSigningOut = value; };

    return () => {
      isMounted = false;
      clearTimeout(loadingTimeout);
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
        // Set fetching ref to prevent onAuthStateChange from racing
        fetchingProfileRef.current = data.user.id;
        try {
          const profileData = await fetchProfile(data.user.id);
          setUserFromSupabase(data.user, profileData);

          // Redirect admin to admin panel, others to dashboard
          const redirectPath = profileData?.role === 'admin' ? '/admin' : '/dashboard';
          router.push(redirectPath);
        } finally {
          fetchingProfileRef.current = null;
        }
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
    // Prevent onAuthStateChange from racing with manual state clear
    signOutFlagRef.current(true);
    setUser(null);
    setProfile(null);
    await supabase.auth.signOut();
    router.push('/');
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { error } = await supabase
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
