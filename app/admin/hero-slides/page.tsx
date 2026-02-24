import { createClient } from '@/lib/supabase/server';
import AdminHeroSlidesContent from '@/components/admin/AdminHeroSlidesContent';

export default async function AdminHeroSlidesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('hero_slides').select('*').order('order_index', { ascending: true });
  return <AdminHeroSlidesContent initialData={data || []} />;
}
