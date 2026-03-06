import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Atomically swap order_index between two rows in a table using an RPC function.
 * Falls back to a safe sequential approach if the RPC doesn't exist.
 *
 * Requires the following PostgreSQL function to be created in Supabase:
 *
 * ```sql
 * CREATE OR REPLACE FUNCTION swap_order_index(
 *   p_table text,
 *   p_id1 uuid,
 *   p_order1 int,
 *   p_id2 uuid,
 *   p_order2 int
 * ) RETURNS void
 * LANGUAGE plpgsql
 * SECURITY DEFINER
 * AS $$
 * BEGIN
 *   -- Validate table name to prevent SQL injection
 *   IF p_table NOT IN ('clusters', 'hero_slides', 'management', 'testimonials') THEN
 *     RAISE EXCEPTION 'Invalid table name: %', p_table;
 *   END IF;
 *
 *   EXECUTE format(
 *     'UPDATE %I SET order_index = $1 WHERE id = $2;
 *      UPDATE %I SET order_index = $3 WHERE id = $4;',
 *     p_table, p_table
 *   ) USING p_order2, p_id1, p_order1, p_id2;
 * END;
 * $$;
 * ```
 */
export async function swapOrderIndex(
  supabase: SupabaseClient,
  table: string,
  id1: string,
  order1: number | null,
  id2: string,
  order2: number | null,
): Promise<{ error: Error | null }> {
  // Try the atomic RPC first
  const { error: rpcError } = await supabase.rpc('swap_order_index', {
    p_table: table,
    p_id1: id1,
    p_order1: order1 ?? 0,
    p_id2: id2,
    p_order2: order2 ?? 0,
  });

  if (!rpcError) {
    return { error: null };
  }

  // If RPC exists but failed (e.g., permission denied, invalid table), don't fallback
  // Only fallback if RPC function doesn't exist yet (code 42883 = undefined_function)
  const isRpcNotFound = rpcError.message?.includes('function') &&
    (rpcError.message?.includes('does not exist') || rpcError.code === '42883');

  if (!isRpcNotFound) {
    // RPC exists but returned an error — propagate it
    return { error: new Error(rpcError.message) };
  }

  // RPC doesn't exist — fall back to sequential updates
  // with a temporary value to avoid unique constraint violations
  console.warn(
    `swap_order_index RPC failed (${rpcError.message}), falling back to sequential updates. ` +
    'Please create the RPC function in Supabase for atomic swaps.',
  );

  const TEMP_ORDER = -999999;

  // Step 1: Set id1 to a temporary value to avoid collision
  const { error: e1 } = await supabase
    .from(table)
    .update({ order_index: TEMP_ORDER })
    .eq('id', id1);

  if (e1) return { error: new Error(e1.message) };

  // Step 2: Set id2 to id1's original order
  const { error: e2 } = await supabase
    .from(table)
    .update({ order_index: order1 ?? 0 })
    .eq('id', id2);

  if (e2) {
    // Rollback step 1
    await supabase.from(table).update({ order_index: order1 ?? 0 }).eq('id', id1);
    return { error: new Error(e2.message) };
  }

  // Step 3: Set id1 to id2's original order
  const { error: e3 } = await supabase
    .from(table)
    .update({ order_index: order2 ?? 0 })
    .eq('id', id1);

  if (e3) {
    // Rollback both
    await supabase.from(table).update({ order_index: order2 ?? 0 }).eq('id', id2);
    await supabase.from(table).update({ order_index: order1 ?? 0 }).eq('id', id1);
    return { error: new Error(e3.message) };
  }

  return { error: null };
}
