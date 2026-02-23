// Database types for Supabase
//
// Insert/Update use Record<string, unknown> because Supabase v2.94's type
// inference resolves Partial<Interface> to `never` when used as GenericTable
// constraints. Row types remain fully typed for read queries.
// If you need write type safety, use the row interfaces directly at call sites.

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      batches: {
        Row: Batch;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      batch_leaders: {
        Row: BatchLeader;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [
          {
            foreignKeyName: 'batch_leaders_batch_id_fkey';
            columns: ['batch_id'];
            referencedRelation: 'batches';
            referencedColumns: ['id'];
          }
        ];
      };
      testimonials: {
        Row: Testimonial;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      stories: {
        Row: StoryRow;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [
          {
            foreignKeyName: 'stories_author_id_fkey';
            columns: ['author_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      events: {
        Row: EventRow;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      event_registrations: {
        Row: EventRegistrationRow;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [
          {
            foreignKeyName: 'event_registrations_event_id_fkey';
            columns: ['event_id'];
            referencedRelation: 'events';
            referencedColumns: ['id'];
          }
        ];
      };
      donations: {
        Row: DonationRow;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [
          {
            foreignKeyName: 'donations_campaign_id_fkey';
            columns: ['campaign_id'];
            referencedRelation: 'donation_campaigns';
            referencedColumns: ['id'];
          }
        ];
      };
      donation_campaigns: {
        Row: DonationCampaignRow;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      hero_slides: {
        Row: HeroSlide;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      activities: {
        Row: Activity;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      management: {
        Row: Management;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      dormitories: {
        Row: Dormitory;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      clusters: {
        Row: Cluster;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
    };
    Views: {
      vw_donation_campaign_progress: {
        Row: DonationCampaignWithProgress;
        Relationships: [];
      };
      vw_campaign_donor_wall: {
        Row: CampaignDonorWall;
        Relationships: [];
      };
      vw_donation_overall_stats: {
        Row: {
          total_paid_amount: number;
          total_paid_count: number;
        };
        Relationships: [];
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
      get_published_stories: {
        Args: {
          p_limit: number;
          p_offset: number;
          p_category: string | null;
        };
        Returns: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          hero_image: string | null;
          category: string;
          featured: boolean;
          published_at: string | null;
          author_name: string;
          author_angkatan: number | null;
          author_photo: string | null;
        }[];
      };
      get_dashboard_stats: {
        Args: Record<string, never>;
        Returns: {
          total_stories: number;
          pending_stories: number;
          total_users: number;
          total_events: number;
          upcoming_events: number;
          total_registrations: number;
          total_donations: number;
          total_donations_amount: number;
        };
      };
    };
    Enums: Record<string, never>;
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
  title: string;
  content: string | null;
  quote: string;
  photo: string | null;
  angkatan: string | null;
  type: 'ketua_angkatan' | 'tokoh_ternama';
  is_active: boolean;
  order_index: number | null;
  created_at: string;
}

export type StoryStatus = 'draft' | 'pending' | 'published' | 'rejected';
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
  status: StoryStatus;
  rejected_reason: string | null;
  featured: boolean;
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
  is_active: boolean;
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
  kampus: string | null;
  organization: string | null;
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
  order_index: number;
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
  role: 'pengurus_inti' | 'ketua_angkatan';
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
  code: string | null;
  city: string;
  province: string | null;
  description: string | null;
  image_url: string | null;
  color: string | null;
  total_rooms: number | null;
  occupied_rooms: number | null;
  order_index: number | null;
  created_at: string;
}

export interface Cluster {
  id: string;
  name: string;
  short_name: string;
  code: string | null;
  description: string | null;
  image_url: string | null;
  color: 'red' | 'blue' | 'yellow' | null;
  icon: string | null;
  order_index: number | null;
  created_at: string;
}
