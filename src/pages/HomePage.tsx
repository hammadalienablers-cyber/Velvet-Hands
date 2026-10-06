import React, { useState, useEffect } from 'react';
import { Post, Category } from '../types';
import { api } from '../api';
import { useSettings } from '../context/SettingsContext';
import { CraftCard } from '../components/CraftCard';
import { NewsletterBox } from '../components/NewsletterBox';
import { AdSenseBanner } from '../components/AdSenseBanner';
import { SEOHead } from '../components/SEOHead';
import { 
  Sparkles, 
  Search, 
  Flame, 
  TrendingUp, 
  Layers, 
  Scissors,
  ArrowRight,
  Clock,
  Palette,
  Recycle,
  Gift,
  Home as HomeIcon
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { settings } = useSettings();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState('');

  useEffect(() => {
    Promise.all([
      api.getPosts({ status: 'published', limit: 20 }),
      api.getCategories()
    ]).then(([postsData, catsData]) => {
      setPosts(postsData.posts);
      setCategories(catsData);
    }).catch(err => {
      console.error('Error fetching home data', err);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      onNavigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  const featuredPosts = posts.filter(p => p.isFeatured);
  const popularPosts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4);
  const latestPosts = posts.slice(0, 6);

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Scissors': return <Scissors className="h-5 w-5" />;
      case 'Home': return <HomeIcon className="h-5 w-5" />;
      case 'Sparkles': return <Sparkles className="h-5 w-5" />;
      case 'Gift': return <Gift className="h-5 w-5" />;
      case 'Recycle': return <Recycle className="h-5 w-5" />;
      default: return <Palette className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-12">
      <SEOHead 
        title={`${settings.siteName} – ${settings.tagline}`} 
        description={settings.description} 
        settings={settings} 
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-14 pb-12">
        <div className="relative mx-auto max-w-4xl text-center px-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-craft-primary/10 dark:bg-craft-primary/20 px-4 py-1.5 text-xs font-bold text-craft-primary mb-6 animate-pulse">
            <Sparkles className="h-4 w-4" />
            <span>Discover 100% Free Step-by-Step DIY Tutorials</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight leading-[1.15]">
            Make Beautiful Crafts <br className="hidden sm:inline" />
            <span className="text-craft-primary bg-clip-text">One Step At A Time</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            {settings.description || 'Step-by-step DIY craft tutorials with clear visual steps, printable materials lists, and creative inspiration.'}
          </p>

          {/* Hero Search Bar */}
          <form onSubmit={handleHeroSearch} className="mt-8 max-w-xl mx-auto relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              placeholder="What would you like to craft today? (e.g. paper flowers, wall art, macrame)..."
              value={heroSearch}
              onChange={e => setHeroSearch(e.target.value)}
              className="w-full rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#201E24] pl-12 pr-28 py-4 text-sm sm:text-base text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-craft-primary craft-card-shadow"
            />
            <button
              type="submit"
              className="absolute right-2.5 rounded-xl bg-craft-primary px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity"
            >
              Search
            </button>
          </form>

          {/* Quick category pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-neutral-400 dark:text-neutral-500 font-semibold">Popular:</span>
            {categories.slice(0, 4).map(cat => (
              <button
                key={cat.id}
                onClick={() => onNavigate(`/category/${cat.slug}`)}
                className="rounded-full bg-white dark:bg-[#25222B] px-3 py-1 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:border-craft-primary hover:text-craft-primary transition-colors"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Crafts */}
      {featuredPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-amber-100 dark:bg-amber-950/60 p-2 text-amber-600">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-50">
                  Featured Tutorials
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Hand-picked visual craft guides with complete step-by-step photos
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {featuredPosts.slice(0, 2).map((post) => (
              <CraftCard
                key={post.id}
                post={post}
                featured={true}
                onClick={() => onNavigate(`/post/${post.slug}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Header/Top AdSense Banner Space */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdSenseBanner placement="header" />
      </section>

      {/* Browse by Category Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-teal-100 dark:bg-teal-950/60 p-2 text-craft-secondary">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-50">
                Browse by Category
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Find your next weekend project by materials and technique
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate(`/category/${cat.slug}`)}
              className="group cursor-pointer rounded-2xl bg-white dark:bg-[#201E24] p-4 text-center border border-neutral-100 dark:border-neutral-800 craft-card-shadow transition-all duration-200 hover:-translate-y-1 hover:border-craft-primary"
            >
              <div className="relative mx-auto mb-3 h-16 w-16 overflow-hidden rounded-2xl bg-amber-50 dark:bg-neutral-800 flex items-center justify-center text-craft-primary group-hover:scale-105 transition-transform">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center text-white drop-shadow-md">
                  {getCategoryIcon(cat.iconName)}
                </div>
              </div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-craft-primary transition-colors">
                {cat.name}
              </h4>
              <span className="mt-1 inline-block text-[11px] text-neutral-400 dark:text-neutral-500">
                {cat.postCount || 0} crafts
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Crafts Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-rose-100 dark:bg-rose-950/60 p-2 text-rose-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-50">
                Latest Crafts & Guides
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Freshly published DIY step-by-step projects
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-72 rounded-2xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
            ))}
          </div>
        ) : latestPosts.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 text-center text-sm text-neutral-500">
            No published crafts found. Log into the admin panel to publish your first craft!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <CraftCard
                key={post.id}
                post={post}
                onClick={() => onNavigate(`/post/${post.slug}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Popular Posts */}
      {popularPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-amber-50/70 dark:bg-[#1E1C24] border border-amber-200/50 dark:border-neutral-800 p-6 sm:p-10">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="rounded-xl bg-amber-200 dark:bg-amber-900/60 p-2 text-amber-700 dark:text-amber-300">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-neutral-900 dark:text-neutral-50">
                  Most Popular Craft Ideas
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Community favorites with highest views
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {popularPosts.map((post, index) => (
                <div
                  key={post.id}
                  onClick={() => onNavigate(`/post/${post.slug}`)}
                  className="group cursor-pointer rounded-2xl bg-white dark:bg-[#26232D] p-3.5 border border-neutral-100 dark:border-neutral-800/80 craft-card-shadow transition-all hover:-translate-y-1"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
                      #{index + 1}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-craft-primary uppercase">
                    {post.categoryName}
                  </span>
                  <h4 className="font-bold text-xs text-neutral-900 dark:text-neutral-100 line-clamp-2 mt-1 group-hover:text-craft-primary">
                    {post.title}
                  </h4>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400">
                    <span>{post.views} views</span>
                    <ArrowRight className="h-3 w-3 text-craft-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <NewsletterBox />
      </section>
    </div>
  );
};
