import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';
import { sendDonationThankYou } from '@/lib/email/send';

/**
 * Verify Pakasir webhook signature
 */
function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.PAKASIR_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('PAKASIR_WEBHOOK_SECRET not set, skipping signature verification');
    return true; // Skip in dev
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-pakasir-signature') || '';

    // Verify signature
    if (!verifySignature(rawBody, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const {
      order_id,
      status,
      amount,
      payment_method,
      completed_at,
    } = body;

    // Only process successful payments
    if (status !== 'paid' && status !== 'success') {
      return NextResponse.json({ success: true, message: 'Status not paid, ignoring' });
    }

    const supabase = await createClient();

    // Check if already processed (idempotency)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase as any)
      .from('donations')
      .select('id, payment_status, webhook_processed_at, donor_email, donor_name')
      .eq('order_id', order_id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Already processed - return success (idempotent)
    if (existing.webhook_processed_at) {
      return NextResponse.json({ success: true, message: 'Already processed' });
    }

    // Update donation status atomically
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('donations')
      .update({
        payment_status: 'paid',
        payment_method: payment_method || 'unknown',
        paid_at: completed_at || new Date().toISOString(),
        webhook_processed_at: new Date().toISOString(),
      })
      .eq('order_id', order_id)
      .eq('amount', amount) // Extra safety check
      .is('webhook_processed_at', null); // Only update if not already processed

    if (updateError) {
      console.error('Webhook update error:', updateError);
      return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }

    // Send thank you email (fire-and-forget, don't fail webhook)
    try {
      await sendDonationThankYou(
        existing.donor_email,
        existing.donor_name,
        amount
      );
    } catch (emailError) {
      console.error('Failed to send thank you email:', emailError);
      // Don't fail the webhook if email fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
