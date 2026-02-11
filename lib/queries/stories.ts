import { createPublicClient as createClient } from '@/lib/supabase/public';
import type { StoryCategory } from '@/lib/supabase/types';

export interface Story {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  hero_image: string | null;
  category: StoryCategory;
  featured: boolean;
  published_at: string | null;
  author_name: string;
  author_angkatan: number | null;
  author_photo: string | null;
}

export interface StoryDetail extends Story {
  content: string | null;
  tags: string[] | null;
  read_time: string | null;
  views: number;
}

// Fetch published stories with author info using RPC
export async function fetchPublishedStories(
  limit = 20,
  offset = 0,
  category?: StoryCategory
): Promise<Story[]> {
  const supabase = createClient();

  // Try RPC first - cast to any since RPC types aren't defined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc('get_published_stories', {
    p_limit: limit,
    p_offset: offset,
    p_category: category || null,
  });

  if (error) {
    console.error('RPC failed, using fallback:', error);
    return fetchPublishedStoriesFallback(limit, offset, category);
  }

  return (data || []) as Story[];
}

// Fallback query
async function fetchPublishedStoriesFallback(
  limit: number,
  offset: number,
  category?: StoryCategory
): Promise<Story[]> {
  const supabase = createClient();

  let query = supabase
    .from('stories')
    .select(`
      id, title, slug, excerpt, hero_image, category, featured, published_at,
      author:profiles!author_id (name, angkatan, photo)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;

  interface StoryWithAuthor {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    hero_image: string | null;
    category: StoryCategory;
    featured: boolean;
    published_at: string | null;
    author: {
      name: string;
      angkatan: number | null;
      photo: string | null;
    } | null;
  }

  return ((data || []) as StoryWithAuthor[]).map((s) => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    excerpt: s.excerpt,
    hero_image: s.hero_image,
    category: s.category,
    featured: s.featured,
    published_at: s.published_at,
    author_name: s.author?.name || 'Anonymous',
    author_angkatan: s.author?.angkatan || null,
    author_photo: s.author?.photo || null,
  }));
}

// Fetch single story by slug
export async function fetchStoryBySlug(slug: string): Promise<StoryDetail | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('stories')
    .select(`
      id, title, slug, excerpt, content, hero_image, category, 
      featured, published_at, tags, read_time, views,
      author:profiles!author_id (name, angkatan, photo)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  interface StoryResponse {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    hero_image: string | null;
    category: StoryCategory;
    featured: boolean;
    published_at: string | null;
    tags: string[] | null;
    read_time: string | null;
    views: number;
    author: {
      name: string;
      angkatan: number | null;
      photo: string | null;
    } | null;
  }

  const story = data as StoryResponse;

  return {
    id: story.id,
    title: story.title,
    slug: story.slug,
    excerpt: story.excerpt,
    content: story.content,
    hero_image: story.hero_image,
    category: story.category,
    featured: story.featured,
    published_at: story.published_at,
    tags: story.tags,
    read_time: story.read_time,
    views: story.views,
    author_name: story.author?.name || 'Anonymous',
    author_angkatan: story.author?.angkatan || null,
    author_photo: story.author?.photo || null,
  };
}

// Fetch stories by author (for dashboard)
export async function fetchStoriesByAuthor(authorId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('author_id', authorId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
