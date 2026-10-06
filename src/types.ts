export interface CraftStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  imageUrl: string;
  tips?: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  amount?: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  introduction: string;
  categoryId: string;
  categoryName?: string;
  tags: string[];
  featuredImage: string;
  materials: MaterialItem[];
  videoUrl?: string;
  steps: CraftStep[];
  finalLookImage?: string;
  closingTips?: string;
  difficulty?: 'Easy' | 'Medium' | 'Advanced';
  timeNeeded?: string;
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  ogImage?: string;

  // Status & meta
  status: 'published' | 'draft';
  isFeatured: boolean;
  publishedAt: string;
  updatedAt: string;
  views: number;
  readingTimeMinutes: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  iconName?: string;
  order: number;
  postCount?: number;
}

export interface Comment {
  id: string;
  postId: string;
  postTitle?: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
  isApproved: boolean;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface PageContent {
  id: string;
  slug: 'about' | 'privacy' | 'terms' | 'disclaimer';
  title: string;
  content: string;
  lastUpdated: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  authorName: string;
  authorBio: string;
  authorAvatar: string;
  
  // Social Links
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  pinterestUrl: string;
  twitterUrl: string;

  // AdSense & Monetization
  adsensePublisherId: string; // e.g. "ca-pub-XXXXXXXXXXXXXXXX"
  adsenseEnabled: boolean;
  adsTxt: string;

  // Analytics & Webmaster
  googleAnalyticsId: string;
  googleSearchConsoleTag: string;

  // Footer & Misc
  footerText: string;
  contactEmail: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  passwordHash?: string;
}

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalCategories: number;
  totalViews: number;
  totalSubscribers: number;
  unreadMessages: number;
  pendingComments: number;
  recentPosts: Post[];
}
