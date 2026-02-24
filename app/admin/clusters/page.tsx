import { createClient } from '@/lib/supabase/server';
import AdminClustersContent from '@/components/admin/AdminClustersContent';

export default async function AdminClustersPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('clusters').select('*').order('order_index', { ascending: true, nullsFirst: false });
  return <AdminClustersContent initialData={data || []} />;
}
