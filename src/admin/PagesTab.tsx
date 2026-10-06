import React, { useState, useEffect } from 'react';
import { PageContent } from '../types';
import { api } from '../api';
import { Save, Check, FileText, ExternalLink } from 'lucide-react';

export const PagesTab: React.FC<{ onPreviewPage: (slug: string) => void }> = ({ onPreviewPage }) => {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<'about' | 'privacy' | 'terms' | 'disclaimer'>('privacy');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    api.getPages().then(res => {
      setPages(res);
      const cur = res.find(p => p.slug === selectedSlug);
      if (cur) {
        setTitle(cur.title);
        setContent(cur.content);
      }
    });
  }, []);

  const handleSelectPage = (slug: 'about' | 'privacy' | 'terms' | 'disclaimer') => {
    setSelectedSlug(slug);
    setSavedSuccess(false);
    const found = pages.find(p => p.slug === slug);
    if (found) {
      setTitle(found.title);
      setContent(found.content);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const updated = await api.updatePage(selectedSlug, { title, content });
      setPages(pages.map(p => p.slug === selectedSlug ? updated : p));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save page');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-50">
            AdSense & Legal Pages Editor
          </h2>
          <p className="text-xs text-neutral-500">
            Customize mandatory pages required for Google AdSense and reader trust.
          </p>
        </div>

        <button
          onClick={() => onPreviewPage(selectedSlug)}
          className="flex items-center gap-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Preview Live Page
        </button>
      </div>

      {/* Page Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['about', 'privacy', 'terms', 'disclaimer'] as const).map(slug => (
          <button
            key={slug}
            onClick={() => handleSelectPage(slug)}
            className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition-all ${
              selectedSlug === slug
                ? 'bg-craft-primary text-white shadow-sm'
                : 'bg-white dark:bg-[#201E24] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:border-craft-primary'
            }`}
          >
            {slug === 'about' ? 'About Us' : slug === 'privacy' ? 'Privacy Policy' : slug === 'terms' ? 'Terms & Conditions' : 'Disclaimer'}
          </button>
        ))}
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSave} className="rounded-2xl bg-white dark:bg-[#201E24] p-6 border border-neutral-200 dark:border-neutral-800 craft-card-shadow space-y-4">
        <div>
          <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
            Page Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-2.5 text-sm font-bold text-neutral-900 dark:text-neutral-100"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
            HTML Page Content
          </label>
          <p className="text-[11px] text-neutral-500 mb-2">
            Supports HTML tags like &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, and &lt;strong&gt;.
          </p>
          <textarea
            rows={14}
            required
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-4 text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-craft-primary leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
          {savedSuccess ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-teal-600">
              <Check className="h-4 w-4" />
              Page saved successfully!
            </span>
          ) : <span />}

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-craft-primary px-6 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? 'Saving Changes...' : 'Save Page Content'}
          </button>
        </div>
      </form>
    </div>
  );
};
