import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { verifyTurnstile } from '@/lib/turnstile';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      amount,
      donor_name,
      donor_email,
      donor_phone,
      message,
      is_anonymous,
      is_guest,
      turnstile_token,
      campaign_id,
    } = body;

    // Validate required fields
    if (!amount || amount < 1000) {
      return NextResponse.json(
        { error: 'Minimal donasi Rp 1.000' },
        { status: 400 }
      );
    }

    if (!is_guest && !donor_name?.trim()) {
      return NextResponse.json(
        { error: 'Nama wajib diisi' },
        { status: 400 }
      );
    }

    if (!is_guest && (!donor_email?.trim() || !donor_email.includes('@'))) {
      return NextResponse.json(
        { error: 'Email tidak valid' },
        { status: 400 }
      );
    }

    // Verify Turnstile token
    const isValidTurnstile = await verifyTurnstile(turnstile_token);
    if (!isValidTurnstile) {
      return NextResponse.json(
        { error: 'Verifikasi keamanan gagal' },
        { status: 400 }
      );
    }

    // Get current user if logged in
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Use admin client for DB operations (bypasses RLS)
    const adminClient = await createAdminClient();

    // Resolve campaign_id - use provided one or default to "donasi-umum"
    let resolvedCampaignId: string;

    if (campaign_id) {
      // Verify the provided campaign exists and is active
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: campaign, error: campaignError } = await (adminClient as any)
        .from('donation_campaigns')
        .select('id, is_active')
        .eq('id', campaign_id)
        .single();

      if (campaignError || !campaign) {
        return NextResponse.json(
          { error: 'Kampanye tidak ditemukan' },
          { status: 400 }
        );
      }

      if (!campaign.is_active) {
        return NextResponse.json(
          { error: 'Kampanye tidak aktif' },
          { status: 400 }
        );
      }

      resolvedCampaignId = campaign_id;
    } else {
      // Get default "donasi-umum" campaign
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: defaultCampaign, error: defaultError } = await (adminClient as any)
        .from('donation_campaigns')
        .select('id')
        .eq('slug', 'donasi-umum')
        .eq('is_active', true)
        .single();

      if (defaultError || !defaultCampaign) {
        return NextResponse.json(
          { error: 'Kampanye default tidak ditemukan' },
          { status: 500 }
        );
      }

      resolvedCampaignId = defaultCampaign.id;
    }

    // Generate unique order ID
    const order_id = `DON-${Date.now()}-${nanoid(6).toUpperCase()}`;

    // Create donation record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: donation, error: insertError } = await (adminClient as any)
      .from('donations')
      .insert({
        order_id,
        amount,
        donor_name: is_guest ? (donor_name?.trim() || 'Hamba Allah') : donor_name.trim(),
        donor_email: donor_email?.trim()?.toLowerCase() || null,
        donor_phone: is_guest ? null : (donor_phone?.trim() || null),
        message: message?.trim() || null,
        is_anonymous: is_guest ? true : (is_anonymous || false),
        is_guest: is_guest || false,
        user_id: is_guest ? null : (user?.id || null),
        campaign_id: resolvedCampaignId,
        payment_status: 'pending',
      })
      .select('id, order_id')
      .single();

    if (insertError) {
      console.error('Error creating donation:', insertError);
      return NextResponse.json(
        { error: 'Gagal membuat donasi' },
        { status: 500 }
      );
    }

    // Pakasir Payment Gateway integration
    const pakasirSlug = process.env.PAKASIR_PROJECT_SLUG;
    const pakasirApiKey = process.env.PAKASIR_API_KEY;

    if (pakasirSlug && pakasirApiKey) {
      // Build redirect URL for after payment
      const proto = request.headers.get('x-forwarded-proto') || 'https';
      const host = request.headers.get('host') || 'ia-rk.com';
      const appOrigin = `${proto}://${host}`;
      const redirectUrl = `${appOrigin}/donasi/success?order_id=${order_id}`;

      // Use Pakasir Payment URL (simplest integration)
      const payment_url = `https://app.pakasir.com/pay/${pakasirSlug}/${amount}?order_id=${order_id}&redirect=${encodeURIComponent(redirectUrl)}`;

      return NextResponse.json({
        success: true,
        order_id: donation.order_id,
        payment_url,
      });
    }

    // Fallback: no payment gateway configured (dev/testing)
    return NextResponse.json({
      success: true,
      order_id: donation.order_id,
      message: 'Donasi berhasil dibuat. Payment gateway belum dikonfigurasi.',
    });
  } catch (error) {
    console.error('Donation API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
