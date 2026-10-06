import React, { useState, useEffect } from 'react';
import { Post, Category } from '../types';
import { api } from '../api';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Copy, 
  Star, 
  Eye, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  Loader2 
} from 'lucide-react';

interface PostsTabProps {
  onEditPost: (post: Post) => void;
  onNewPost: () => void;
  onViewPost: (slug: string) => void;
}

export const PostsTab: React.FC<PostsTabProps> = ({ onEditPost, onNewPost, onViewPost }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        api.getPosts({ 
          search: search || undefined, 
          category: categoryFilter || undefined, 
          status: statusFilter,
          limit: 100 
        }),
        api.getCategories()
      ]);
      setPosts(pRes.posts);
      setCategories(cRes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [categoryFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleToggleFeatured = async (post: Post) => {
    setActionLoading(`feat-${post.id}`);
    try {
      const updated = await api.updatePost(post.id, { isFeatured: !post.isFeatured });
      setPosts(posts.map(p => p.id === post.id ? updated : p));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (post: Post) => {
    const nextStatus = post.status === 'published' ? 'draft' : 'published';
    setActionLoading(`status-${post.id}`);
    try {
      const updated = await api.updatePost(post.id, { status: nextStatus });
      setPosts(posts.map(p => p.id === post.id ? updated : p));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDuplicate = async (post: Post) => {
    setActionLoading(`dup-${post.id}`);
    try {
      const dup = await api.duplicatePost(post.id);
      setPosts([dup, ...posts]);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (post: Post) => {
    if (!window.confirm(`Are you sure you want to delete "${post.title}"? This cannot be undone.`)) {
      return;
    }
    setActionLoading(`del-${post.id}`);
    try {
      await api.deletePost(post.id);
      setPosts(posts.filter(p => p.id !== post.id));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-50">
            Craft Tutorials & Articles
          </h2>
          <p className="text-xs text-neutral-500">
            Manage your step-by-step guides, drafts, SEO, and featured articles.
          </p>
        </div>

        <button
          onClick={onNewPost}
          className="flex items-center gap-2 rounded-xl bg-craft-primary px-5 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Write New Craft
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="rounded-2xl bg-white dark:bg-[#201E24] p-4 border border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 craft-card-shadow">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by title, tags or content..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 pl-9 pr-3 py-2 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-craft-primary"
          />
        </form>

        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="rounded-2xl bg-white dark:bg-[#201E24] border border-neutral-200 dark:border-neutral-800 overflow-hidden craft-card-shadow">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-neutral-500">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-craft-primary mb-2" />
            Loading tutorials...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-500">
            No craft articles match the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Post</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Steps</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-900/60 transition-colors">
                    {/* Thumbnail & Title */}
                    <td className="py-3 px-4 max-w-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="h-11 w-14 rounded-lg object-cover bg-neutral-100 shrink-0"
                        />
                        <div className="truncate">
                          <span className="font-bold text-neutral-900 dark:text-neutral-100 block truncate">
                            {post.title}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            /post/{post.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 font-medium">
                      {post.categoryName || 'General'}
                    </td>

                    {/* Steps count */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-bold text-neutral-700 dark:text-neutral-300">
                        {post.steps?.length || 0} steps
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(post)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                          post.status === 'published'
                            ? 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                        title="Click to toggle status"
                      >
                        {post.status === 'published' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {post.status}
                      </button>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleFeatured(post)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          post.isFeatured
                            ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                            : 'text-neutral-300 hover:text-amber-400'
                        }`}
                        title={post.isFeatured ? 'Featured on home' : 'Mark as featured'}
                      >
                        <Star className={`h-4 w-4 ${post.isFeatured ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>

                    {/* Views */}
                    <td className="py-3 px-4 font-semibold text-neutral-500">
                      {post.views || 0}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewPost(post.slug)}
                          className="rounded-lg p-1.5 text-neutral-400 hover:text-craft-primary"
                          title="View on site"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEditPost(post)}
                          className="rounded-lg p-1.5 text-neutral-400 hover:text-teal-600"
                          title="Edit tutorial"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(post)}
                          className="rounded-lg p-1.5 text-neutral-400 hover:text-amber-600"
                          title="Duplicate craft"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post)}
                          className="rounded-lg p-1.5 text-neutral-400 hover:text-red-600"
                          title="Delete post"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
