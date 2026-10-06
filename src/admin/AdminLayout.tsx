import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Post } from '../types';
import { 
  LayoutDashboard, 
  FileText, 
  Layers, 
  Image as ImageIcon, 
  MessageSquare, 
  Users, 
  Mail, 
  FileCode, 
  Settings as SettingsIcon, 
  LogOut, 
  ExternalLink, 
  Scissors, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

import { DashboardTab } from './DashboardTab';
import { PostsTab } from './PostsTab';
import { PostEditor } from './PostEditor';
import { CategoriesTab } from './CategoriesTab';
import { MediaLibraryTab } from './MediaLibraryTab';
import { CommentsTab } from './CommentsTab';
import { SubscribersTab } from './SubscribersTab';
import { MessagesTab } from './MessagesTab';
import { PagesTab } from './PagesTab';
import { SettingsTab } from './SettingsTab';

interface AdminLayoutProps {
  onNavigateHome: () => void;
  onViewPost: (slug: string) => void;
  onPreviewPage: (slug: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onNavigateHome, onViewPost, onPreviewPage }) => {
  const { admin, logout } = useAuth();
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'posts', label: 'Craft Tutorials', icon: <FileText className="h-4 w-4" /> },
    { id: 'categories', label: 'Categories', icon: <Layers className="h-4 w-4" /> },
    { id: 'media', label: 'Media Library', icon: <ImageIcon className="h-4 w-4" /> },
    { id: 'comments', label: 'Comments', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'subscribers', label: 'Subscribers', icon: <Users className="h-4 w-4" /> },
    { id: 'messages', label: 'Contact Messages', icon: <Mail className="h-4 w-4" /> },
    { id: 'pages', label: 'Legal Pages', icon: <FileCode className="h-4 w-4" /> },
    { id: 'settings', label: 'Site & AdSense', icon: <SettingsIcon className="h-4 w-4" /> },
  ];

  const handleTabChange = (tabId: string, meta?: any) => {
    if (tabId === 'posts-new') {
      setPostToEdit(null);
      setActiveTab('post-editor');
    } else if (tabId === 'posts-edit') {
      setPostToEdit(meta);
      setActiveTab('post-editor');
    } else {
      setActiveTab(tabId);
    }
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FBF7F2] dark:bg-[#141316] text-[#2D2A32] dark:text-[#F3F1ED] flex">
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1B1920] transform transition-transform duration-200 md:translate-x-0 md:static ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-full flex-col justify-between p-4">
          <div>
            {/* Brand in Sidebar */}
            <div className="flex items-center justify-between pb-6 pt-2 px-2 border-b border-neutral-100 dark:border-neutral-800 mb-4">
              <div 
                onClick={onNavigateHome}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-craft-primary text-white shadow-sm">
                  <Scissors className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="font-extrabold text-sm block leading-tight">
                    {settings.siteName}
                  </span>
                  <span className="text-[10px] text-craft-primary font-bold tracking-wider uppercase">
                    Admin Studio
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden p-1 text-neutral-400 hover:text-neutral-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1">
              {navItems.map(item => {
                const isActive = (activeTab === item.id) || (item.id === 'posts' && activeTab === 'post-editor');
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-craft-primary text-white shadow-sm'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 hover:text-neutral-900 dark:hover:text-neutral-100'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom user profile & actions */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
            <button
              onClick={onNavigateHome}
              className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="h-3.5 w-3.5 text-teal-600" />
                View Public Site
              </span>
            </button>

            <button
              onClick={logout}
              className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-[#1B1920]/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              {navItems.find(n => n.id === activeTab)?.label || (activeTab === 'post-editor' ? 'Post Editor' : 'Admin')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 hidden sm:inline">
              Logged in as <strong className="text-neutral-900 dark:text-neutral-100">{admin?.email || 'admin@craftnest.com'}</strong>
            </span>
            <div className="h-8 w-8 rounded-full bg-craft-primary/10 text-craft-primary flex items-center justify-center font-bold text-xs">
              CN
            </div>
          </div>
        </header>

        {/* Tab Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardTab
              onNavigateTab={handleTabChange}
              onViewPost={onViewPost}
            />
          )}

          {activeTab === 'posts' && (
            <PostsTab
              onEditPost={(p) => { setPostToEdit(p); setActiveTab('post-editor'); }}
              onNewPost={() => { setPostToEdit(null); setActiveTab('post-editor'); }}
              onViewPost={onViewPost}
            />
          )}

          {activeTab === 'post-editor' && (
            <PostEditor
              postToEdit={postToEdit}
              onBack={() => setActiveTab('posts')}
              onSaved={(p) => { setActiveTab('posts'); }}
              onPreview={onViewPost}
            />
          )}

          {activeTab === 'categories' && <CategoriesTab />}

          {activeTab === 'media' && <MediaLibraryTab />}

          {activeTab === 'comments' && <CommentsTab onViewPost={onViewPost} />}

          {activeTab === 'subscribers' && <SubscribersTab />}

          {activeTab === 'messages' && <MessagesTab />}

          {activeTab === 'pages' && <PagesTab onPreviewPage={onPreviewPage} />}

          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  );
};
