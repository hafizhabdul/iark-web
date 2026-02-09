import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendEventReminder } from '@/lib/email/send';

/**
 * Cron endpoint to send event reminders
 * Runs daily via Vercel Cron
 * 
 * Sends reminders:
 * - H-3: 3 days before event
 * - H-1: 1 day before event
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();
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

  try {
    // Get events happening in 3 days
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: h3Events } = await (supabase as any)
      .from('events')
      .select('id, title, date, location')
      .gte('date', `${h3DateStr}T00:00:00`)
      .lt('date', `${h3DateStr}T23:59:59`)
      .eq('is_live', true);

    // Get registrations for H-3 events that haven't received H-3 reminder
    for (const event of h3Events || []) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: registrations } = await (supabase as any)
        .from('event_registrations')
        .select('id, email, full_name')
        .eq('event_id', event.id)
        .eq('reminder_h3_sent', false)
        .neq('status', 'cancelled');

      for (const reg of registrations || []) {
        try {
          const formattedDate = new Date(event.date).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });

          const sent = await sendEventReminder(
            reg.email,
            event.title,
            formattedDate,
            3
          );

          if (sent) {
            // Mark as sent
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase as any)
              .from('event_registrations')
              .update({ reminder_h3_sent: true })
              .eq('id', reg.id);
            
            results.h3_sent++;
          }
        } catch (err) {
          results.errors.push(`H-3 email failed for ${reg.email}: ${err}`);
        }
      }
    }

    // Get events happening tomorrow
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: h1Events } = await (supabase as any)
      .from('events')
      .select('id, title, date, location')
      .gte('date', `${h1DateStr}T00:00:00`)
      .lt('date', `${h1DateStr}T23:59:59`)
      .eq('is_live', true);

    // Get registrations for H-1 events that haven't received H-1 reminder
    for (const event of h1Events || []) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: registrations } = await (supabase as any)
        .from('event_registrations')
        .select('id, email, full_name')
        .eq('event_id', event.id)
        .eq('reminder_h1_sent', false)
        .neq('status', 'cancelled');

      for (const reg of registrations || []) {
        try {
          const formattedDate = new Date(event.date).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });

          const sent = await sendEventReminder(
            reg.email,
            event.title,
            formattedDate,
            1
          );

          if (sent) {
            // Mark as sent
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase as any)
              .from('event_registrations')
              .update({ reminder_h1_sent: true })
              .eq('id', reg.id);
            
            results.h1_sent++;
          }
        } catch (err) {
          results.errors.push(`H-1 email failed for ${reg.email}: ${err}`);
        }
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
