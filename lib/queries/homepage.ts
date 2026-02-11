import { createPublicClient as createClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/types';

type HeroSlide = Database['public']['Tables']['hero_slides']['Row'];
type Testimonial = Database['public']['Tables']['testimonials']['Row'];
export type Activity = Database['public']['Tables']['activities']['Row'];
type Management = Database['public']['Tables']['management']['Row'];
type Dormitory = Database['public']['Tables']['dormitories']['Row'];
export type Cluster = Database['public']['Tables']['clusters']['Row'];

export interface HomepageData {
  heroSlides: HeroSlide[];
  testimonials: Testimonial[];
  featuredStories: FeaturedStory[];
  recentActivities: Activity[];
  management: Management[];
  dormitories: Dormitory[];
  clusters: Cluster[];
}

export interface FeaturedStory {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  hero_image: string | null;
  category: string;
  author_name: string;
  author_angkatan: number | null;
  author_photo: string | null;
}

interface HomepageRpcResponse {
  hero_slides: HeroSlide[];
  testimonials: Testimonial[];
  featured_stories: FeaturedStory[];
  recent_activities: Activity[];
  management: Management[];
  dormitories: Dormitory[];
  clusters: Cluster[];
}

// Fetch all homepage data in a single RPC call
export async function fetchHomepageData(): Promise<HomepageData> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_homepage_data');

  if (error) {
    console.error('Error fetching homepage data:', error);
    // Fallback to individual queries if RPC fails
    return fetchHomepageDataFallback();
  }

  const rpcData = data as HomepageRpcResponse;

  // If RPC doesn't provide clusters, fetch it separately to ensure stability
  let clusters = rpcData.clusters || [];
  if (clusters.length === 0) {
    const { data: clusterData } = await supabase
      .from('clusters')
      .select('*')
      .order('order_index');
    clusters = clusterData || [];
  }

  return {
    heroSlides: rpcData.hero_slides || [],
    testimonials: rpcData.testimonials || [],
    featuredStories: rpcData.featured_stories || [],
    recentActivities: rpcData.recent_activities || [],
    management: rpcData.management || [],
    dormitories: rpcData.dormitories || [],
    clusters: clusters,
  };
}

// Fallback: fetch data with parallel queries
async function fetchHomepageDataFallback(): Promise<HomepageData> {
  const supabase = createClient();

  const [
    heroSlidesRes,
    testimonialsRes,
    storiesRes,
    activitiesRes,
    managementRes,
    dormitoriesRes,
    clustersRes,
  ] = await Promise.all([
    supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .limit(10),
    supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .limit(10),
    supabase
      .from('stories')
      .select(`
        id, title, slug, excerpt, hero_image, category,
        author:profiles!author_id (name, angkatan, photo)
      `)
      .eq('status', 'published')
      .eq('featured', true)
      .order('published_at', { ascending: false })
      .limit(3),
    supabase
      .from('activities')
      .select('*')
      .eq('is_active', true)
      .order('date', { ascending: false })
      .limit(6),
    supabase
      .from('management')
      .select('*')
      .order('order_index', { ascending: true })
      .limit(20),
    supabase
      .from('dormitories')
      .select('*')
      .order('name', { ascending: true })
      .limit(20),
    supabase
      .from('clusters')
      .select('*')
      .order('order_index', { ascending: true })
      .limit(20),
  ]);

  interface StoryWithAuthor {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    hero_image: string | null;
    category: string;
    author: {
      name: string;
      angkatan: number | null;
      photo: string | null;
    } | null;
  }

  return {
    heroSlides: heroSlidesRes.data || [],
    testimonials: testimonialsRes.data || [],
    featuredStories: ((storiesRes.data || []) as StoryWithAuthor[]).map((s) => ({
      id: s.id,
      title: s.title,
      slug: s.slug,
      excerpt: s.excerpt,
      hero_image: s.hero_image,
      category: s.category,
      author_name: s.author?.name || 'Anonymous',
      author_angkatan: s.author?.angkatan || null,
      author_photo: s.author?.photo || null,
    })),
    recentActivities: activitiesRes.data || [],
    management: managementRes.data || [],
    dormitories: dormitoriesRes.data || [],
    clusters: clustersRes.data || [],
  };
}

// Individual fetchers for components that need specific data
export async function fetchHeroSlides() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data;
}

export async function fetchTestimonials(type?: 'ketua_angkatan' | 'tokoh_ternama') {
  const supabase = createClient();
  let query = supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function fetchTestimonialsAdmin() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('order_index', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchManagement() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('management')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data;
}

export async function fetchDormitories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('dormitories')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

export async function fetchActivities(): Promise<Activity[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('is_active', true)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}
