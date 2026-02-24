import { createClient } from '@/lib/supabase/server';
import AdminUsersContent from '@/components/admin/AdminUsersContent';

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  return <AdminUsersContent initialUsers={(data || []) as any} />;
}
