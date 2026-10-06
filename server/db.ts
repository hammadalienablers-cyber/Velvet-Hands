import fs from 'fs';
import path from 'path';
import { Post, Category, Comment, Subscriber, ContactMessage, MediaItem, PageContent, SiteSettings, AdminUser, DashboardStats } from '../src/types';
import { initialCategories, initialPosts, initialPages, initialSettings, initialAdmin } from './seedData';

interface DatabaseSchema {
  categories: Category[];
  posts: Post[];
  comments: Comment[];
  subscribers: Subscriber[];
  messages: ContactMessage[];
  media: MediaItem[];
  pages: PageContent[];
  settings: SiteSettings;
  admin: AdminUser;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

let memoryDb: DatabaseSchema | null = null;

function loadDatabase(): DatabaseSchema {
  if (memoryDb) return memoryDb;

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      // Ensure all arrays and objects are present
      memoryDb = {
        categories: parsed.categories || initialCategories,
        posts: parsed.posts || initialPosts,
        comments: parsed.comments || [],
        subscribers: parsed.subscribers || [
          { id: 'sub-1', email: 'crafter.sarah@gmail.com', subscribedAt: new Date(Date.now() - 200000000).toISOString() },
          { id: 'sub-2', email: 'diy.mark@outlook.com', subscribedAt: new Date(Date.now() - 100000000).toISOString() }
        ],
        messages: parsed.messages || [
          {
            id: 'msg-1',
            name: 'Chloe Bennett',
            email: 'chloe@diyweddings.co',
            subject: 'Love your crepe paper peony tutorial!',
            message: 'Hello! I used your 3D peony tutorial for my sister’s bridal shower table centerpieces and everyone thought they were real! Thank you so much for the detailed steps.',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            isRead: false
          }
        ],
        media: parsed.media || [],
        pages: parsed.pages || initialPages,
        settings: { ...initialSettings, ...(parsed.settings || {}) },
        admin: { ...initialAdmin, ...(parsed.admin || {}) }
      };
      return memoryDb;
    } catch (err) {
      console.error('Error parsing database.json, re-initializing seed data', err);
    }
  }

  // Initial seed
  memoryDb = {
    categories: initialCategories,
    posts: initialPosts,
    comments: [
      {
        id: 'comm-1',
        postId: 'post-crepe-paper-peony',
        postTitle: 'How to Make 3D Crepe Paper Peony Flowers: A Step-by-Step Guide',
        authorName: 'Hannah Crafty',
        authorEmail: 'hannah@gmail.com',
        content: 'This was so easy to follow! The tip about cupping the crepe paper with both thumbs made all the difference.',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        isApproved: true
      }
    ],
    subscribers: [
      { id: 'sub-1', email: 'crafter.sarah@gmail.com', subscribedAt: new Date(Date.now() - 200000000).toISOString() },
      { id: 'sub-2', email: 'diy.mark@outlook.com', subscribedAt: new Date(Date.now() - 100000000).toISOString() }
    ],
    messages: [
      {
        id: 'msg-1',
        name: 'Chloe Bennett',
        email: 'chloe@diyweddings.co',
        subject: 'Love your crepe paper peony tutorial!',
        message: 'Hello! I used your 3D peony tutorial for my sister’s bridal shower table centerpieces and everyone thought they were real! Thank you so much for the detailed steps.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        isRead: false
      }
    ],
    media: [
      {
        id: 'media-1',
        filename: 'crepe-peony-hero.jpg',
        url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80',
        size: 384000,
        mimeType: 'image/jpeg',
        uploadedAt: new Date().toISOString()
      },
      {
        id: 'media-2',
        filename: 'macrame-feather.jpg',
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
        size: 420000,
        mimeType: 'image/jpeg',
        uploadedAt: new Date().toISOString()
      }
    ],
    pages: initialPages,
    settings: initialSettings,
    admin: initialAdmin
  };

  saveDatabase(memoryDb);
  return memoryDb;
}

function saveDatabase(db: DatabaseSchema) {
  memoryDb = db;
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Failed to save database.json', err);
  }
}

