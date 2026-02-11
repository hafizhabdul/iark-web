-- ============================================================================
-- MIGRATION: Event & Donasi Schema
-- Version: 001 (Fixed)
-- Date: 2026-02-06
-- Description: Extend events table, extend/create event_registrations & donations
-- 
-- SAFE FOR PRODUCTION - handles existing tables
-- ============================================================================

-- ============================================================================
-- 1. EXTEND EVENTS TABLE
-- ============================================================================

ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_enabled BOOLEAN DEFAULT true;
ALTER TABLE events ADD COLUMN IF NOT EXISTS max_participants INTEGER;
ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_deadline TIMESTAMPTZ;
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_type VARCHAR(50) DEFAULT 'offline';
ALTER TABLE events ADD COLUMN IF NOT EXISTS meeting_link TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS contact_person TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS contact_whatsapp TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS price BIGINT DEFAULT 0;

-- ============================================================================
-- 2. EXTEND EVENT_REGISTRATIONS TABLE (if exists) or CREATE
-- ============================================================================

-- Create table if not exists (with minimal required columns)
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns one by one (safe for existing table)
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS angkatan INTEGER;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS asrama VARCHAR(100);
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS organization VARCHAR(255);
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'registered';
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'free';
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS order_id VARCHAR(100);
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS registered_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS reminder_h3_sent BOOLEAN DEFAULT false;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS reminder_h1_sent BOOLEAN DEFAULT false;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS attended BOOLEAN DEFAULT false;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add unique constraint if not exists (wrap in DO block to handle error)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'event_registrations_event_id_email_key'
  ) THEN
    ALTER TABLE event_registrations ADD CONSTRAINT event_registrations_event_id_email_key UNIQUE(event_id, email);
  END IF;
EXCEPTION WHEN others THEN
  -- Constraint might already exist with different name, ignore
  NULL;
END $$;

-- Indexes for event_registrations
CREATE INDEX IF NOT EXISTS idx_reg_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_reg_user ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_reg_status ON event_registrations(status);
CREATE INDEX IF NOT EXISTS idx_reg_email ON event_registrations(email);

-- ============================================================================
-- 3. CREATE DONATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns one by one
ALTER TABLE donations ADD COLUMN IF NOT EXISTS order_id VARCHAR(100);
ALTER TABLE donations ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS donor_name VARCHAR(255);
ALTER TABLE donations ADD COLUMN IF NOT EXISTS donor_email VARCHAR(255);
ALTER TABLE donations ADD COLUMN IF NOT EXISTS donor_phone VARCHAR(20);
ALTER TABLE donations ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS amount BIGINT;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS donation_type VARCHAR(20) DEFAULT 'onetime';
ALTER TABLE donations ADD COLUMN IF NOT EXISTS tier VARCHAR(20);
ALTER TABLE donations ADD COLUMN IF NOT EXISTS program VARCHAR(100);
ALTER TABLE donations ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE donations ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
ALTER TABLE donations ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS webhook_processed_at TIMESTAMPTZ;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add unique constraint on order_id if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'donations_order_id_key'
  ) THEN
    ALTER TABLE donations ADD CONSTRAINT donations_order_id_key UNIQUE(order_id);
  END IF;
EXCEPTION WHEN others THEN
  NULL;
END $$;

-- Indexes for donations
CREATE INDEX IF NOT EXISTS idx_donation_status ON donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_donation_date ON donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donation_order ON donations(order_id);
CREATE INDEX IF NOT EXISTS idx_donation_email ON donations(donor_email);

-- ============================================================================
-- 4. HELPER FUNCTION: updated_at trigger
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to event_registrations
DROP TRIGGER IF EXISTS event_registrations_updated_at ON event_registrations;
CREATE TRIGGER event_registrations_updated_at
  BEFORE UPDATE ON event_registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Apply trigger to donations
DROP TRIGGER IF EXISTS donations_updated_at ON donations;
CREATE TRIGGER donations_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 5. REGISTER_FOR_EVENT FUNCTION (Race Condition Safe)
-- ============================================================================

CREATE OR REPLACE FUNCTION register_for_event(
  p_event_id UUID,
  p_user_id UUID,
  p_full_name VARCHAR,
  p_email VARCHAR,
  p_phone VARCHAR DEFAULT NULL,
  p_angkatan INTEGER DEFAULT NULL,
  p_asrama VARCHAR DEFAULT NULL,
  p_kampus VARCHAR DEFAULT NULL,
  p_organization VARCHAR DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_max INTEGER;
  v_current INTEGER;
  v_reg_id UUID;
  v_registration_enabled BOOLEAN;
  v_registration_deadline TIMESTAMPTZ;
BEGIN
  -- Lock the event row to prevent concurrent reads
  SELECT max_participants, registration_enabled, registration_deadline 
  INTO v_max, v_registration_enabled, v_registration_deadline
  FROM events
  WHERE id = p_event_id
  FOR UPDATE;

  -- Check if event exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Event not found';
  END IF;

  -- Check if registration is enabled
  IF v_registration_enabled = false THEN
    RAISE EXCEPTION 'Registration is closed';
  END IF;

  -- Check deadline
  IF v_registration_deadline IS NOT NULL AND v_registration_deadline < NOW() THEN
    RAISE EXCEPTION 'Registration deadline has passed';
  END IF;

  -- Check capacity (NULL = unlimited)
  IF v_max IS NOT NULL THEN
    SELECT COUNT(*) INTO v_current
    FROM event_registrations
    WHERE event_id = p_event_id AND status NOT IN ('cancelled');

    IF v_current >= v_max THEN
      RAISE EXCEPTION 'Event is full';
    END IF;
  END IF;

  -- Insert registration
  INSERT INTO event_registrations (
    event_id, user_id, full_name, email, phone, angkatan, asrama, kampus, organization
  )
  VALUES (
    p_event_id, p_user_id, p_full_name, p_email, p_phone, p_angkatan, p_asrama, p_kampus, p_organization
  )
  RETURNING id INTO v_reg_id;

  RETURN v_reg_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on event_registrations
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view own registrations" ON event_registrations;
DROP POLICY IF EXISTS "Users can insert registrations" ON event_registrations;
DROP POLICY IF EXISTS "Admins can manage registrations" ON event_registrations;

-- Create policies
CREATE POLICY "Users can view own registrations"
  ON event_registrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert registrations"
  ON event_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can manage registrations"
  ON event_registrations FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Enable RLS on donations
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view own donations" ON donations;
DROP POLICY IF EXISTS "Anyone can insert donations" ON donations;
DROP POLICY IF EXISTS "Public can view paid donations" ON donations;
DROP POLICY IF EXISTS "Admins can manage donations" ON donations;

-- Create policies
CREATE POLICY "Users can view own donations"
  ON donations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert donations"
  ON donations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can view paid donations"
  ON donations FOR SELECT
  USING (is_anonymous = false AND payment_status = 'paid');

CREATE POLICY "Admins can manage donations"
  ON donations FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- 7. PERFORMANCE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_events_active_date 
  ON events(is_live, date DESC)
  WHERE is_live = true;

CREATE INDEX IF NOT EXISTS idx_reg_event_status 
  ON event_registrations(event_id, status);

-- ============================================================================
-- DONE - Safe to run multiple times
-- ============================================================================
