import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import AdminStoryDetailContent from '@/components/admin/AdminStoryDetailContent';

export default async function StoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('stories')
    .select('*, profiles(name, email, photo, angkatan)')
    .eq('id', id)
    .single();

  if (error || !data) notFound();

  return <AdminStoryDetailContent initialStory={data as any} />;
}
