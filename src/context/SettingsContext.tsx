import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings } from '../types';
import { api } from '../api';

const defaultSettings: SiteSettings = {
  siteName: 'CraftNest',
  tagline: 'Your Home for Inspiring DIY & Step-by-Step Crafts',
  description: 'Discover easy, beautiful DIY craft tutorials, paper flowers, modern boho home decor, upcycling crafts, and handmade gifts.',
  logoUrl: '',
  faviconUrl: '',
  primaryColor: '#F26B5B',
  secondaryColor: '#2BB5A5',
  accentColor: '#FFC857',
  authorName: 'Elena Rostova',
  authorBio: 'Lifelong DIY enthusiast, paper artist, and video creator helping craft lovers bring warm handmade beauty into their homes.',
  authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  youtubeUrl: 'https://youtube.com',
  tiktokUrl: 'https://tiktok.com',
  pinterestUrl: 'https://pinterest.com',
  twitterUrl: 'https://x.com',
  adsensePublisherId: 'ca-pub-9876543210987654',
  adsenseEnabled: true,
  adsTxt: 'google.com, pub-9876543210987654, DIRECT, f08c47fec0942fa0',
  googleAnalyticsId: 'G-CRAFTNEST99',
  googleSearchConsoleTag: '',
  footerText: '© 2026 CraftNest. All rights reserved. Handcrafted with love for makers worldwide.',
  contactEmail: 'hello@craftnest.com'
};

interface SettingsContextType {
  settings: SiteSettings;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  theme: 'light',
  toggleTheme: () => {},
  updateSettings: async () => {},
  isLoading: true
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize theme from localStorage or prefers-color-scheme
  useEffect(() => {
    const savedTheme = localStorage.getItem('craftnest_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Fetch settings from API
  useEffect(() => {
    api.getSettings()
      .then(data => {
        if (data) setSettings(data);
      })
      .catch(err => {
        console.warn('Could not load remote settings, using defaults', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Apply dynamic colors and tags to document head
  useEffect(() => {
    if (!settings) return;

    // Apply primary color CSS variable
    document.documentElement.style.setProperty('--site-primary', settings.primaryColor || '#F26B5B');
    document.documentElement.style.setProperty('--site-secondary', settings.secondaryColor || '#2BB5A5');
    document.documentElement.style.setProperty('--site-accent', settings.accentColor || '#FFC857');

    // Update document title fallback
    if (settings.siteName) {
      const currentTitle = document.title;
      if (!currentTitle || currentTitle.includes('CraftNest') || currentTitle.includes('Google AI Studio')) {
        document.title = `${settings.siteName} – ${settings.tagline}`;
      }
    }

    // Inject AdSense script automatically if configured and enabled
    if (settings.adsenseEnabled && settings.adsensePublisherId) {
      const existingScript = document.getElementById('craftnest-adsense-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'craftnest-adsense-script';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.adsensePublisherId}`;
        document.head.appendChild(script);
      }
    }

    // Google Search Console verification meta tag
    if (settings.googleSearchConsoleTag) {
      let meta = document.querySelector('meta[name="google-site-verification"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'google-site-verification');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', settings.googleSearchConsoleTag);
    }
  }, [settings]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('craftnest_theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const res = await api.updateSettings(newSettings);
    setSettings(res);
  };

  return (
    <SettingsContext.Provider value={{ settings, theme, toggleTheme, updateSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
