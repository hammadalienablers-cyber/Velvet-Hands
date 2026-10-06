import React, { useState, useEffect } from 'react';
import { Post, Comment } from '../types';
import { api } from '../api';
import { useSettings } from '../context/SettingsContext';
import { SEOHead } from '../components/SEOHead';
import { AdSenseBanner } from '../components/AdSenseBanner';
import { CraftCard } from '../components/CraftCard';
import { 
  Clock, 
  Calendar, 
  Eye, 
  CheckSquare, 
  Square, 
  Share2, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Sparkles, 
  Lightbulb, 
  Send, 
  Play,
  Heart,
  Copy
} from 'lucide-react';

interface ArticlePageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({ slug, onNavigate }) => {
  const { settings } = useSettings();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [checkedMaterials, setCheckedMaterials] = useState<Record<string, boolean>>({});
  const [readingProgress, setReadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // New Comment form
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentHoneypot, setCommentHoneypot] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setCheckedMaterials({});
    setCommentSuccess(false);

    api.getPostBySlug(slug, true)
      .then(async (fetchedPost) => {
        setPost(fetchedPost);

        // Fetch related posts in same category
        try {
          const related = await api.getPosts({ 
            category: fetchedPost.categoryName ? undefined : undefined, 
            limit: 4 
          });
          setRelatedPosts(related.posts.filter(p => p.id !== fetchedPost.id).slice(0, 3));
        } catch (e) {}

        // Fetch comments
        try {
          const comms = await api.getComments(fetchedPost.id, true);
          setComments(comms);
        } catch (e) {}
      })
      .catch(err => {
        console.error('Failed to load post', err);
      })
      .finally(() => {
        setIsLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }, [slug]);

  // Reading progress scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMaterial = (id: string) => {
    setCheckedMaterials(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = (platform: 'facebook' | 'pinterest' | 'whatsapp' | 'twitter' | 'copy') => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this craft tutorial: ${post?.title}`);

    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, '_blank');
    } else if (platform === 'pinterest') {
      const media = post?.featuredImage ? encodeURIComponent(post.featuredImage) : '';
      window.open(`https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${text}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !commentName.trim() || !commentContent.trim()) return;

