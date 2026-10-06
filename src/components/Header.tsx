import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { Category } from '../types';
import { api } from '../api';
import { 
  Scissors, 
  Search, 
  Sun, 
  Moon, 
  ChevronDown, 
  Menu, 
  X, 
  Shield, 
  Sparkles,
  Layers
} from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const { settings, theme, toggleTheme } = useSettings();
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    api.getCategories()
      .then(cats => setCategories(cats))
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-neutral-800 bg-[#FFF8F0]/90 dark:bg-[#1A191D]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div 
          onClick={() => onNavigate('/')}
          className="flex cursor-pointer items-center gap-2.5 group"
        >
          {settings.logoUrl ? (
            <img 
              src={settings.logoUrl} 
              alt={settings.siteName} 
              className="h-10 w-auto object-contain" 
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-craft-primary text-white shadow-md shadow-craft-primary/20 transition-transform group-hover:scale-105">
              <Scissors className="h-5 w-5" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-1">
              {settings.siteName || 'CraftNest'}
              <Sparkles className="h-3.5 w-3.5 text-craft-primary" />
            </span>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium tracking-wide hidden sm:inline">
              DIY Craft Tutorials
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 text-sm font-semibold">
          <button
            onClick={() => onNavigate('/')}
            className={`rounded-xl px-3 py-2 transition-colors ${
              currentPath === '/' 
                ? 'text-craft-primary bg-craft-primary/10 dark:bg-craft-primary/20' 
                : 'text-neutral-700 dark:text-neutral-300 hover:text-craft-primary hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
            }`}
          >
            Home
          </button>

          {/* Categories Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsCatDropdownOpen(true)}
            onMouseLeave={() => setIsCatDropdownOpen(false)}
          >
            <button
              onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
              className={`flex items-center gap-1 rounded-xl px-3 py-2 transition-colors ${
                currentPath.startsWith('/category/')
                  ? 'text-craft-primary bg-craft-primary/10 dark:bg-craft-primary/20'
                  : 'text-neutral-700 dark:text-neutral-300 hover:text-craft-primary hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
              }`}
            >
              <Layers className="h-4 w-4" />
              Categories
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {isCatDropdownOpen && (
              <div className="absolute left-0 top-full pt-1.5 w-64 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#201E24] p-2 shadow-xl">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onNavigate(`/category/${cat.slug}`);
                        setIsCatDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 hover:text-craft-primary transition-colors"
                    >
                      <span>{cat.name}</span>
                      {cat.postCount !== undefined && (
                        <span className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-500 dark:text-neutral-400">
                          {cat.postCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('/about')}
            className={`rounded-xl px-3 py-2 transition-colors ${
              currentPath === '/about'
                ? 'text-craft-primary bg-craft-primary/10 dark:bg-craft-primary/20'
                : 'text-neutral-700 dark:text-neutral-300 hover:text-craft-primary hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
            }`}
          >
            About
          </button>

          <button
            onClick={() => onNavigate('/contact')}
            className={`rounded-xl px-3 py-2 transition-colors ${
              currentPath === '/contact'
                ? 'text-craft-primary bg-craft-primary/10 dark:bg-craft-primary/20'
                : 'text-neutral-700 dark:text-neutral-300 hover:text-craft-primary hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Right side tools */}
        <div className="flex items-center gap-2">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Search crafts"
          >
            <Search className="h-4.5 w-4.5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          {/* Admin link */}
          <button
            onClick={() => onNavigate('/admin')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              isAuthenticated
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
            title="Admin Publishing Panel"
          >
            <Shield className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{isAuthenticated ? 'Admin' : 'Log in'}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Open mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Search Modal Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-20 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#201E24] p-5 shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">Search DIY Crafts</span>
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="rounded-lg p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="mt-4 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. crepe paper, macrame, recycling, lanterns..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 pl-9 pr-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-craft-primary"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-craft-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-[#FFF8F0] dark:bg-[#1A191D] px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1 text-sm font-semibold">
            <button
              onClick={() => { onNavigate('/'); setIsMobileMenuOpen(false); }}
              className="rounded-xl px-3 py-2.5 text-left text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
            >
              Home
            </button>

            <div className="py-1">
              <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Categories
              </span>
              <div className="mt-1 flex flex-col pl-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { onNavigate(`/category/${cat.slug}`); setIsMobileMenuOpen(false); }}
                    className="rounded-xl px-3 py-2 text-left text-xs text-neutral-700 dark:text-neutral-300 hover:text-craft-primary"
                  >
                    • {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { onNavigate('/about'); setIsMobileMenuOpen(false); }}
              className="rounded-xl px-3 py-2.5 text-left text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
            >
              About
            </button>

            <button
              onClick={() => { onNavigate('/contact'); setIsMobileMenuOpen(false); }}
              className="rounded-xl px-3 py-2.5 text-left text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
            >
              Contact
            </button>

            <button
              onClick={() => { onNavigate('/admin'); setIsMobileMenuOpen(false); }}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 py-2.5 text-xs font-bold"
            >
              <Shield className="h-4 w-4" />
              {isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
