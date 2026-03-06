-- ============================================================
-- Atomic swap_order_index function
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

CREATE OR REPLACE FUNCTION swap_order_index(
  p_table text,
  p_id1 uuid,
  p_order1 int,
  p_id2 uuid,
  p_order2 int
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_role text;
BEGIN
  -- Only allow admin users to call this function
  SELECT role INTO caller_role
  FROM profiles
  WHERE id = auth.uid();

  IF caller_role IS NULL OR caller_role != 'admin' THEN
    RAISE EXCEPTION 'Only admins can reorder items';
  END IF;

  -- Validate table name to prevent SQL injection (whitelist approach)
  IF p_table NOT IN ('clusters', 'hero_slides', 'management', 'testimonials') THEN
    RAISE EXCEPTION 'Invalid table name: %', p_table;
  END IF;

  -- Perform atomic swap within a single transaction
  EXECUTE format(
    'UPDATE %I SET order_index = $1 WHERE id = $2;
     UPDATE %I SET order_index = $3 WHERE id = $4;',
    p_table, p_table
  ) USING p_order2, p_id1, p_order1, p_id2;
END;
$$;

-- Grant access to authenticated users (admin check is inside the function)
GRANT EXECUTE ON FUNCTION swap_order_index TO authenticated;
