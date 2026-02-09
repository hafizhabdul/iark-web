import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
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
      turnstile_token,
      campaign_id,
    } = body;

    // Validate required fields
    if (!amount || amount < 10000) {
      return NextResponse.json(
        { error: 'Minimal donasi Rp 10.000' },
        { status: 400 }
      );
    }

    if (!donor_name?.trim()) {
      return NextResponse.json(
        { error: 'Nama wajib diisi' },
        { status: 400 }
      );
    }

    if (!donor_email?.trim() || !donor_email.includes('@')) {
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

    // Resolve campaign_id - use provided one or default to "donasi-umum"
    let resolvedCampaignId: string;
    
    if (campaign_id) {
      // Verify the provided campaign exists and is active
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: campaign, error: campaignError } = await (supabase as any)
        .from('campaigns')
        .select('id, status')
        .eq('id', campaign_id)
        .single();

      if (campaignError || !campaign) {
        return NextResponse.json(
          { error: 'Kampanye tidak ditemukan' },
          { status: 400 }
        );
      }

      if (campaign.status !== 'active') {
        return NextResponse.json(
          { error: 'Kampanye tidak aktif' },
          { status: 400 }
        );
      }

      resolvedCampaignId = campaign_id;
    } else {
      // Get default "donasi-umum" campaign
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: defaultCampaign, error: defaultError } = await (supabase as any)
        .from('campaigns')
        .select('id')
        .eq('slug', 'donasi-umum')
        .eq('status', 'active')
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
    const { data: donation, error: insertError } = await (supabase as any)
      .from('donations')
      .insert({
        order_id,
        amount,
        donor_name: donor_name.trim(),
        donor_email: donor_email.trim().toLowerCase(),
        donor_phone: donor_phone?.trim() || null,
        message: message?.trim() || null,
        is_anonymous: is_anonymous || false,
        user_id: user?.id || null,
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

    // TODO: Integrate with Pakasir payment gateway
    // For now, return success without actual payment redirect
    // In production, call Pakasir API and get payment_url
    
    const pakasirEnabled = process.env.PAKASIR_API_KEY && process.env.PAKASIR_MERCHANT_ID;
    
    if (pakasirEnabled) {
      // Call Pakasir API to create payment
      try {
        const pakasirResponse = await fetch(`${process.env.PAKASIR_API_URL}/transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.PAKASIR_API_KEY}`,
          },
          body: JSON.stringify({
            merchant_id: process.env.PAKASIR_MERCHANT_ID,
            order_id,
            amount,
            customer_name: donor_name,
            customer_email: donor_email,
            customer_phone: donor_phone,
            description: `Donasi IARK - ${order_id}`,
            callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/pakasir`,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/donasi/success?order_id=${order_id}`,
          }),
        });

        const pakasirData = await pakasirResponse.json();

        if (pakasirData.payment_url) {
          return NextResponse.json({
            success: true,
            order_id: donation.order_id,
            payment_url: pakasirData.payment_url,
          });
        }
      } catch (pakasirError) {
        console.error('Pakasir API error:', pakasirError);
        // Fall through to return without payment_url
      }
    }

    // Return success without payment URL (for dev/testing)
    return NextResponse.json({
      success: true,
      order_id: donation.order_id,
      message: 'Donasi berhasil dibuat. Pembayaran dalam mode testing.',
    });
  } catch (error) {
    console.error('Donation API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
