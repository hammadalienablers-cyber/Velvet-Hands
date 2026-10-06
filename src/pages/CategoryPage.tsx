import React, { useState, useEffect } from 'react';
import { Category, Post } from '../types';
import { api } from '../api';
import { useSettings } from '../context/SettingsContext';
import { SEOHead } from '../components/SEOHead';
import { CraftCard } from '../components/CraftCard';
import { AdSenseBanner } from '../components/AdSenseBanner';
import { Layers, ArrowLeft } from 'lucide-react';

interface CategoryPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ slug, onNavigate }) => {
  const { settings } = useSettings();
  const [category, setCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.getCategories()
      .then(cats => {
        const found = cats.find(c => c.slug === slug || c.id === slug);
        if (found) {
          setCategory(found);
          return api.getPosts({ category: found.slug, status: 'published' });
        }
        return { posts: [], total: 0 };
      })
      .then(res => {
        setPosts(res.posts);
      })
      .catch(err => console.error(err))
      .finally(() => {
        setIsLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="h-40 rounded-3xl bg-neutral-200 dark:bg-neutral-800 animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Category Not Found</h2>
        <p className="mt-2 text-sm text-neutral-500">The category you are looking for does not exist.</p>
        <button
          onClick={() => onNavigate('/')}
          className="mt-6 rounded-xl bg-craft-primary px-5 py-2.5 text-xs font-bold text-white shadow-md"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <SEOHead
        title={`${category.name} Tutorials & Ideas`}
        description={category.description}
        canonicalPath={`/category/${category.slug}`}
        settings={settings}
      />

      {/* Category Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-amber-50 to-teal-50 dark:from-[#231E2A] dark:to-[#192224] p-8 md:p-12 border border-neutral-200/80 dark:border-neutral-800 craft-card-shadow">
        <div className="max-w-2xl relative z-10">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-craft-primary mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Crafts
          </button>

          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-white/10 px-3 py-1 text-xs font-bold text-craft-primary mb-3">
            <Layers className="h-3.5 w-3.5" />
            Category Archive
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-neutral-50">
            {category.name}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {category.description}
          </p>

          <span className="mt-4 inline-block text-xs font-semibold text-neutral-400">
            Showing {posts.length} published {posts.length === 1 ? 'tutorial' : 'tutorials'}
          </span>
        </div>
      </div>

      {/* AdSense Unit */}
      <AdSenseBanner placement="header" />

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 p-12 text-center">
          <p className="text-neutral-500 text-sm">
            No craft articles published under this category yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <CraftCard
              key={post.id}
              post={post}
              onClick={() => onNavigate(`/post/${post.slug}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
