import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('donations')
      .select('order_id, amount, donor_name, payment_status, is_anonymous')
      .eq('order_id', orderId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Donasi tidak ditemukan' },
        { status: 404 }
      );
    }

    // Don't expose donor name if anonymous
    return NextResponse.json({
      order_id: data.order_id,
      amount: data.amount,
      donor_name: data.is_anonymous ? 'Anonim' : data.donor_name,
      payment_status: data.payment_status,
    });
  } catch (error) {
    console.error('Error fetching donation:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}
