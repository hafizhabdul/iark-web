-- Migration: Add regional and kampus fields to profiles
-- Run this in Supabase SQL Editor

-- Add new columns
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS regional TEXT,
ADD COLUMN IF NOT EXISTS kampus TEXT;

-- Create indexes for filtering
CREATE INDEX IF NOT EXISTS idx_profiles_angkatan ON profiles(angkatan);
CREATE INDEX IF NOT EXISTS idx_profiles_regional ON profiles(regional);
CREATE INDEX IF NOT EXISTS idx_profiles_kampus ON profiles(kampus);

-- Update RLS policies if needed (profiles should already have proper RLS)
