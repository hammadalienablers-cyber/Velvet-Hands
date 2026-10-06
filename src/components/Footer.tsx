import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { 
  Scissors, 
  Instagram, 
  Facebook, 
  Youtube, 
  Twitter, 
  Heart, 
  Share2,
  ExternalLink 
} from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useSettings();

  return (
    <footer className="mt-20 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#151417] text-neutral-600 dark:text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand Info */}
          <div>
            <div 
              onClick={() => onNavigate('/')}
              className="flex cursor-pointer items-center gap-2 mb-4"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-craft-primary text-white shadow-sm">
                <Scissors className="h-4.5 w-4.5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-neutral-900 dark:text-neutral-50">
                {settings.siteName || 'CraftNest'}
              </span>
            </div>
            
            <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 mb-5">
              {settings.tagline || 'Your Home for Inspiring DIY & Step-by-Step Crafts'}. Clear visual guides, material lists, and creative handmade projects for all skill levels.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-craft-primary hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-craft-primary hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-craft-primary hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              )}
              {settings.twitterUrl && (
                <a
                  href={settings.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-craft-primary hover:text-white transition-colors"
                  aria-label="X / Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {settings.pinterestUrl && (
                <a
                  href={settings.pinterestUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-craft-primary hover:text-white transition-colors"
                  aria-label="Pinterest"
                >
                  <Share2 className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-4 tracking-wide uppercase">
              Explore
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs font-medium">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-craft-primary transition-colors">
                  Home Page
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-craft-primary transition-colors">
                  About Us & Mission
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-craft-primary transition-colors">
                  Contact Us & Submit Ideas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin')} className="hover:text-craft-primary transition-colors flex items-center gap-1">
                  Admin Publishing Panel
                  <ExternalLink className="h-3 w-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Categories */}
          <div>
            <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-4 tracking-wide uppercase">
              Categories
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs font-medium">
              <li>
                <button onClick={() => onNavigate('/category/paper-crafts')} className="hover:text-craft-primary transition-colors">
                  Paper Crafts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/category/home-decor')} className="hover:text-craft-primary transition-colors">
                  Home Decor DIY
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/category/recycling-crafts')} className="hover:text-craft-primary transition-colors">
                  Recycling & Upcycling
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/category/handmade-gifts')} className="hover:text-craft-primary transition-colors">
                  Handmade Gifts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/category/kids-crafts')} className="hover:text-craft-primary transition-colors">
                  Kids Crafts & Sensory Play
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Mandatory Legal & Trust Pages */}
          <div>
            <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-4 tracking-wide uppercase">
              Legal & AdSense Policy
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs font-medium">
              <li>
                <button onClick={() => onNavigate('/privacy')} className="hover:text-craft-primary transition-colors">
                  Privacy Policy & Cookies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-craft-primary transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/disclaimer')} className="hover:text-craft-primary transition-colors">
                  Craft Safety Disclaimer
                </button>
              </li>
              <li>
                <a href="/ads.txt" target="_blank" className="hover:text-craft-primary transition-colors inline-flex items-center gap-1 text-[11px] text-neutral-400">
                  ads.txt Verification
                </a>
              </li>
              <li>
                <a href="/sitemap.xml" target="_blank" className="hover:text-craft-primary transition-colors inline-flex items-center gap-1 text-[11px] text-neutral-400">
                  sitemap.xml (SEO)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p className="flex items-center gap-1 text-center sm:text-left">
            {settings.footerText || `© ${new Date().getFullYear()} CraftNest. All rights reserved.`}
          </p>
          <div className="flex items-center gap-1 text-neutral-400 dark:text-neutral-500 text-[11px]">
            <span>Crafted with</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            <span>for DIY makers & creators worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
