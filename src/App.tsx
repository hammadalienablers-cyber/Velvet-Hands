import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';

// Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CookieConsent } from './components/CookieConsent';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ArticlePage } from './pages/ArticlePage';
import { CategoryPage } from './pages/CategoryPage';
import { SearchPage } from './pages/SearchPage';
import { StaticPage } from './pages/StaticPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLayout } from './admin/AdminLayout';
import { AdminLogin } from './admin/AdminLogin';

function MainRouter() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);
  const [searchQuery, setSearchQuery] = useState<string>(() => window.location.search);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Listen to popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSearchQuery(window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    const [pathPart, queryPart] = path.split('?');
    setCurrentPath(pathPart || '/');
    setSearchQuery(queryPart ? `?${queryPart}` : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if current view is Admin
  const isAdminRoute = currentPath.startsWith('/admin');

  if (isAdminRoute) {
    if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0] dark:bg-[#151417]">
          <div className="h-8 w-8 rounded-full border-2 border-craft-primary border-t-transparent animate-spin" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return <AdminLogin onBackToSite={() => navigate('/')} />;
    }

    return (
      <AdminLayout
        onNavigateHome={() => navigate('/')}
        onViewPost={(slug) => navigate(`/post/${slug}`)}
        onPreviewPage={(slug) => navigate(`/${slug}`)}
      />
    );
  }

  // Parse public routes
  let pageContent: React.ReactNode;

  if (currentPath === '/' || currentPath === '') {
    pageContent = <HomePage onNavigate={navigate} />;
  } else if (currentPath.startsWith('/post/')) {
    const slug = currentPath.replace('/post/', '');
    pageContent = <ArticlePage slug={slug} onNavigate={navigate} />;
  } else if (currentPath.startsWith('/category/')) {
    const slug = currentPath.replace('/category/', '');
    pageContent = <CategoryPage slug={slug} onNavigate={navigate} />;
  } else if (currentPath === '/search') {
    const params = new URLSearchParams(searchQuery);
    const q = params.get('q') || '';
    pageContent = <SearchPage initialQuery={q} onNavigate={navigate} />;
  } else if (currentPath === '/about') {
    pageContent = <StaticPage slug="about" onNavigate={navigate} />;
  } else if (currentPath === '/privacy') {
    pageContent = <StaticPage slug="privacy" onNavigate={navigate} />;
  } else if (currentPath === '/terms') {
    pageContent = <StaticPage slug="terms" onNavigate={navigate} />;
  } else if (currentPath === '/disclaimer') {
    pageContent = <StaticPage slug="disclaimer" onNavigate={navigate} />;
  } else if (currentPath === '/contact') {
    pageContent = <ContactPage onNavigate={navigate} />;
  } else {
    pageContent = <NotFoundPage onNavigate={navigate} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F0] dark:bg-[#1A191D] text-[#2D2A32] dark:text-[#F3F1ED] transition-colors">
      <Header currentPath={currentPath} onNavigate={navigate} />
      <main className="flex-1">{pageContent}</main>
      <Footer onNavigate={navigate} />
      <CookieConsent onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <MainRouter />
      </SettingsProvider>
    </AuthProvider>
  );
}
