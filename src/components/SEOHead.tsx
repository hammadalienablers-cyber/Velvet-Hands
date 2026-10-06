import React, { useEffect } from 'react';
import { Post, SiteSettings } from '../types';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  post?: Post;
  settings: SiteSettings;
  type?: 'website' | 'article';
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath = '',
  ogImage,
  post,
  settings,
  type = 'website'
}) => {
  useEffect(() => {
    const fullTitle = title 
      ? `${title} | ${settings.siteName}` 
      : `${settings.siteName} – ${settings.tagline}`;
    const metaDesc = description || post?.seoDescription || post?.excerpt || settings.description;
    const metaImage = ogImage || post?.ogImage || post?.featuredImage || settings.logoUrl || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80';
    const currentUrl = window.location.origin + (canonicalPath || window.location.pathname);

    // Update Title
    document.title = fullTitle;

    // Helper to update or create meta tag
    const setMeta = (nameAttr: string, nameVal: string, content: string) => {
      let tag = document.querySelector(`meta[${nameAttr}="${nameVal}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(nameAttr, nameVal);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMeta('name', 'description', metaDesc);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', metaDesc);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', currentUrl);
    setMeta('property', 'og:image', metaImage);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', metaDesc);
    setMeta('name', 'twitter:image', metaImage);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // ---------------------------------------------------------
    // Structured Data (JSON-LD)
    // ---------------------------------------------------------
    const existingLd = document.getElementById('craftnest-jsonld');
    if (existingLd) {
      existingLd.remove();
    }

    const jsonLdScripts: any[] = [];

    // WebSite schema
    jsonLdScripts.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': settings.siteName,
      'url': window.location.origin,
      'description': settings.description,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${window.location.origin}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    });

    // If Post, inject Article and HowTo schema!
    if (post) {
      // 1. Article Schema
      jsonLdScripts.push({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': post.seoTitle || post.title,
        'description': post.seoDescription || post.excerpt,
        'image': [post.featuredImage],
        'datePublished': post.publishedAt,
        'dateModified': post.updatedAt,
        'author': {
          '@type': 'Person',
          'name': settings.authorName || 'Elena Rostova',
          'url': `${window.location.origin}/about`
        },
        'publisher': {
          '@type': 'Organization',
          'name': settings.siteName,
          'logo': {
            '@type': 'ImageObject',
            'url': settings.logoUrl || `${window.location.origin}/favicon.ico`
          }
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': currentUrl
        }
      });

      // 2. Google Rich Results HowTo Schema
      if (post.steps && post.steps.length > 0) {
        jsonLdScripts.push({
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          'name': post.title,
          'description': post.excerpt,
          'image': post.featuredImage,
          'totalTime': post.timeNeeded ? `PT${parseInt(post.timeNeeded) || 30}M` : 'PT30M',
          'supply': (post.materials || []).map(m => ({
            '@type': 'HowToSupply',
            'name': m.amount ? `${m.name} (${m.amount})` : m.name
          })),
          'step': post.steps.map(s => ({
            '@type': 'HowToStep',
            'name': s.title,
            'url': `${currentUrl}#step-${s.stepNumber}`,
            'text': s.description,
            'image': s.imageUrl || post.featuredImage
          }))
        });
      }

      // 3. BreadcrumbList Schema
      jsonLdScripts.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': window.location.origin
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': post.categoryName || 'Crafts',
            'item': `${window.location.origin}/category/${post.categoryId}`
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': post.title,
            'item': currentUrl
          }
        ]
      });
    }

    const script = document.createElement('script');
    script.id = 'craftnest-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLdScripts);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('craftnest-jsonld');
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [title, description, canonicalPath, ogImage, post, settings, type]);

  return null;
};
