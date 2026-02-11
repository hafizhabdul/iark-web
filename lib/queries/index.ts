// Query keys for TanStack Query
export const queryKeys = {
  // Homepage
  homepage: ['homepage'] as const,
  heroSlides: ['hero-slides'] as const,
  
  // Stories
  stories: ['stories'] as const,
  storiesPublished: (category?: string) => ['stories', 'published', category] as const,
  storyDetail: (slug: string) => ['stories', slug] as const,
  storiesByAuthor: (authorId: string) => ['stories', 'author', authorId] as const,
  
  // Events
  events: ['events'] as const,
  eventsWithRegistrations: ['events', 'with-registrations'] as const,
  eventDetail: (id: string) => ['events', id] as const,
  
  // Batches
  batches: ['batches'] as const,
  batchesWithLeaders: ['batches', 'with-leaders'] as const,
  
  // Testimonials
  testimonials: (type?: string) => ['testimonials', type] as const,
  testimonialsAdmin: ['testimonials', 'admin'] as const,
  
  // Management
  management: ['management'] as const,
  
  // Activities
  activities: ['activities'] as const,
  
  // Dormitories
  dormitories: ['dormitories'] as const,
  
  // Dashboard
  dashboardStats: ['dashboard', 'stats'] as const,
  
  // Users/Profiles
  profiles: ['profiles'] as const,
  profile: (id: string) => ['profiles', id] as const,
  alumni: ['alumni'] as const,
  
  // Clusters
  clusters: ['clusters'] as const,
} as const;

// Stale time configurations (in milliseconds)
export const staleTime = {
  // Static content - cache for 5 minutes
  static: 5 * 60 * 1000,
  
  // Semi-dynamic content - cache for 1 minute
  semiDynamic: 1 * 60 * 1000,
  
  // Dynamic content - always fresh
  dynamic: 0,
  
  // Real-time content - refetch frequently
  realtime: 10 * 1000,
} as const;
