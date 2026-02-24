import { createClient } from '@/lib/supabase/server';
import AdminStoriesContent from '@/components/admin/AdminStoriesContent';

export default async function AdminStoriesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('stories')
    .select('id, title, excerpt, status, created_at, updated_at, profiles(name, email)')
    .order('created_at', { ascending: false });
  return <AdminStoriesContent initialStories={(data || []) as any} />;
}
