import { createClient } from '@/lib/supabase/server';
import AdminDormitoriesContent from '@/components/admin/AdminDormitoriesContent';

export default async function AdminDormitoriesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('dormitories').select('*').order('name', { ascending: true });
  return <AdminDormitoriesContent initialData={data || []} />;
}
