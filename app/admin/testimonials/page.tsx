import { createClient } from '@/lib/supabase/server';
import AdminTestimonialsContent from '@/components/admin/AdminTestimonialsContent';

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .order('order_index', { ascending: true, nullsFirst: false });
  return <AdminTestimonialsContent initialTestimonials={(data || []) as any} />;
}
