-- =====================================================
-- PERFORMANCE OPTIMIZATIONS FOR IARK
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. ADDITIONAL INDEXES
-- =====================================================

-- Event registrations (for count queries)
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id 
  ON event_registrations(event_id);

-- Testimonials composite index
CREATE INDEX IF NOT EXISTS idx_testimonials_type_active 
  ON testimonials(type, is_active);

-- Activities filter
CREATE INDEX IF NOT EXISTS idx_activities_is_active 
  ON activities(is_active);

-- Stories published filter (composite for common query)
CREATE INDEX IF NOT EXISTS idx_stories_status_published 
  ON stories(status, published_at DESC) 
  WHERE status = 'published';

-- Hero slides active filter
CREATE INDEX IF NOT EXISTS idx_hero_slides_active 
  ON hero_slides(is_active, order_index) 
  WHERE is_active = true;

-- =====================================================
-- 2. RPC FUNCTION: Get Events with Registration Count
-- Solves N+1 query problem
-- =====================================================

CREATE OR REPLACE FUNCTION get_events_with_registrations()
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  description TEXT,
  content TEXT,
  "date" DATE,
  "time" TEXT,
  end_date DATE,
  location TEXT,
  category TEXT,
  image_url TEXT,
  is_live BOOLEAN,
  is_featured BOOLEAN,
  capacity INTEGER,
  registration_url TEXT,
  organizer_id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  registration_count BIGINT
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    e.id,
    e.title,
    e.slug,
    e.description,
    e.content,
    e.date,
    e.time,
    e.end_date,
    e.location,
    e.category,
    e.image_url,
    e.is_live,
    e.is_featured,
    e.capacity,
    e.registration_url,
    e.organizer_id,
    e.created_at,
    e.updated_at,
    COALESCE(COUNT(er.id), 0) AS registration_count
  FROM events e
  LEFT JOIN event_registrations er ON er.event_id = e.id
  GROUP BY e.id
  ORDER BY e.date ASC;
$$;

-- =====================================================
-- 3. RPC FUNCTION: Get Dashboard Stats (single query)
-- =====================================================

CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON
LANGUAGE sql
STABLE
AS $$
  SELECT json_build_object(
    'total_stories', (SELECT COUNT(*) FROM stories WHERE status = 'published'),
    'pending_stories', (SELECT COUNT(*) FROM stories WHERE status = 'pending'),
    'total_users', (SELECT COUNT(*) FROM profiles),
    'total_events', (SELECT COUNT(*) FROM events),
    'upcoming_events', (SELECT COUNT(*) FROM events WHERE date >= CURRENT_DATE)
  );
$$;

-- =====================================================
-- 4. RPC FUNCTION: Get Homepage Data (batched)
-- =====================================================

CREATE OR REPLACE FUNCTION get_homepage_data()
RETURNS JSON
LANGUAGE sql
STABLE
AS $$
  SELECT json_build_object(
    'hero_slides', (
      SELECT COALESCE(json_agg(row_to_json(h)), '[]'::json)
      FROM (
        SELECT id, title, subtitle, image_url, link_url, order_index
        FROM hero_slides
        WHERE is_active = true
        ORDER BY order_index ASC
        LIMIT 10
      ) h
    ),
    'testimonials', (
      SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
      FROM (
        SELECT id, name, title, angkatan, photo, quote, type
        FROM testimonials
        WHERE is_active = true
        ORDER BY order_index ASC
        LIMIT 10
      ) t
    ),
    'featured_stories', (
      SELECT COALESCE(json_agg(row_to_json(s)), '[]'::json)
      FROM (
        SELECT s.id, s.title, s.slug, s.excerpt, s.hero_image, s.category,
               p.name as author_name, p.angkatan as author_angkatan, p.photo as author_photo
        FROM stories s
        LEFT JOIN profiles p ON p.id = s.author_id
        WHERE s.status = 'published' AND s.featured = true
        ORDER BY s.published_at DESC
        LIMIT 3
      ) s
    ),
    'recent_activities', (
      SELECT COALESCE(json_agg(row_to_json(a)), '[]'::json)
      FROM (
        SELECT id, category, author, title, subtitle, date, image_url, link
        FROM activities
        WHERE is_active = true
        ORDER BY date DESC
        LIMIT 6
      ) a
    ),
    'management', (
      SELECT COALESCE(json_agg(row_to_json(m)), '[]'::json)
      FROM (
        SELECT id, name, position, angkatan, photo, role, instagram, linkedin
        FROM management
        ORDER BY order_index ASC
        LIMIT 20
      ) m
    ),
    'dormitories', (
      SELECT COALESCE(json_agg(row_to_json(d)), '[]'::json)
      FROM (
        SELECT id, name, city, province, image_url, total_rooms, occupied_rooms
        FROM dormitories
        ORDER BY name ASC
        LIMIT 20
      ) d
    )
  );
$$;

-- =====================================================
-- 5. RPC FUNCTION: Get Stories with Author (paginated)
-- =====================================================

CREATE OR REPLACE FUNCTION get_published_stories(
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0,
  p_category story_category DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  excerpt TEXT,
  hero_image TEXT,
  category story_category,
  featured BOOLEAN,
  published_at TIMESTAMPTZ,
  author_name TEXT,
  author_angkatan INTEGER,
  author_photo TEXT
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    s.id,
    s.title,
    s.slug,
    s.excerpt,
    s.hero_image,
    s.category,
    s.featured,
    s.published_at,
    p.name AS author_name,
    p.angkatan AS author_angkatan,
    p.photo AS author_photo
  FROM stories s
  LEFT JOIN profiles p ON p.id = s.author_id
  WHERE s.status = 'published'
    AND (p_category IS NULL OR s.category = p_category)
  ORDER BY s.published_at DESC
  LIMIT p_limit
  OFFSET p_offset;
$$;

-- =====================================================
-- Grant execute permissions
-- =====================================================
GRANT EXECUTE ON FUNCTION get_events_with_registrations() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_stats() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_homepage_data() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_published_stories(INTEGER, INTEGER, story_category) TO anon, authenticated;
