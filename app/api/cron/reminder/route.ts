import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { sendEventReminder } from '@/lib/email/send';

/**
 * Cron endpoint to send event reminders
 * Runs daily via Vercel Cron
 * 
 * Sends reminders:
 * - H-3: 3 days before event
 * - H-1: 1 day before event
 * 
 * Uses "claim-then-send" pattern to prevent duplicate emails
 * if the cron job is accidentally triggered twice concurrently.
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Use admin client — cron runs without user session, needs to bypass RLS
  const supabase = await createAdminClient();
  const now = new Date();
  
  // Calculate dates for H-3 and H-1
  const h3Date = new Date(now);
  h3Date.setDate(h3Date.getDate() + 3);
  const h3DateStr = h3Date.toISOString().split('T')[0];
  
  const h1Date = new Date(now);
  h1Date.setDate(h1Date.getDate() + 1);
  const h1DateStr = h1Date.toISOString().split('T')[0];

  const results = {
    h3_sent: 0,
    h1_sent: 0,
    errors: [] as string[],
  };

  /**
   * Claim-then-send helper: atomically mark the reminder as sent FIRST,
   * then send the email. If the email fails, we still keep the flag set
   * to avoid infinite retries of broken emails. This prevents duplicate
   * sends if the cron is called concurrently.
   */
  async function sendReminderSafely(
    regId: string,
    email: string,
    eventTitle: string,
    formattedDate: string,
    daysBeforeLabel: 3 | 1,
    flagColumn: 'reminder_h3_sent' | 'reminder_h1_sent',
  ): Promise<boolean> {
    // Step 1: Claim — atomically set flag, only if still false
    const { data: claimed, error: claimError } = await supabase
      .from('event_registrations')
      .update({ [flagColumn]: true })
      .eq('id', regId)
      .eq(flagColumn, false) // Only claim if not yet sent (prevents race condition)
      .select('id');

    if (claimError) {
      results.errors.push(`Claim failed for ${email} (${flagColumn}): ${claimError.message}`);
      return false;
    }

    // If no rows were updated, another process already claimed this
    if (!claimed || claimed.length === 0) {
      return false;
    }

    // Step 2: Send email (already claimed, safe from duplicates)
    try {
      const sent = await sendEventReminder(email, eventTitle, formattedDate, daysBeforeLabel);
      return !!sent;
    } catch (err) {
      results.errors.push(`Email send failed for ${email} (${flagColumn}): ${err}`);
      // Flag stays true — we don't retry broken emails to avoid spam
      return false;
    }
  }

  try {
    // Get events happening in 3 days
    const { data: h3Events } = await supabase
      .from('events')
      .select('id, title, date, location')
      .gte('date', `${h3DateStr}T00:00:00`)
      .lt('date', `${h3DateStr}T23:59:59`)
      .eq('is_live', true);

    // Get registrations for H-3 events that haven't received H-3 reminder
    for (const event of h3Events || []) {
      const { data: registrations } = await supabase
        .from('event_registrations')
        .select('id, email, full_name')
        .eq('event_id', event.id)
        .eq('reminder_h3_sent', false)
        .neq('status', 'cancelled');

      for (const reg of registrations || []) {
        const formattedDate = new Date(event.date).toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });

        const sent = await sendReminderSafely(
          reg.id,
          reg.email,
          event.title,
          formattedDate,
          3,
          'reminder_h3_sent',
        );

        if (sent) results.h3_sent++;
      }
    }

    // Get events happening tomorrow
    const { data: h1Events } = await supabase
      .from('events')
      .select('id, title, date, location')
      .gte('date', `${h1DateStr}T00:00:00`)
      .lt('date', `${h1DateStr}T23:59:59`)
      .eq('is_live', true);

    // Get registrations for H-1 events that haven't received H-1 reminder
    for (const event of h1Events || []) {
      const { data: registrations } = await supabase
        .from('event_registrations')
        .select('id, email, full_name')
        .eq('event_id', event.id)
        .eq('reminder_h1_sent', false)
        .neq('status', 'cancelled');

      for (const reg of registrations || []) {
        const formattedDate = new Date(event.date).toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });

        const sent = await sendReminderSafely(
          reg.id,
          reg.email,
          event.title,
          formattedDate,
          1,
          'reminder_h1_sent',
        );

        if (sent) results.h1_sent++;
      }
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron reminder error:', error);
    return NextResponse.json(
      { error: 'Internal error', details: String(error) },
      { status: 500 }
    );
  }
}
