-- ============================================================================
-- Migration: Donation Campaigns
-- Description: Creates donation campaigns system with progress tracking
-- ============================================================================

-- ============================================================================
-- 1. CREATE DONATION_CAMPAIGNS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS donation_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,                           -- Short description for cards/lists
    content TEXT,                               -- Rich description/story for detail page
    image_url TEXT,
    target_amount BIGINT NOT NULL CHECK (target_amount > 0),
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    starts_at TIMESTAMPTZ,                      -- Optional: campaign start date
    ends_at TIMESTAMPTZ,                        -- Optional: campaign end date
    sort_order INTEGER DEFAULT 0,               -- For manual ordering
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE donation_campaigns IS 'Stores donation campaigns/programs';
COMMENT ON COLUMN donation_campaigns.slug IS 'URL-friendly unique identifier';
COMMENT ON COLUMN donation_campaigns.content IS 'Rich text content for campaign detail page';
COMMENT ON COLUMN donation_campaigns.target_amount IS 'Target amount in smallest currency unit (e.g., Rupiah)';

-- ============================================================================
-- 2. TRIGGER FOR UPDATED_AT ON DONATION_CAMPAIGNS
-- ============================================================================

-- Create trigger function if not exists (reusable for other tables)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for donation_campaigns
DROP TRIGGER IF EXISTS trigger_donation_campaigns_updated_at ON donation_campaigns;
CREATE TRIGGER trigger_donation_campaigns_updated_at
    BEFORE UPDATE ON donation_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 3. ADD CAMPAIGN_ID TO DONATIONS TABLE
-- ============================================================================

-- Add campaign_id column to donations table
ALTER TABLE donations
ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES donation_campaigns(id);

COMMENT ON COLUMN donations.campaign_id IS 'Reference to the campaign this donation belongs to';

-- ============================================================================
-- 4. CREATE DEFAULT CAMPAIGN AND BACKFILL EXISTING DONATIONS
-- ============================================================================

-- Insert default "Donasi Umum IARK" campaign
INSERT INTO donation_campaigns (
    slug,
    title,
    description,
    target_amount,
    is_active,
    is_featured,
    sort_order
) VALUES (
    'donasi-umum',
    'Donasi Umum IARK',
    'Donasi untuk mendukung kegiatan dan operasional IARK',
    100000000,  -- 100 juta Rupiah as default target
    true,
    true,
    0
) ON CONFLICT (slug) DO NOTHING;

-- Backfill existing donations with default campaign
UPDATE donations
SET campaign_id = (SELECT id FROM donation_campaigns WHERE slug = 'donasi-umum')
WHERE campaign_id IS NULL;

-- ============================================================================
-- 5. CREATE INDEXES
-- ============================================================================

-- Index for querying donations by campaign
CREATE INDEX IF NOT EXISTS idx_donations_campaign_id 
ON donations(campaign_id);

-- Composite index for campaign donation queries with payment_status and paid_at
CREATE INDEX IF NOT EXISTS idx_donations_campaign_payment_status_paidat 
ON donations(campaign_id, payment_status, paid_at DESC);

-- Index for querying active campaigns
CREATE INDEX IF NOT EXISTS idx_donation_campaigns_active 
ON donation_campaigns(is_active, sort_order);

-- ============================================================================
-- 6. CREATE VIEWS
-- ============================================================================

-- View: Campaign progress with paid amount and count
CREATE OR REPLACE VIEW vw_donation_campaign_progress AS
SELECT 
    dc.id,
    dc.slug,
    dc.title,
    dc.description,
    dc.content,
    dc.image_url,
    dc.target_amount,
    dc.is_active,
    dc.is_featured,
    dc.starts_at,
    dc.ends_at,
    dc.sort_order,
    dc.created_at,
    dc.updated_at,
    COALESCE(SUM(d.amount) FILTER (WHERE d.payment_status = 'paid'), 0) AS paid_amount,
    COUNT(d.id) FILTER (WHERE d.payment_status = 'paid') AS paid_count,
    ROUND(
        (COALESCE(SUM(d.amount) FILTER (WHERE d.payment_status = 'paid'), 0)::NUMERIC / dc.target_amount) * 100, 
        2
    ) AS progress_pct
FROM donation_campaigns dc
LEFT JOIN donations d ON d.campaign_id = dc.id
GROUP BY dc.id;

COMMENT ON VIEW vw_donation_campaign_progress IS 'Campaign data with aggregated donation progress';

-- View: Donor wall (public display of donors)
CREATE OR REPLACE VIEW vw_campaign_donor_wall AS
SELECT 
    d.campaign_id,
    d.id AS donation_id,
    CASE 
        WHEN d.is_anonymous = true THEN 'Hamba Allah'
        ELSE COALESCE(d.donor_name, 'Hamba Allah')
    END AS display_name,
    d.amount,
    d.message,
    d.paid_at
FROM donations d
WHERE d.payment_status = 'paid'
ORDER BY d.paid_at DESC;

COMMENT ON VIEW vw_campaign_donor_wall IS 'Public donor wall with anonymized names';

-- View: Overall donation statistics across all campaigns
CREATE OR REPLACE VIEW vw_donation_overall_stats AS
SELECT 
    COALESCE(SUM(amount) FILTER (WHERE payment_status = 'paid'), 0) AS total_paid_amount,
    COUNT(id) FILTER (WHERE payment_status = 'paid') AS total_paid_count
FROM donations;

COMMENT ON VIEW vw_donation_overall_stats IS 'Aggregate statistics across all donations';

-- ============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on donation_campaigns
ALTER TABLE donation_campaigns ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read active campaigns
CREATE POLICY "Public can read active campaigns"
ON donation_campaigns
FOR SELECT
TO public
USING (is_active = true);

-- Policy: Admins can perform all operations on campaigns
CREATE POLICY "Admins can manage campaigns"
ON donation_campaigns
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Grant access to views for public/anon users
GRANT SELECT ON vw_donation_campaign_progress TO anon, authenticated;
GRANT SELECT ON vw_campaign_donor_wall TO anon, authenticated;
GRANT SELECT ON vw_donation_overall_stats TO anon, authenticated;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
