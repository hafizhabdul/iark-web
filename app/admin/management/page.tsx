import { createClient } from '@/lib/supabase/server';
import AdminManagementContent from '@/components/admin/AdminManagementContent';

export default async function AdminManagementPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('management').select('*').order('order_index', { ascending: true, nullsFirst: false });
  return <AdminManagementContent initialData={data || []} />;
}
