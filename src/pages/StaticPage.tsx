import React, { useState, useEffect } from 'react';
import { PageContent } from '../types';
import { api } from '../api';
import { useSettings } from '../context/SettingsContext';
import { SEOHead } from '../components/SEOHead';
import { FileText, ShieldCheck, HelpCircle, ArrowLeft } from 'lucide-react';

interface StaticPageProps {
  slug: 'about' | 'privacy' | 'terms' | 'disclaimer';
  onNavigate: (path: string) => void;
}

export const StaticPage: React.FC<StaticPageProps> = ({ slug, onNavigate }) => {
  const { settings } = useSettings();
  const [page, setPage] = useState<PageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.getPageBySlug(slug)
      .then(res => {
        setPage(res);
      })
      .catch(err => console.error(err))
      .finally(() => {
        setIsLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="h-10 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse mb-8" />
        <div className="space-y-4">
          <div className="h-6 w-full bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          <div className="h-6 w-5/6 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          <div className="h-6 w-4/6 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Page Not Found</h2>
        <button
          onClick={() => onNavigate('/')}
          className="mt-4 rounded-xl bg-craft-primary px-4 py-2 text-xs font-bold text-white"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <SEOHead
        title={page.title}
        description={`Learn more about ${settings.siteName} - ${page.title}`}
        canonicalPath={`/${slug}`}
        settings={settings}
      />

      <button
        onClick={() => onNavigate('/')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-craft-primary mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </button>

      <div className="rounded-3xl bg-white dark:bg-[#201E24] p-8 sm:p-12 border border-neutral-200/90 dark:border-neutral-800 craft-card-shadow">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="rounded-xl bg-amber-100 dark:bg-amber-950/60 p-2 text-amber-700 dark:text-amber-300">
            <FileText className="h-5 w-5" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-craft-primary">
            Official Documentation
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-50 mb-2">
          {page.title}
        </h1>

        <span className="block text-xs text-neutral-400 mb-8">
          Last revised: {new Date(page.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </span>

        {/* Content rendered safely with rich craft prose styles */}
        <div
          className="prose-craft text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
};
