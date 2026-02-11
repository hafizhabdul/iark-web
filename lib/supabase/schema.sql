-- =====================================================
-- IARK DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES (extends auth.users)
-- =====================================================
CREATE TYPE user_role AS ENUM ('admin', 'alumni', 'public');

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  angkatan INTEGER,
  photo TEXT,
  role user_role DEFAULT 'alumni',
  bio TEXT,
  job_title TEXT,
  company TEXT,
  location TEXT,
  phone TEXT,
  linkedin TEXT,
  instagram TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, photo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://ui-avatars.com/api/?name=' || COALESCE(NEW.raw_user_meta_data->>'name', 'User') || '&background=C41E3A&color=fff')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 2. BATCHES (Angkatan)
-- =====================================================
CREATE TABLE batches (
  id SERIAL PRIMARY KEY,
  angkatan INTEGER UNIQUE NOT NULL,
  year TEXT NOT NULL,
  fun_fact TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. BATCH LEADERS (Perwakilan Angkatan)
-- =====================================================
CREATE TABLE batch_leaders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  batch_id INTEGER REFERENCES batches(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  photo TEXT,
  quote TEXT,
  job_title TEXT,
  is_ketua BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. CLUSTERS (formerly Bidang)
-- =====================================================
CREATE TABLE clusters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT CHECK (color IN ('red', 'blue', 'yellow')),
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. MANAGEMENT (Pengurus)
-- =====================================================
CREATE TYPE management_role AS ENUM ('pengurus_inti', 'ketua_angkatan');

CREATE TABLE management (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  angkatan TEXT,
  photo TEXT,
  role management_role NOT NULL,
  instagram TEXT,
  linkedin TEXT,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. STORIES (Blog/Cerita Alumni)
-- =====================================================
CREATE TYPE story_status AS ENUM ('draft', 'pending', 'published', 'rejected');
CREATE TYPE story_category AS ENUM ('karir', 'pengabdian', 'akademik', 'kepemimpinan');

CREATE TABLE stories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  hero_image TEXT,
  category story_category NOT NULL,
  tags TEXT[],
  status story_status DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  read_time TEXT,
  views INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  rejected_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. TESTIMONIALS
-- =====================================================
CREATE TYPE testimonial_type AS ENUM ('ketua_angkatan', 'tokoh_ternama');

CREATE TABLE testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  angkatan TEXT,
  photo TEXT,
  quote TEXT NOT NULL,
  type testimonial_type NOT NULL,
  order_index INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 8. EVENTS
-- =====================================================
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT,
  date DATE NOT NULL,
  time TEXT,
  end_date DATE,
  location TEXT,
  category TEXT,
  image_url TEXT,
  is_live BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  capacity INTEGER,
  organizer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  registration_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 9. EVENT REGISTRATIONS
-- =====================================================
CREATE TABLE event_registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'registered',
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- =====================================================
-- 10. HERO SLIDES
-- =====================================================
CREATE TABLE hero_slides (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  order_index INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 11. DORMITORIES (Asrama)
-- =====================================================
CREATE TABLE dormitories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT,
  image_url TEXT,
  total_rooms INTEGER,
  occupied_rooms INTEGER,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 12. ACTIVITIES (News/Updates)
-- =====================================================
CREATE TABLE activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category TEXT NOT NULL,
  author TEXT,
  title TEXT NOT NULL,
  subtitle TEXT,
  date DATE,
  read_time TEXT,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  image_url TEXT,
  link TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE management ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE dormitories ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Stories policies
CREATE POLICY "Published stories are viewable by everyone" ON stories
  FOR SELECT USING (status = 'published' OR author_id = auth.uid());

CREATE POLICY "Users can insert own stories" ON stories
  FOR INSERT WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update own stories" ON stories
  FOR UPDATE USING (author_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can delete own draft stories" ON stories
  FOR DELETE USING (author_id = auth.uid() AND status = 'draft');

CREATE POLICY "Admins can do anything with stories" ON stories
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Events policies
CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage events" ON events
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Event registrations policies
CREATE POLICY "Users can view own registrations" ON event_registrations
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can register for events" ON event_registrations
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can cancel own registration" ON event_registrations
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all registrations" ON event_registrations
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Public read access for content tables
CREATE POLICY "Public read batches" ON batches FOR SELECT USING (true);
CREATE POLICY "Public read batch_leaders" ON batch_leaders FOR SELECT USING (true);
CREATE POLICY "Public read clusters" ON clusters FOR SELECT USING (true);
CREATE POLICY "Public read management" ON management FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public read hero_slides" ON hero_slides FOR SELECT USING (is_active = true);
CREATE POLICY "Public read dormitories" ON dormitories FOR SELECT USING (true);
CREATE POLICY "Public read activities" ON activities FOR SELECT USING (is_active = true);

-- Admin write access for content tables
CREATE POLICY "Admin manage batches" ON batches FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin manage batch_leaders" ON batch_leaders FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin manage clusters" ON clusters FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin manage management" ON management FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin manage testimonials" ON testimonials FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin manage hero_slides" ON hero_slides FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin manage dormitories" ON dormitories FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin manage activities" ON activities FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- =====================================================
-- INDEXES for better performance
-- =====================================================
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_angkatan ON profiles(angkatan);
CREATE INDEX idx_stories_status ON stories(status);
CREATE INDEX idx_stories_author ON stories(author_id);
CREATE INDEX idx_stories_category ON stories(category);
CREATE INDEX idx_stories_slug ON stories(slug);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_slug ON events(slug);

-- =====================================================
-- UPDATE TIMESTAMP FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
