import { createClient } from '@/lib/supabase/server';
import AdminEventsContent from '@/components/admin/AdminEventsContent';

export default async function AdminEventsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('events').select('*').order('created_at', { ascending: false });
  return <AdminEventsContent initialData={data || []} />;
}
