import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import { api } from '../api';
import { useSettings } from '../context/SettingsContext';
import { SEOHead } from '../components/SEOHead';
import { CraftCard } from '../components/CraftCard';
import { Search, Sparkles, Filter } from 'lucide-react';

interface SearchPageProps {
  initialQuery?: string;
  onNavigate: (path: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ initialQuery = '', onNavigate }) => {
  const { settings } = useSettings();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
    if (initialQuery.trim()) {
      performSearch(initialQuery.trim());
    }
  }, [initialQuery]);

  const performSearch = async (searchTerm: string) => {
    setIsLoading(true);
    try {
      const res = await api.getPosts({ search: searchTerm, status: 'published' });
      setResults(res.posts);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query.trim());
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <SEOHead
        title={`Search DIY Crafts: ${query || 'Find Tutorials'}`}
        description={`Search DIY crafts and tutorials on ${settings.siteName}`}
        settings={settings}
      />

      {/* Search Header */}
      <div className="rounded-3xl bg-white dark:bg-[#201E24] p-8 border border-neutral-200/80 dark:border-neutral-800 craft-card-shadow">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-craft-primary/10 px-3.5 py-1 text-xs font-bold text-craft-primary mb-3">
            <Search className="h-3.5 w-3.5" />
            Craft Search
          </div>

          <h1 className="text-3xl font-black text-neutral-900 dark:text-neutral-50">
            Search DIY Tutorials & Supplies
          </h1>

          <form onSubmit={handleSearchSubmit} className="mt-6 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by title, materials, or tags (e.g. crepe paper, glass jars, feathers)..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 pl-12 pr-4 py-3.5 text-sm sm:text-base text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-craft-primary"
              />
            </div>
            <button
              type="submit"
              className="rounded-2xl bg-craft-primary px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
            {query.trim() ? (
              <>Results for <span className="text-craft-primary">"{query}"</span> ({results.length})</>
            ) : (
              'Enter a keyword to explore crafts'
            )}
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-2xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
            ))}
          </div>
        ) : results.length === 0 && query.trim() ? (
          <div className="rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 p-12 text-center">
            <p className="text-neutral-500 text-sm">
              No craft tutorials found matching "{query}". Try searching for broader terms like "paper", "decor", or "recycled".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(post => (
              <CraftCard
                key={post.id}
                post={post}
                onClick={() => onNavigate(`/post/${post.slug}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
