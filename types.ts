export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  SCHEDULED = 'SCHEDULED',
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown or HTML
  excerpt: string;
  coverImage: string;
  galleryImages?: string[];
  author: string;
  category: string;
  tags: string[];
  status: PostStatus;
  publishedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  views: number;
}

export interface FooterLink {
  label: string;
  url: string;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  googleAnalyticsId: string;
  googleAdSenseCode: string;
  aboutContent: string;
  contactContent: string;
  contactEmail: string;
  footerText: string;
  footerExploreLinks: FooterLink[];
  footerLegalLinks: FooterLink[];
  socialLinks: {
    twitter: string;
    facebook: string;
    linkedin: string;
    instagram: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

// AI Configuration Types
export type ImageAspectRatio = "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "9:16" | "16:9" | "21:9";
export type ImageSize = "1K" | "2K" | "4K";