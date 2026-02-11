-- Migration: Add is_guest column to donations table
-- Run this in Supabase SQL Editor

ALTER TABLE donations ADD COLUMN IF NOT EXISTS is_guest BOOLEAN DEFAULT false;