export const db = {
  // Posts
  getPosts(options: { categorySlug?: string; tag?: string; search?: string; status?: 'published' | 'draft' | 'all'; limit?: number; offset?: number } = {}) {
    const state = loadDatabase();
    let result = [...state.posts];

    if (options.status && options.status !== 'all') {
      result = result.filter(p => p.status === options.status);
    } else if (!options.status) {
      result = result.filter(p => p.status === 'published');
    }

    if (options.categorySlug) {
      const cat = state.categories.find(c => c.slug === options.categorySlug);
      if (cat) {
        result = result.filter(p => p.categoryId === cat.id);
      }
    }

    if (options.tag) {
      const lower = options.tag.toLowerCase();
      result = result.filter(p => p.tags.some(t => t.toLowerCase() === lower));
    }

    if (options.search) {
      const q = options.search.toLowerCase().trim();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.introduction.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Attach category names
    result = result.map(p => {
      const cat = state.categories.find(c => c.id === p.categoryId);
      return {
        ...p,
        categoryName: cat ? cat.name : 'General'
      };
    });

    // Sort by publishedAt descending
    result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const total = result.length;
    if (options.offset) {
      result = result.slice(options.offset);
    }
    if (options.limit) {
      result = result.slice(0, options.limit);
    }

    return { posts: result, total };
  },

  getPostBySlug(slug: string, incrementViews = false): Post | null {
    const state = loadDatabase();
    const index = state.posts.findIndex(p => p.slug === slug);
    if (index === -1) return null;

    if (incrementViews) {
      state.posts[index].views = (state.posts[index].views || 0) + 1;
      saveDatabase(state);
    }

    const post = state.posts[index];
    const cat = state.categories.find(c => c.id === post.categoryId);
    return {
      ...post,
      categoryName: cat ? cat.name : 'General'
    };
  },

  getPostById(id: string): Post | null {
    const state = loadDatabase();
    const post = state.posts.find(p => p.id === id);
    if (!post) return null;
    const cat = state.categories.find(c => c.id === post.categoryId);
    return {
      ...post,
      categoryName: cat ? cat.name : 'General'
    };
  },

  createPost(data: Partial<Post>): Post {
    const state = loadDatabase();
    const now = new Date().toISOString();
    
    // Auto-generate slug if not provided
    let slug = data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `post-${Date.now()}`;
    // Ensure slug uniqueness
    let counter = 1;
    const originalSlug = slug;
    while (state.posts.some(p => p.slug === slug)) {
      slug = `${originalSlug}-${counter++}`;
    }

    const newPost: Post = {
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      slug,
      title: data.title || 'Untitled Craft Tutorial',
      excerpt: data.excerpt || '',
      introduction: data.introduction || '',
      categoryId: data.categoryId || (state.categories[0]?.id || 'cat-paper'),
      tags: data.tags || ['DIY', 'Crafts'],
      featuredImage: data.featuredImage || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      materials: data.materials || [],
      videoUrl: data.videoUrl || '',
      steps: data.steps || [],
      finalLookImage: data.finalLookImage || data.featuredImage || '',
      closingTips: data.closingTips || '',
      difficulty: data.difficulty || 'Easy',
      timeNeeded: data.timeNeeded || '30 mins',
      seoTitle: data.seoTitle || data.title,
      seoDescription: data.seoDescription || data.excerpt,
      focusKeyword: data.focusKeyword || '',
      ogImage: data.ogImage || data.featuredImage,
      status: data.status || 'published',
      isFeatured: Boolean(data.isFeatured),
      publishedAt: data.publishedAt || now,
      updatedAt: now,
      views: 0,
      readingTimeMinutes: Math.max(3, Math.ceil(((data.steps?.length || 5) * 80 + (data.introduction?.length || 100) / 5) / 200))
    };

    state.posts.unshift(newPost);
    saveDatabase(state);
    return newPost;
  },

  updatePost(id: string, data: Partial<Post>): Post | null {
    const state = loadDatabase();
    const index = state.posts.findIndex(p => p.id === id);
    if (index === -1) return null;

    const existing = state.posts[index];
    const updated: Post = {
      ...existing,
      ...data,
      id: existing.id,
      updatedAt: new Date().toISOString()
    };

    // Calculate reading time
    if (updated.steps || updated.introduction) {
      updated.readingTimeMinutes = Math.max(3, Math.ceil(((updated.steps?.length || 5) * 80 + (updated.introduction?.length || 100) / 5) / 200));
    }

    state.posts[index] = updated;
    saveDatabase(state);
    return updated;
  },

  deletePost(id: string): boolean {
    const state = loadDatabase();
    const initialLen = state.posts.length;
    state.posts = state.posts.filter(p => p.id !== id);
    if (state.posts.length !== initialLen) {
      // Also delete comments
      state.comments = state.comments.filter(c => c.postId !== id);
      saveDatabase(state);
      return true;
    }
    return false;
  },

  duplicatePost(id: string): Post | null {
    const orig = this.getPostById(id);
    if (!orig) return null;
    return this.createPost({
      ...orig,
      title: `${orig.title} (Copy)`,
      slug: `${orig.slug}-copy`,
      status: 'draft',
      views: 0
    });
  },

  // Categories
  getCategories(): Category[] {
    const state = loadDatabase();
    return state.categories.map(cat => ({
      ...cat,
      postCount: state.posts.filter(p => p.categoryId === cat.id && p.status === 'published').length
    })).sort((a, b) => a.order - b.order);
  },

  getCategoryBySlug(slug: string): Category | null {
    const cats = this.getCategories();
    return cats.find(c => c.slug === slug) || null;
  },

  createCategory(data: Partial<Category>): Category {
    const state = loadDatabase();
    let slug = data.slug || data.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `category-${Date.now()}`;
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      slug,
      name: data.name || 'New Category',
      description: data.description || '',
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      iconName: data.iconName || 'Scissors',
      order: state.categories.length + 1
    };
    state.categories.push(newCat);
    saveDatabase(state);
    return newCat;
  },

  updateCategory(id: string, data: Partial<Category>): Category | null {
    const state = loadDatabase();
    const index = state.categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    state.categories[index] = { ...state.categories[index], ...data };
    saveDatabase(state);
    return state.categories[index];
  },

  deleteCategory(id: string, reassignCategoryId?: string): { success: boolean; message?: string } {
    const state = loadDatabase();
    const postsWithCategory = state.posts.filter(p => p.categoryId === id);
    
    if (postsWithCategory.length > 0 && !reassignCategoryId) {
      return { 
        success: false, 
        message: `Cannot delete: ${postsWithCategory.length} post(s) currently belong to this category. Please reassign them first.` 
      };
    }

    if (postsWithCategory.length > 0 && reassignCategoryId) {
      state.posts.forEach(p => {
        if (p.categoryId === id) p.categoryId = reassignCategoryId;
      });
    }

    state.categories = state.categories.filter(c => c.id !== id);
    saveDatabase(state);
    return { success: true };
  },

  // Comments
  getComments(options: { postId?: string; approvedOnly?: boolean } = {}): Comment[] {
    const state = loadDatabase();
    let list = [...state.comments];
    if (options.postId) {
      list = list.filter(c => c.postId === options.postId);
    }
    if (options.approvedOnly) {
      list = list.filter(c => c.isApproved);
    }
    // Attach post title if available
    list = list.map(c => {
      const post = state.posts.find(p => p.id === c.postId);
      return { ...c, postTitle: post?.title || 'Unknown Craft' };
    });
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  addComment(data: { postId: string; authorName: string; authorEmail: string; content: string }): Comment {
    const state = loadDatabase();
    const newComment: Comment = {
      id: `comm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      postId: data.postId,
      authorName: data.authorName.trim(),
      authorEmail: data.authorEmail.trim(),
      content: data.content.trim(),
      createdAt: new Date().toISOString(),
      isApproved: true // Auto-approved for friendly community, admin can delete/moderate
    };
    state.comments.unshift(newComment);
    saveDatabase(state);
    return newComment;
  },

  toggleApproveComment(id: string): Comment | null {
    const state = loadDatabase();
    const comment = state.comments.find(c => c.id === id);
    if (!comment) return null;
    comment.isApproved = !comment.isApproved;
    saveDatabase(state);
    return comment;
  },

  deleteComment(id: string): boolean {
    const state = loadDatabase();
    const len = state.comments.length;
    state.comments = state.comments.filter(c => c.id !== id);
    if (state.comments.length !== len) {
      saveDatabase(state);
      return true;
    }
    return false;
  },

  // Subscribers
  getSubscribers(): Subscriber[] {
    const state = loadDatabase();
    return [...state.subscribers].sort((a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime());
  },

  addSubscriber(email: string): { success: boolean; message: string } {
    const state = loadDatabase();
    const clean = email.toLowerCase().trim();
    if (!clean || !clean.includes('@')) {
      return { success: false, message: 'Invalid email address.' };
    }
    if (state.subscribers.some(s => s.email.toLowerCase() === clean)) {
      return { success: true, message: "You're already subscribed to CraftNest!" };
    }
    state.subscribers.unshift({
      id: `sub-${Date.now()}`,
      email: clean,
      subscribedAt: new Date().toISOString()
    });
    saveDatabase(state);
    return { success: true, message: 'Thank you! You are now subscribed to CraftNest weekly crafts.' };
  },

  deleteSubscriber(id: string): boolean {
    const state = loadDatabase();
    const len = state.subscribers.length;
    state.subscribers = state.subscribers.filter(s => s.id !== id);
    if (state.subscribers.length !== len) {
      saveDatabase(state);
      return true;
    }
    return false;
  },

  // Contact Messages
  getMessages(): ContactMessage[] {
    const state = loadDatabase();
    return [...state.messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  addMessage(data: { name: string; email: string; subject: string; message: string }): ContactMessage {
    const state = loadDatabase();
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      subject: data.subject.trim() || 'General Inquiry',
      message: data.message.trim(),
      createdAt: new Date().toISOString(),
      isRead: false
    };
    state.messages.unshift(newMsg);
    saveDatabase(state);
    return newMsg;
  },

  markMessageRead(id: string, isRead = true): ContactMessage | null {
    const state = loadDatabase();
    const msg = state.messages.find(m => m.id === id);
    if (!msg) return null;
    msg.isRead = isRead;
    saveDatabase(state);
    return msg;
  },

  deleteMessage(id: string): boolean {
    const state = loadDatabase();
    const len = state.messages.length;
    state.messages = state.messages.filter(m => m.id !== id);
    if (state.messages.length !== len) {
      saveDatabase(state);
      return true;
    }
    return false;
  },

  // Media Library
  getMedia(): MediaItem[] {
    const state = loadDatabase();
    return [...state.media].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  },

  addMedia(item: { filename: string; url: string; size: number; mimeType: string }): MediaItem {
    const state = loadDatabase();
    const mediaItem: MediaItem = {
      id: `media-${Date.now()}`,
      ...item,
      uploadedAt: new Date().toISOString()
    };
    state.media.unshift(mediaItem);
    saveDatabase(state);
    return mediaItem;
  },

  deleteMedia(id: string): boolean {
    const state = loadDatabase();
    const item = state.media.find(m => m.id === id);
    if (!item) return false;

    // If local file in /public/uploads, try to remove from disk
    if (item.url.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', item.url);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
      }
    }

    state.media = state.media.filter(m => m.id !== id);
    saveDatabase(state);
    return true;
  },

  // Static Legal Pages
  getPages(): PageContent[] {
    const state = loadDatabase();
    return state.pages;
  },

  getPageBySlug(slug: string): PageContent | null {
    const state = loadDatabase();
    return state.pages.find(p => p.slug === slug) || null;
  },

  updatePage(slug: string, data: { title?: string; content?: string }): PageContent | null {
    const state = loadDatabase();
    const page = state.pages.find(p => p.slug === slug);
    if (!page) return null;
    if (data.title) page.title = data.title;
    if (data.content) page.content = data.content;
    page.lastUpdated = new Date().toISOString();
    saveDatabase(state);
    return page;
  },

  // Settings
  getSettings(): SiteSettings {
    const state = loadDatabase();
    return state.settings;
  },

  updateSettings(data: Partial<SiteSettings>): SiteSettings {
    const state = loadDatabase();
    state.settings = { ...state.settings, ...data };
    saveDatabase(state);
    return state.settings;
  },

  // Admin & Auth
  getAdmin(): { id: string; email: string; name: string } {
    const state = loadDatabase();
    return {
      id: state.admin.id,
      email: state.admin.email,
      name: state.admin.name
    };
  },

  verifyAdmin(email: string, password: string): boolean {
    const state = loadDatabase();
    const envEmail = process.env.ADMIN_EMAIL || 'admin@craftnest.com';
    const envPass = process.env.ADMIN_PASSWORD || 'admin123';
    
    // Check against state admin or env
    if (email === state.admin.email && (password === state.admin.passwordHash || password === envPass)) {
      return true;
    }
    if (email === envEmail && password === envPass) {
      return true;
    }
    return false;
  },

  updateAdmin(data: { email?: string; name?: string; password?: string }): boolean {
    const state = loadDatabase();
    if (data.email) state.admin.email = data.email;
    if (data.name) state.admin.name = data.name;
    if (data.password) state.admin.passwordHash = data.password;
    saveDatabase(state);
    return true;
  },

  // Stats
  getStats(): DashboardStats {
    const state = loadDatabase();
    const totalViews = state.posts.reduce((sum, p) => sum + (p.views || 0), 0);
    const unreadMessages = state.messages.filter(m => !m.isRead).length;
    const pendingComments = state.comments.filter(c => !c.isApproved).length;

    return {
      totalPosts: state.posts.length,
      publishedPosts: state.posts.filter(p => p.status === 'published').length,
      draftPosts: state.posts.filter(p => p.status === 'draft').length,
      totalCategories: state.categories.length,
      totalViews,
      totalSubscribers: state.subscribers.length,
      unreadMessages,
      pendingComments,
      recentPosts: state.posts.slice(0, 5)
    };
  }
};
