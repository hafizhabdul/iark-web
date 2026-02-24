import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import AdminRegistrationsContent from '@/components/admin/AdminRegistrationsContent';

export default async function EventRegistrationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [eventRes, regsRes] = await Promise.all([
    supabase.from('events').select('id, title, date, max_participants').eq('id', id).single(),
    supabase.from('event_registrations').select('*').eq('event_id', id).order('registered_at', { ascending: false }),
  ]);

  if (eventRes.error || !eventRes.data) notFound();

  return (
    <AdminRegistrationsContent
      initialEvent={eventRes.data as any}
      initialRegistrations={(regsRes.data || []) as any}
    />
  );
}