    setIsSubmittingComment(true);
    try {
      const newComm = await api.addComment({
        postId: post.id,
        authorName: commentName,
        authorEmail: commentEmail,
        content: commentContent,
        honeypot: commentHoneypot
      });
      setComments(prev => [newComm, ...prev]);
      setCommentContent('');
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to submit comment', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="h-10 w-3/4 mx-auto bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse mb-6" />
        <div className="h-96 w-full bg-neutral-200 dark:bg-neutral-800 rounded-2xl animate-pulse mb-8" />
        <div className="h-32 w-full bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Craft Tutorial Not Found</h2>
        <p className="mt-2 text-sm text-neutral-500">The craft you are looking for may have been moved or unpublished.</p>
        <button
          onClick={() => onNavigate('/')}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-craft-primary px-5 py-2.5 text-sm font-bold text-white shadow-md hover:opacity-90"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const midStepIndex = Math.floor((post.steps?.length || 0) / 2);

  return (
    <article className="relative pb-20">
      <SEOHead
        title={post.seoTitle || post.title}
        description={post.seoDescription || post.excerpt}
        ogImage={post.ogImage || post.featuredImage}
        canonicalPath={`/post/${post.slug}`}
        post={post}
        settings={settings}
        type="article"
      />

      {/* Reading Progress Indicator */}
      <div className="fixed top-18 left-0 right-0 z-40 h-1 bg-transparent">
        <div
          id="reading-progress"
          className="h-full bg-craft-primary"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        {/* Breadcrumb & Category */}
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-4">
          <button onClick={() => onNavigate('/')} className="hover:text-craft-primary transition-colors">
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate(`/category/${post.categoryId}`)}
            className="hover:text-craft-primary transition-colors text-craft-primary font-bold"
          >
            {post.categoryName || 'Crafts'}
          </button>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight leading-[1.2]">
          {post.title}
        </h1>

        {/* Meta Bar */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 py-3.5 border-y border-neutral-200/80 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-3">
            <img
              src={settings.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={settings.authorName}
              className="h-10 w-10 rounded-full object-cover border-2 border-craft-primary/40"
            />
            <div>
              <span className="block font-bold text-neutral-800 dark:text-neutral-200 text-sm">
                {settings.authorName || 'Elena Rostova'}
              </span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formattedDate}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readingTimeMinutes} min read
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-medium bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-full text-[11px]">
              <Eye className="h-3.5 w-3.5 text-neutral-400" />
              {post.views} views
            </span>
            {post.difficulty && (
              <span className="font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-full text-[11px]">
                {post.difficulty}
              </span>
            )}
            {post.timeNeeded && (
              <span className="font-semibold bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 px-2.5 py-1 rounded-full text-[11px]">
                ⏱ {post.timeNeeded}
              </span>
            )}
          </div>
        </div>

        {/* Featured Image */}
        <div className="mt-8 overflow-hidden rounded-3xl craft-card-shadow border border-neutral-100 dark:border-neutral-800">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full aspect-16/9 sm:aspect-21/9 object-cover"
          />
        </div>

        {/* Introduction */}
        <div className="mt-8 text-lg sm:text-xl text-neutral-700 dark:text-neutral-200 leading-relaxed font-medium bg-amber-50/40 dark:bg-neutral-900/40 p-6 sm:p-8 rounded-2xl border-l-4 border-craft-primary">
          <p>{post.introduction || post.excerpt}</p>
        </div>

        {/* Optional Embedded Video */}
        {post.videoUrl && (
          <div className="mt-8 rounded-2xl overflow-hidden bg-black craft-card-shadow aspect-video">
            {post.videoUrl.includes('youtube.com') || post.videoUrl.includes('youtu.be') ? (
              <iframe
                src={post.videoUrl}
                title={post.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-white p-6 text-center">
                <a
                  href={post.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-craft-primary px-5 py-3 font-bold text-sm text-white shadow-lg hover:opacity-90"
                >
                  <Play className="h-4 w-4 fill-white" />
                  Watch Video Tutorial
                </a>
              </div>
            )}
          </div>
        )}

        {/* What You Will Need (Materials Checklist) */}
        {post.materials && post.materials.length > 0 && (
          <div className="mt-10 rounded-3xl bg-white dark:bg-[#201E24] p-6 sm:p-8 border border-neutral-200/90 dark:border-neutral-800 craft-card-shadow">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="rounded-xl bg-craft-primary/10 p-2 text-craft-primary">
                <CheckSquare className="h-5 w-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100">
                What You Will Need
              </h2>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
              Check off items as you gather supplies in your craft room:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {post.materials.map(item => {
                const isChecked = Boolean(checkedMaterials[item.id]);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleMaterial(item.id)}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl p-3.5 border transition-all ${
                      isChecked
                        ? 'bg-teal-50/70 dark:bg-teal-950/30 border-teal-300 dark:border-teal-800'
                        : 'bg-neutral-50/60 dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800 hover:border-craft-primary'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0 text-craft-primary">
                      {isChecked ? (
                        <CheckSquare className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      ) : (
                        <Square className="h-5 w-5 text-neutral-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm font-semibold ${isChecked ? 'line-through text-neutral-400 dark:text-neutral-500' : 'text-neutral-800 dark:text-neutral-200'}`}>
                        {item.name}
                      </span>
                      {item.amount && (
                        <span className="block text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          Amount: {item.amount}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AdSense Unit 1: In-Article Intro */}
        <AdSenseBanner placement="in-article-intro" slot="intro-ad-unit" />

        {/* ======================================================== */}
        {/* STEP-BY-STEP SECTION (Alternating Desktop Layout) */}
        {/* ======================================================== */}
        <div className="mt-14 space-y-16">
          <div className="text-center">
            <span className="text-xs font-black uppercase tracking-wider text-craft-primary">
              Step-by-Step Instructions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-50 mt-1">
              How to Create It
            </h2>
            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-craft-primary" />
          </div>

          {post.steps?.map((step, idx) => {
            const isReversed = idx % 2 === 1; // Alternating layout

            return (
              <React.Fragment key={step.id || idx}>
                <div
                  id={`step-${step.stepNumber}`}
                  className="rounded-3xl bg-white dark:bg-[#201E24] p-6 sm:p-8 border border-neutral-200/90 dark:border-neutral-800 craft-card-shadow"
                >
                  <div className={`flex flex-col lg:flex-row gap-8 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Step Visual Image */}
                    <div className="w-full lg:w-1/2 shrink-0">
                      <div className="relative overflow-hidden rounded-2xl craft-card-shadow bg-neutral-100 dark:bg-neutral-800">
                        <img
                          src={step.imageUrl || post.featuredImage}
                          alt={`Step ${step.stepNumber}: ${step.title}`}
                          loading="lazy"
                          className="w-full aspect-4/3 object-cover transition-transform duration-300 hover:scale-102"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-craft-primary px-3.5 py-1 text-xs font-black text-white shadow-md">
                            Step {step.stepNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Step Explanation Text */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-black text-craft-primary uppercase tracking-widest">
                          Phase #{step.stepNumber}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-neutral-50 leading-snug">
                        {step.title}
                      </h3>

                      <p className="mt-4 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Maker Tips callout box */}
                      {step.tips && (
                        <div className="mt-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 p-4 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
                          <div className="rounded-lg bg-amber-200 dark:bg-amber-800 p-1.5 text-amber-900 dark:text-amber-200 shrink-0">
                            <Lightbulb className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="font-bold text-xs text-amber-900 dark:text-amber-200 block">
                              Maker's Secret Tip
                            </span>
                            <p className="text-xs text-amber-800 dark:text-amber-300/90 mt-0.5 leading-relaxed">
                              {step.tips}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* AdSense Unit 2: Mid-Steps Banner */}
                {idx === midStepIndex && (
                  <AdSenseBanner placement="mid-steps" slot="mid-steps-unit" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Final Result / Final Look Section */}
        <div className="mt-16 rounded-3xl bg-linear-to-br from-amber-50/80 via-white to-rose-50/50 dark:from-[#24202B] dark:to-[#1C1A20] p-6 sm:p-10 border border-amber-200/80 dark:border-neutral-800 craft-card-shadow">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="rounded-xl bg-craft-primary p-2 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-50">
              The Final Result & Styling Tips
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl craft-card-shadow my-6">
            <img
              src={post.finalLookImage || post.featuredImage}
              alt={`${post.title} Final Look`}
              className="w-full aspect-16/9 object-cover"
            />
          </div>

          <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {post.closingTips || 'Congratulations! You have completed this craft. Don’t forget to display your creation with pride and share photos of your finished piece with our maker community.'}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-neutral-200/60 dark:border-neutral-800 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-neutral-500 uppercase mr-1">Tags:</span>
              {post.tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => onNavigate(`/search?q=${encodeURIComponent(tag)}`)}
                  className="rounded-full bg-white dark:bg-neutral-800 px-3.5 py-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:border-craft-primary hover:text-craft-primary transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Social Share Bar */}
        <div className="mt-10 rounded-2xl bg-white dark:bg-[#201E24] p-5 border border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 craft-card-shadow">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-craft-primary" />
            <span className="font-bold text-sm text-neutral-800 dark:text-neutral-200">
              Share this DIY tutorial with friends:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleShare('pinterest')}
              className="rounded-xl bg-[#E60023] px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:opacity-90"
              title="Pin on Pinterest"
            >
              Pinterest
            </button>
            <button
              onClick={() => handleShare('whatsapp')}
              className="rounded-xl bg-[#25D366] px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:opacity-90"
              title="Share on WhatsApp"
            >
              WhatsApp
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="rounded-xl bg-[#1877F2] px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:opacity-90"
              title="Share on Facebook"
            >
              Facebook
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:opacity-90"
              title="Share on X"
            >
              X
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="flex items-center gap-1 rounded-xl border border-neutral-300 dark:border-neutral-700 px-3.5 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-teal-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedLink ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* AdSense Unit 3: Pre-Related Crafts */}
        <AdSenseBanner placement="pre-related" slot="pre-related-unit" />

        {/* Related Crafts Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-14">
            <h3 className="text-2xl font-black text-neutral-900 dark:text-neutral-50 mb-6">
              You Might Also Love These Crafts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map(rel => (
                <CraftCard
                  key={rel.id}
                  post={rel}
                  onClick={() => onNavigate(`/post/${rel.slug}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-16 rounded-3xl bg-white dark:bg-[#201E24] p-6 sm:p-10 border border-neutral-200/80 dark:border-neutral-800 craft-card-shadow">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="rounded-xl bg-teal-100 dark:bg-teal-950/60 p-2 text-craft-secondary">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-neutral-900 dark:text-neutral-50">
                Maker Community Comments ({comments.length})
              </h3>
              <p className="text-xs text-neutral-500">
                Have a question or made this project? Leave your feedback below!
              </p>
            </div>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="space-y-4 mb-10">
            {/* Honeypot for spam bots */}
            <input
              type="text"
              name="honeypot"
              value={commentHoneypot}
              onChange={e => setCommentHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={commentName}
                  onChange={e => setCommentName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-craft-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Email (optional, kept private)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={commentEmail}
                  onChange={e => setCommentEmail(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-craft-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Your Comment or Question *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Share your tips, questions, or how your version turned out..."
                value={commentContent}
                onChange={e => setCommentContent(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-craft-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-400">
                Spam-free & moderated craft community.
              </span>
              <button
                type="submit"
                disabled={isSubmittingComment}
                className="flex items-center gap-2 rounded-xl bg-craft-primary px-5 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                {isSubmittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </div>

            {commentSuccess && (
              <div className="rounded-xl bg-teal-50 dark:bg-teal-950/40 p-3 text-xs text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800">
                Thank you! Your comment has been posted to this tutorial.
              </div>
            )}
          </form>

          {/* Comment List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-center text-xs text-neutral-400 py-4">
                Be the first maker to leave a comment on this project!
              </p>
            ) : (
              comments.map(c => (
                <div
                  key={c.id}
                  className="rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 p-4 border border-neutral-100 dark:border-neutral-800"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-neutral-900 dark:text-neutral-100">
                      {c.authorName}
                    </span>
                    <span className="text-neutral-400 text-[11px]">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {c.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
