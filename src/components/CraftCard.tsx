import React from 'react';
import { Post } from '../types';
import { Clock, Eye, Calendar, ArrowRight } from 'lucide-react';

interface CraftCardProps {
  post: Post;
  onClick: () => void;
  featured?: boolean;
}

export const CraftCard: React.FC<CraftCardProps> = ({ post, onClick, featured = false }) => {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer overflow-hidden rounded-2xl bg-white dark:bg-[#232128] craft-card-shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-neutral-100 dark:border-neutral-800 flex flex-col ${
        featured ? 'md:col-span-2 md:flex-row' : ''
      }`}
    >
      {/* Thumbnail */}
      <div className={`relative overflow-hidden bg-neutral-100 dark:bg-neutral-800 ${featured ? 'md:w-1/2 aspect-video md:aspect-auto' : 'aspect-4/3'}`}>
        <img
          src={post.featuredImage}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center rounded-full bg-white/95 dark:bg-[#201E24]/90 px-3 py-1 text-xs font-bold text-craft-primary backdrop-blur-sm shadow-sm">
            {post.categoryName || 'Crafts'}
          </span>
        </div>
        {post.difficulty && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center rounded-full bg-neutral-900/70 text-white px-2.5 py-0.5 text-[11px] font-medium backdrop-blur-sm">
              {post.difficulty}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-5 flex flex-col justify-between flex-1 ${featured ? 'md:p-7 md:w-1/2' : ''}`}>
        <div>
          <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTimeMinutes} min read
            </span>
          </div>

          <h3 className={`font-bold text-neutral-900 dark:text-neutral-50 group-hover:text-craft-primary transition-colors line-clamp-2 ${featured ? 'text-xl md:text-2xl' : 'text-lg'}`}>
            {post.title}
          </h3>

          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500">
            <Eye className="h-3.5 w-3.5" />
            {post.views || 0} views
          </span>

          <span className="inline-flex items-center gap-1 text-xs font-bold text-craft-primary group-hover:translate-x-0.5 transition-transform">
            View Tutorial
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
