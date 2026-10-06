import React from 'react';
import { Scissors, Home, Search } from 'lucide-react';

export const NotFoundPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-craft-primary/10 text-craft-primary mb-6 animate-bounce">
        <Scissors className="h-10 w-10 rotate-45" />
      </div>

      <span className="text-xs font-black uppercase tracking-widest text-craft-primary">
        Error 404
      </span>

      <h1 className="mt-2 text-4xl sm:text-5xl font-black text-neutral-900 dark:text-neutral-50">
        Page Snipped Away!
      </h1>

      <p className="mt-4 text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-md mx-auto">
        We searched high and low in our craft boxes, but couldn't find the tutorial or page you were looking for.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 rounded-2xl bg-craft-primary px-6 py-3 text-sm font-bold text-white shadow-md hover:opacity-90"
        >
          <Home className="h-4 w-4" />
          Back to CraftNest Home
        </button>
        <button
          onClick={() => onNavigate('/search')}
          className="flex items-center gap-2 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-6 py-3 text-sm font-bold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700"
        >
          <Search className="h-4 w-4" />
          Search All Crafts
        </button>
      </div>
    </div>
  );
};
