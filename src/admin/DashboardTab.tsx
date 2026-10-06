import React, { useState, useEffect } from 'react';
import { DashboardStats, Post } from '../types';
import { api } from '../api';
import { useSettings } from '../context/SettingsContext';
import { 
  FileText, 
  Eye, 
  Users, 
  Mail, 
  MessageSquare, 
  PlusCircle, 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle,
  Clock,
  TrendingUp,
  Layers,
  Edit
} from 'lucide-react';

interface DashboardTabProps {
  onNavigateTab: (tab: string, meta?: any) => void;
  onViewPost: (slug: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ onNavigateTab, onViewPost }) => {
  const { settings } = useSettings();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getStats()
      .then(res => setStats(res))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 rounded-2xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Craft Tutorials',
      value: stats.totalPosts,
      sub: `${stats.publishedPosts} published, ${stats.draftPosts} drafts`,
      icon: <FileText className="h-5 w-5 text-craft-primary" />,
      color: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900'
    },
    {
      label: 'Total Readers & Views',
      value: stats.totalViews.toLocaleString(),
      sub: 'Cumulative page hits',
      icon: <Eye className="h-5 w-5 text-teal-600" />,
      color: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-900'
    },
    {
      label: 'Newsletter Subscribers',
      value: stats.totalSubscribers,
      sub: 'Exportable CSV list',
      icon: <Users className="h-5 w-5 text-amber-600" />,
      color: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900'
    },
    {
      label: 'Inbox Inquiries',
      value: stats.unreadMessages,
      sub: `${stats.unreadMessages} unread message(s)`,
      icon: <Mail className="h-5 w-5 text-indigo-600" />,
      color: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-3xl bg-linear-to-r from-amber-100/80 via-white to-rose-100/60 dark:from-[#25202D] dark:to-[#1C1A22] p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 craft-card-shadow">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-craft-primary uppercase tracking-wider mb-2">
            <Sparkles className="h-4 w-4" />
            Creator Hub
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-50">
            Welcome to {settings.siteName} Studio
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl">
            Publish visual step-by-step tutorials, manage DIY categories, check comments, and monetize your content with Google AdSense.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('posts-new')}
          className="flex items-center gap-2 rounded-2xl bg-craft-primary px-6 py-3 text-sm font-bold text-white shadow-lg hover:opacity-90 transition-opacity shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          Create New Craft Article
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-5 border ${card.color} transition-all hover:-translate-y-0.5`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
                {card.label}
              </span>
              <div className="rounded-xl bg-white dark:bg-neutral-800 p-2 shadow-xs">
                {card.icon}
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-neutral-900 dark:text-neutral-50">
                {card.value}
              </span>
              <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                {card.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* AdSense Approval Readiness Checklist */}
      <div className="rounded-2xl bg-white dark:bg-[#201E24] p-6 border border-neutral-200 dark:border-neutral-800 craft-card-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-teal-600" />
            <h3 className="font-extrabold text-base text-neutral-900 dark:text-neutral-100">
              Google AdSense Approval Checklist
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
            {settings.adsensePublisherId ? 'Ready / Configured' : 'Setup Required'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <span className="font-bold text-teal-600 block mb-0.5">✓ Mandatory Pages</span>
            <span className="text-neutral-500">About, Privacy Policy, Terms, Disclaimer</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <span className="font-bold text-teal-600 block mb-0.5">✓ ads.txt Endpoint</span>
            <span className="text-neutral-500">Active at /ads.txt</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <span className="font-bold text-teal-600 block mb-0.5">✓ Cookie Banner</span>
            <span className="text-neutral-500">GDPR compliance active</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <span className="font-bold text-teal-600 block mb-0.5">✓ Rich HowTo Schema</span>
            <span className="text-neutral-500">JSON-LD rich results enabled</span>
          </div>
        </div>
      </div>

      {/* Recent Posts Table */}
      <div className="rounded-2xl bg-white dark:bg-[#201E24] p-6 border border-neutral-200 dark:border-neutral-800 craft-card-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-base text-neutral-900 dark:text-neutral-100">
            Recent Craft Articles
          </h3>
          <button
            onClick={() => onNavigateTab('posts')}
            className="text-xs font-bold text-craft-primary hover:underline flex items-center gap-1"
          >
            Manage All Posts
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800 text-neutral-400">
                <th className="pb-3 font-semibold">Title</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Views</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {stats.recentPosts.map((post) => (
                <tr key={post.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50">
                  <td className="py-3 font-bold text-neutral-900 dark:text-neutral-100 max-w-xs truncate pr-4">
                    {post.title}
                  </td>
                  <td className="py-3 text-neutral-500">
                    {post.categoryName || 'Crafts'}
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      post.status === 'published' 
                        ? 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300' 
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="py-3 text-neutral-500">
                    {post.views || 0}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewPost(post.slug)}
                        className="rounded-lg p-1 text-neutral-400 hover:text-craft-primary"
                        title="View post"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onNavigateTab('posts-edit', post)}
                        className="rounded-lg p-1 text-neutral-400 hover:text-teal-600"
                        title="Edit post"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
