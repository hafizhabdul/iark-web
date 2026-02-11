import { StoryDetail } from '@/components/features/cerita';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

interface StoryWithAuthor {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  hero_image: string | null;
  category: 'karir' | 'pengabdian' | 'akademik' | 'kepemimpinan';
  tags: string[] | null;
  read_time: string | null;
  published_at: string | null;
  author: {
    name: string;
    angkatan: number | null;
    photo: string | null;
  } | null;
}

export default async function StoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: paramValue } = await params;

  const supabase = await createClient();

  // Try fetching by slug first, then by ID if it looks like a UUID
  let query = supabase
    .from('stories')
    .select(`
      id,
      title,
      slug,
      excerpt,
      content,
      hero_image,
      category,
      tags,
      read_time,
      published_at,
      author:profiles!author_id (
        name,
        angkatan,
        photo
      )
    `);

  // Check if paramValue is a valid UUID
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(paramValue);

  if (isUUID) {
    query = query.or(`id.eq.${paramValue},slug.eq.${paramValue}`);
  } else {
    query = query.eq('slug', paramValue);
  }

  const { data, error } = await query.eq('status', 'published').maybeSingle();

  if (error || !data) {
    notFound();
  }

  const storyData = data as unknown as StoryWithAuthor;
  const author = storyData.author;

  const story = {
    id: storyData.id,
    title: storyData.title,
    excerpt: storyData.excerpt || '',
    content: storyData.content || '',
    heroImage: storyData.hero_image || '',
    category: storyData.category,
    tags: storyData.tags || [],
    readTime: storyData.read_time || '5 menit',
    publishedDate: storyData.published_at
      ? new Date(storyData.published_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      : '',
    name: author?.name || 'Anonymous',
    batch: author?.angkatan ? `RK Angkatan ${author.angkatan}` : '',
    photo: author?.photo || '/images/default-avatar.png',
  };

  return <StoryDetail story={story} />;
}
