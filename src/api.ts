import { Post, Category, Comment, Subscriber, ContactMessage, MediaItem, PageContent, SiteSettings, DashboardStats } from './types';

const API_BASE = '/api';

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('craftnest_admin_token') : null;
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Posts
  async getPosts(params: { category?: string; tag?: string; search?: string; status?: string; limit?: number; offset?: number } = {}) {
    const query = new URLSearchParams();
    if (params.category) query.set('category', params.category);
    if (params.tag) query.set('tag', params.tag);
    if (params.search) query.set('search', params.search);
    if (params.status) query.set('status', params.status);
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.offset) query.set('offset', params.offset.toString());

    const res = await fetch(`${API_BASE}/posts?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json() as Promise<{ posts: Post[]; total: number }>;
  },

  async getPostBySlug(slug: string, inc = false): Promise<Post> {
    const res = await fetch(`${API_BASE}/posts/${slug}${inc ? '?inc=1' : ''}`);
    if (!res.ok) throw new Error('Post not found');
    return res.json();
  },

  async createPost(post: Partial<Post>): Promise<Post> {
    const res = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(post)
    });
    if (!res.ok) throw new Error('Failed to create post');
    return res.json();
  },

  async updatePost(id: string, post: Partial<Post>): Promise<Post> {
    const res = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(post)
    });
    if (!res.ok) throw new Error('Failed to update post');
    return res.json();
  },

  async deletePost(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete post');
    return res.json();
  },

  async duplicatePost(id: string): Promise<Post> {
    const res = await fetch(`${API_BASE}/posts/${id}/duplicate`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to duplicate post');
    return res.json();
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async createCategory(cat: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(cat)
    });
    if (!res.ok) throw new Error('Failed to create category');
    return res.json();
  },

  async updateCategory(id: string, cat: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(cat)
    });
    if (!res.ok) throw new Error('Failed to update category');
    return res.json();
  },

  async deleteCategory(id: string, reassignId?: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/categories/${id}${reassignId ? `?reassign=${reassignId}` : ''}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete category');
    return data;
  },

  // Comments
  async getComments(postId?: string, approvedOnly = false): Promise<Comment[]> {
    const query = new URLSearchParams();
    if (postId) query.set('postId', postId);
    if (approvedOnly) query.set('approvedOnly', 'true');
    const res = await fetch(`${API_BASE}/comments?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch comments');
    return res.json();
  },

  async addComment(comment: { postId: string; authorName: string; authorEmail?: string; content: string; honeypot?: string }): Promise<Comment> {
    const res = await fetch(`${API_BASE}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment)
    });
    if (!res.ok) throw new Error('Failed to post comment');
    return res.json();
  },

  async toggleApproveComment(id: string): Promise<Comment> {
    const res = await fetch(`${API_BASE}/comments/${id}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to update comment');
    return res.json();
  },

  async deleteComment(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/comments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete comment');
    return res.json();
  },

  // Subscribers
  async getSubscribers(): Promise<Subscriber[]> {
    const res = await fetch(`${API_BASE}/subscribers`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch subscribers');
    return res.json();
  },

  async addSubscriber(email: string, honeypot = ''): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/subscribers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, honeypot })
    });
    return res.json();
  },

  async deleteSubscriber(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/subscribers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Contact Messages
  async getMessages(): Promise<ContactMessage[]> {
    const res = await fetch(`${API_BASE}/messages`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async sendMessage(msg: { name: string; email: string; subject?: string; message: string; honeypot?: string }): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg)
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  async markMessageRead(id: string, isRead = true): Promise<ContactMessage> {
    const res = await fetch(`${API_BASE}/messages/${id}/read`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ isRead })
    });
    return res.json();
  },

  async deleteMessage(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/messages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Media
  async getMedia(): Promise<MediaItem[]> {
    const res = await fetch(`${API_BASE}/media`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch media');
    return res.json();
  },

  async uploadFile(file: File): Promise<MediaItem> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },

  async uploadBase64(dataUrl: string, filename?: string): Promise<MediaItem> {
    const res = await fetch(`${API_BASE}/upload/base64`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ dataUrl, filename })
    });
    if (!res.ok) throw new Error('Base64 upload failed');
    return res.json();
  },

  async deleteMedia(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/media/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Pages
  async getPages(): Promise<PageContent[]> {
    const res = await fetch(`${API_BASE}/pages`);
    if (!res.ok) throw new Error('Failed to fetch pages');
    return res.json();
  },

  async getPageBySlug(slug: string): Promise<PageContent> {
    const res = await fetch(`${API_BASE}/pages/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch page');
    return res.json();
  },

  async updatePage(slug: string, data: { title?: string; content?: string }): Promise<PageContent> {
    const res = await fetch(`${API_BASE}/pages/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update page');
    return res.json();
  },

  // Settings
  async getSettings(): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  // Auth
  async login(email: string, password: string): Promise<{ token: string; admin: { id: string; email: string; name: string } }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: 'Invalid login credentials' }));
      throw new Error(data.error || 'Invalid credentials');
    }
    return res.json();
  },

  async checkAuth(): Promise<{ admin: { id: string; email: string; name: string } }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async updateProfile(data: { email?: string; name?: string; password?: string }): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // Stats
  async getStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/stats`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  }
};
