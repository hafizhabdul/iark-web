-- =====================================================
-- SUPABASE STORAGE BUCKETS & POLICIES
-- Run this in Supabase SQL Editor
-- =====================================================

-- Create buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('stories', 'stories', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('events', 'events', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('general', 'general', true);

-- =====================================================
-- STORIES BUCKET POLICIES
-- =====================================================

-- Anyone can view
CREATE POLICY "Public read stories" ON storage.objects
  FOR SELECT USING (bucket_id = 'stories');

-- Authenticated users can upload
CREATE POLICY "Authenticated upload stories" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'stories' 
    AND auth.role() = 'authenticated'
  );

-- Users can update their own uploads, admins can update all
CREATE POLICY "Owner or admin update stories" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'stories' 
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    )
  );

-- Users can delete their own uploads, admins can delete all
CREATE POLICY "Owner or admin delete stories" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'stories' 
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    )
  );

-- =====================================================
-- EVENTS BUCKET POLICIES
-- =====================================================

-- Anyone can view
CREATE POLICY "Public read events" ON storage.objects
  FOR SELECT USING (bucket_id = 'events');

-- Only admins can upload
CREATE POLICY "Admin upload events" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'events' 
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Only admins can update
CREATE POLICY "Admin update events" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'events' 
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Only admins can delete
CREATE POLICY "Admin delete events" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'events' 
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- GENERAL BUCKET POLICIES (hero, testimonials, management, dormitories)
-- =====================================================

-- Anyone can view
CREATE POLICY "Public read general" ON storage.objects
  FOR SELECT USING (bucket_id = 'general');

-- Only admins can upload
CREATE POLICY "Admin upload general" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'general' 
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Only admins can update
CREATE POLICY "Admin update general" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'general' 
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Only admins can delete
CREATE POLICY "Admin delete general" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'general' 
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
