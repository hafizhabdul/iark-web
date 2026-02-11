// Database types for Supabase

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      batches: {
        Row: Batch;
        Insert: Partial<Batch>;
        Update: Partial<Batch>;
      };
      batch_leaders: {
        Row: BatchLeader;
        Insert: Partial<BatchLeader>;
        Update: Partial<BatchLeader>;
      };
      testimonials: {
        Row: Testimonial;
        Insert: Partial<Testimonial>;
        Update: Partial<Testimonial>;
      };
      stories: {
        Row: StoryRow;
        Insert: Partial<StoryRow>;
        Update: Partial<StoryRow>;
      };
      events: {
        Row: EventRow;
        Insert: Partial<EventRow>;
        Update: Partial<EventRow>;
      };
      event_registrations: {
        Row: EventRegistrationRow;
        Insert: Partial<EventRegistrationRow>;
        Update: Partial<EventRegistrationRow>;
      };
      donations: {
        Row: DonationRow;
        Insert: Partial<DonationRow>;
        Update: Partial<DonationRow>;
      };
      donation_campaigns: {
        Row: DonationCampaignRow;
        Insert: Partial<DonationCampaignRow>;
        Update: Partial<DonationCampaignRow>;
      };
      hero_slides: {
        Row: HeroSlide;
        Insert: Partial<HeroSlide>;
        Update: Partial<HeroSlide>;
      };
      activities: {
        Row: Activity;
        Insert: Partial<Activity>;
        Update: Partial<Activity>;
      };
      management: {
        Row: Management;
        Insert: Partial<Management>;
        Update: Partial<Management>;
      };
      dormitories: {
        Row: Dormitory;
        Insert: Partial<Dormitory>;
        Update: Partial<Dormitory>;
      };
      clusters: {
        Row: Cluster;
        Insert: Partial<Cluster>;
        Update: Partial<Cluster>;
      };
    };
    Functions: {
      register_for_event: {
        Args: {
          p_event_id: string;
          p_user_id: string | null;
          p_full_name: string;
          p_email: string;
          p_phone?: string | null;
          p_angkatan?: number | null;
          p_asrama?: string | null;
          p_kampus?: string | null;
          p_organization?: string | null;
        };
        Returns: string;
      };
    };
  };
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'alumni' | 'public';
  photo: string | null;
  angkatan: number | null;
  asrama: string | null;
  regional: string | null;
  kampus: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  occupation: string | null;
  job_title: string | null;
  company: string | null;
  linkedin: string | null;
  instagram: string | null;
  created_at: string;
  updated_at: string;
}

export interface Batch {
  id: string;
  angkatan: number;
  name: string | null;
  description: string | null;
  photo: string | null;
  graduation_year: number | null;
  total_members: number | null;
  fun_fact: string | null;
  year: number | null;
  created_at: string;
}

export interface BatchLeader {
  id: string;
  batch_id: string;
  name: string;
  position: string;
  photo: string | null;
  angkatan: number | null;
  order_index: number;
  is_ketua: boolean;
  quote: string | null;
  job_title: string | null;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  title: string | null;
  content: string;
  quote: string | null;
  photo: string | null;
  angkatan: number | null;
  type: 'alumni' | 'tokoh_ternama';
  is_active: boolean;
  order_index: number;
  created_at: string;
}

export type StoryCategory = 'alumni' | 'organisasi' | 'inspirasi' | 'kegiatan';

export interface StoryRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  hero_image: string | null;
  category: StoryCategory;
  tags: string[] | null;
  featured: boolean;
  is_published: boolean;
  published_at: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  date: string;
  location: string | null;
  image_url: string | null;
  is_live: boolean;
  registration_enabled: boolean;
  max_participants: number | null;
  registration_deadline: string | null;
  event_type: 'online' | 'offline' | 'hybrid';
  meeting_link: string | null;
  contact_person: string | null;
  contact_whatsapp: string | null;
  price: number;
  registration_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventRegistrationRow {
  id: string;
  event_id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  angkatan: number | null;
  asrama: string | null;
  status: 'registered' | 'confirmed' | 'attended' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  payment_amount: number;
  notes: string | null;
  registered_at: string;
  confirmed_at: string | null;
  cancelled_at: string | null;
  reminder_h3_sent: boolean;
  reminder_h1_sent: boolean;
}

export interface DonationRow {
  id: string;
  user_id: string | null;
  campaign_id: string | null;
  order_id: string;
  amount: number;
  donor_name: string;
  donor_email: string;
  donor_phone: string | null;
  message: string | null;
  is_anonymous: boolean;
  is_guest: boolean;
  payment_status: 'pending' | 'paid' | 'expired' | 'failed';
  payment_method: string | null;
  paid_at: string | null;
  webhook_processed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DonationCampaignRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  image_url: string | null;
  target_amount: number;
  is_active: boolean;
  is_featured: boolean;
  starts_at: string | null;
  ends_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DonationCampaignWithProgress extends DonationCampaignRow {
  paid_amount: number;
  paid_count: number;
  progress_pct: number;
}

export interface CampaignDonorWall {
  campaign_id: string;
  donation_id: string;
  display_name: string;
  amount: number;
  message: string | null;
  paid_at: string | null;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  cta_text: string | null;
  cta_link: string | null;
  link_url: string | null;
  order_index: number | null;
  is_active: boolean;
  created_at: string;
}

export interface Activity {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  date: string | null;
  location: string | null;
  image_url: string | null;
  category: string;
  author: string | null;
  read_time: string | null;
  likes: number;
  comments: number;
  link: string | null;
  is_active: boolean;
  is_live: boolean;
  created_at: string;
}

export interface Management {
  id: string;
  name: string;
  position: string;
  role: string;
  photo: string | null;
  angkatan: string | null;
  period: string | null;
  instagram: string | null;
  linkedin: string | null;
  order_index: number | null;
  is_active: boolean;
  created_at: string;
}

export interface Dormitory {
  id: string;
  name: string;
  code: string;
  city: string;
  province: string | null;
  description: string | null;
  image_url: string | null;
  color: string | null;
  total_rooms: number | null;
  occupied_rooms: number | null;
  order_index: number;
  created_at: string;
}

export interface Cluster {
  id: string;
  name: string;
  short_name: string | null;
  code: string;
  description: string | null;
  image_url: string | null;
  color: string | null;
  icon: string | null;
  order_index: number;
  created_at: string;
}
