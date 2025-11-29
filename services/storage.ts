import { BlogPost, PostStatus, SiteSettings } from '../types';

const POSTS_KEY = 'bloggetway_posts';
const SETTINGS_KEY = 'bloggetway_settings';
const PREVIEW_KEY = 'bloggetway_preview_post';

const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of AI in Content Creation',
    slug: 'future-of-ai-content',
    content: 'Artificial Intelligence is revolutionizing how we create content. From drafting blog posts to generating realistic images, tools like Gemini are changing the game...\n\n## Why AI Matters\nIt allows for faster iteration and deeper research capabilities.',
    excerpt: 'Explore how AI tools are reshaping the digital landscape.',
    coverImage: 'https://picsum.photos/seed/ai/800/400',
    galleryImages: [
      'https://picsum.photos/seed/tech1/800/400',
      'https://picsum.photos/seed/tech2/800/400',
      'https://picsum.photos/seed/tech3/800/400'
    ],
    author: 'Admin',
    category: 'Technology',
    tags: ['AI', 'Future', 'Tech'],
    status: PostStatus.PUBLISHED,
    publishedAt: new Date().toISOString(),
    views: 1250,
  },
  {
    id: '2',
    title: '10 Tips for Better SEO',
    slug: '10-tips-better-seo',
    content: 'Search Engine Optimization is critical for driving traffic. Here are 10 tips to improve your ranking...',
    excerpt: 'Boost your site ranking with these actionable tips.',
    coverImage: 'https://picsum.photos/seed/seo/800/400',
    galleryImages: [],
    author: 'Admin',
    category: 'Marketing',
    tags: ['SEO', 'Growth'],
    status: PostStatus.DRAFT,
    publishedAt: '',
    views: 0,
  }
];

const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'BlogGetWay',
  siteDescription: 'Your gateway to intelligent blogging.',
  logoUrl: '',
  faviconUrl: '',
  primaryColor: '#3b82f6',
  googleAnalyticsId: '',
  googleAdSenseCode: '',
  aboutContent: 'Welcome to BlogGetWay. We are dedicated to providing the best content powered by artificial intelligence. Our mission is to share knowledge and inspire creativity through technology.',
  contactContent: 'Have questions or want to work together? We would love to hear from you. Reach out to us using the email below.',
  contactEmail: 'hello@bloggetway.com',
  footerText: 'All rights reserved.',
  footerExploreLinks: [
    { label: 'Home', url: '/' },
    { label: 'Latest Articles', url: '/blog' },
    { label: 'About Us', url: '/about' },
    { label: 'Contact', url: '/contact' },
  ],
  footerLegalLinks: [
    { label: 'Privacy Policy', url: '#' },
    { label: 'Terms of Service', url: '#' },
    { label: 'Cookie Policy', url: '#' },
  ],
  socialLinks: {
    twitter: '#',
    facebook: '#',
    linkedin: '#',
    instagram: '#',
  }
};

export const storageService = {
  getPosts: (): BlogPost[] => {
    const stored = localStorage.getItem(POSTS_KEY);
    if (!stored) {
      localStorage.setItem(POSTS_KEY, JSON.stringify(INITIAL_POSTS));
      return INITIAL_POSTS;
    }
    return JSON.parse(stored);
  },

  getPost: (id: string): BlogPost | undefined => {
    const posts = storageService.getPosts();
    return posts.find(p => p.id === id);
  },

  savePost: (post: BlogPost): void => {
    const posts = storageService.getPosts();
    const index = posts.findIndex(p => p.id === post.id);
    if (index >= 0) {
      posts[index] = post;
    } else {
      posts.push(post);
    }
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  },

  deletePost: (id: string): void => {
    const posts = storageService.getPosts();
    const newPosts = posts.filter(p => p.id !== id);
    localStorage.setItem(POSTS_KEY, JSON.stringify(newPosts));
  },

  getSettings: (): SiteSettings => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return INITIAL_SETTINGS;
    // Merge with initial settings to ensure new fields exist if local storage has old data
    const parsed = JSON.parse(stored);
    return { 
      ...INITIAL_SETTINGS, 
      ...parsed,
      // Ensure arrays exist if loading old data
      footerExploreLinks: parsed.footerExploreLinks || INITIAL_SETTINGS.footerExploreLinks,
      footerLegalLinks: parsed.footerLegalLinks || INITIAL_SETTINGS.footerLegalLinks
    };
  },

  saveSettings: (settings: SiteSettings): void => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  // Preview Methods
  savePreviewPost: (post: BlogPost): void => {
    localStorage.setItem(PREVIEW_KEY, JSON.stringify(post));
  },

  getPreviewPost: (): BlogPost | null => {
    const stored = localStorage.getItem(PREVIEW_KEY);
    return stored ? JSON.parse(stored) : null;
  }
};