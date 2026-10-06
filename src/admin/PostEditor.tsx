import React, { useState, useEffect } from 'react';
import { Post, Category, CraftStep, MaterialItem } from '../types';
import { api } from '../api';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Image as ImageIcon, 
  Upload, 
  Sparkles, 
  Layers, 
  CheckCircle,
  HelpCircle,
  Video,
  ListOrdered,
  FileCheck
} from 'lucide-react';

interface PostEditorProps {
  postToEdit?: Post | null;
  onBack: () => void;
  onSaved: (savedPost: Post) => void;
  onPreview: (slug: string) => void;
}

export const PostEditor: React.FC<PostEditorProps> = ({ postToEdit, onBack, onSaved, onPreview }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'steps' | 'materials' | 'seo'>('content');
  const [uploadLoading, setUploadLoading] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState(postToEdit?.title || '');
  const [slug, setSlug] = useState(postToEdit?.slug || '');
  const [categoryId, setCategoryId] = useState(postToEdit?.categoryId || '');
  const [tagsInput, setTagsInput] = useState((postToEdit?.tags || []).join(', '));
  const [featuredImage, setFeaturedImage] = useState(postToEdit?.featuredImage || '');
  const [excerpt, setExcerpt] = useState(postToEdit?.excerpt || '');
  const [introduction, setIntroduction] = useState(postToEdit?.introduction || '');
  const [videoUrl, setVideoUrl] = useState(postToEdit?.videoUrl || '');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Advanced'>(postToEdit?.difficulty || 'Easy');
  const [timeNeeded, setTimeNeeded] = useState(postToEdit?.timeNeeded || '30 mins');
  
  // Materials Builder
  const [materials, setMaterials] = useState<MaterialItem[]>(postToEdit?.materials || [
    { id: 'm-1', name: 'Crepe paper or craft cardstock', amount: '2 sheets' },
    { id: 'm-2', name: 'Craft scissors & paper glue', amount: '1 set' }
  ]);

  // Steps Builder
  const [steps, setSteps] = useState<CraftStep[]>(postToEdit?.steps || [
    {
      id: 'step-1',
      stepNumber: 1,
      title: 'Prepare and Cut Your Base Materials',
      description: 'Carefully measure and cut your materials according to your desired dimensions. Keep your snips smooth along the contours.',
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
      tips: 'Use sharp detail craft scissors to prevent paper tearing.'
    },
    {
      id: 'step-2',
      stepNumber: 2,
      title: 'Shape the Elements and Assemble the Core',
      description: 'Gently curve or curl the edges to give your craft piece natural dimensional volume before affixing the adhesive.',
      imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=80',
      tips: 'Work in a warm, dry room for best glue tacking.'
    }
  ]);

  // Final look & Closing
  const [finalLookImage, setFinalLookImage] = useState(postToEdit?.finalLookImage || '');
  const [closingTips, setClosingTips] = useState(postToEdit?.closingTips || '');

  // SEO & Status
  const [seoTitle, setSeoTitle] = useState(postToEdit?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(postToEdit?.seoDescription || '');
  const [focusKeyword, setFocusKeyword] = useState(postToEdit?.focusKeyword || '');
  const [status, setStatus] = useState<'published' | 'draft'>(postToEdit?.status || 'published');
  const [isFeatured, setIsFeatured] = useState(Boolean(postToEdit?.isFeatured));

  useEffect(() => {
    api.getCategories().then(cats => {
      setCategories(cats);
      if (!categoryId && cats.length > 0) {
        setCategoryId(cats[0].id);
      }
    });
  }, []);

  // Auto-generate slug when title changes (if slug was empty or matches old title)
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!postToEdit) {
      const generated = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setSlug(generated);
      if (!seoTitle) setSeoTitle(newTitle);
    }
  };

  // Upload handler helper
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'featured' | 'final' | { stepIndex: number }) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const targetKey = typeof target === 'string' ? target : `step-${target.stepIndex}`;
    setUploadLoading(targetKey);

    try {
      const mediaItem = await api.uploadFile(file);
      if (target === 'featured') {
        setFeaturedImage(mediaItem.url);
      } else if (target === 'final') {
        setFinalLookImage(mediaItem.url);
      } else if (typeof target === 'object') {
        const nextSteps = [...steps];
        nextSteps[target.stepIndex].imageUrl = mediaItem.url;
        setSteps(nextSteps);
      }
    } catch (err) {
      alert('Image upload failed. Please try again.');
    } finally {
      setUploadLoading(null);
    }
  };

  // Materials management
  const addMaterial = () => {
    setMaterials([...materials, { id: `m-${Date.now()}`, name: '', amount: '' }]);
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, idx) => idx !== index));
  };

  const updateMaterial = (index: number, field: 'name' | 'amount', value: string) => {
    const next = [...materials];
    next[index][field] = value;
    setMaterials(next);
  };

  // Steps management
  const addStep = () => {
    const nextNum = steps.length + 1;
    setSteps([
      ...steps,
      {
        id: `step-${Date.now()}`,
        stepNumber: nextNum,
        title: `Step ${nextNum}: New Instruction`,
        description: '',
        imageUrl: featuredImage || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
        tips: ''
      }
    ]);
  };

  const removeStep = (index: number) => {
    if (steps.length <= 1) {
      alert('A craft tutorial must have at least one step.');
      return;
    }
    const filtered = steps.filter((_, idx) => idx !== index);
    // Renumber steps
    const renumbered = filtered.map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setSteps(renumbered);
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === steps.length - 1) return;

    const next = [...steps];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;

    // Renumber
    const renumbered = next.map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setSteps(renumbered);
  };

  const updateStep = (index: number, field: keyof CraftStep, value: any) => {
    const next = [...steps];
    next[index] = { ...next[index], [field]: value };
    setSteps(next);
  };

  // Save handler
  const handleSave = async (forceStatus?: 'published' | 'draft') => {
    if (!title.trim()) {
      alert('Please enter a craft title.');
      return;
    }

    setIsSubmitting(true);
    const effectiveStatus = forceStatus || status;

    const payload: Partial<Post> = {
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      categoryId: categoryId || categories[0]?.id,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      featuredImage: featuredImage || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      excerpt: excerpt.trim() || title,
      introduction: introduction.trim(),
      materials: materials.filter(m => m.name.trim()),
      videoUrl: videoUrl.trim(),
      difficulty,
      timeNeeded,
      steps,
      finalLookImage: finalLookImage || featuredImage,
      closingTips,
      seoTitle: seoTitle.trim() || title,
      seoDescription: seoDescription.trim() || excerpt,
      focusKeyword: focusKeyword.trim(),
      status: effectiveStatus,
      isFeatured
    };

    try {
      let saved: Post;
      if (postToEdit?.id) {
        saved = await api.updatePost(postToEdit.id, payload);
      } else {
        saved = await api.createPost(payload);
      }
      onSaved(saved);
    } catch (err: any) {
      alert(err.message || 'Failed to save post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-craft-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Posts List
        </button>

        <div className="flex items-center gap-2">
          {slug && (
            <button
              onClick={() => onPreview(slug)}
              className="flex items-center gap-1 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700"
            >
              <Eye className="h-3.5 w-3.5" />
              Preview Article
            </button>
          )}

          <button
            onClick={() => handleSave('draft')}
            disabled={isSubmitting}
            className="flex items-center gap-1 rounded-xl border border-amber-300 dark:border-neutral-700 bg-amber-50 dark:bg-neutral-800 px-3.5 py-2 text-xs font-bold text-amber-800 dark:text-amber-200 hover:bg-amber-100"
          >
            Save Draft
          </button>

          <button
            onClick={() => handleSave('published')}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 rounded-xl bg-craft-primary px-5 py-2 text-xs font-bold text-white shadow-md hover:opacity-90"
          >
            <Save className="h-3.5 w-3.5" />
            {isSubmitting ? 'Saving...' : 'Publish Article'}
          </button>
        </div>
      </div>

      {/* Editor Sub-nav Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'content'
              ? 'bg-craft-primary text-white shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <FileCheck className="h-3.5 w-3.5" />
          Main Content & Info
        </button>
        <button
          onClick={() => setActiveTab('steps')}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'steps'
              ? 'bg-craft-primary text-white shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <ListOrdered className="h-3.5 w-3.5" />
          Step-by-Step Builder ({steps.length})
        </button>
        <button
          onClick={() => setActiveTab('materials')}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'materials'
              ? 'bg-craft-primary text-white shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          Materials Checklist ({materials.length})
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'seo'
              ? 'bg-craft-primary text-white shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          SEO & Meta
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: MAIN CONTENT */}
      {/* ======================================================== */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white dark:bg-[#201E24] p-6 border border-neutral-200 dark:border-neutral-800 space-y-4 craft-card-shadow">
            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                Craft Tutorial Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. How to Make 3D Crepe Paper Peonies: A Step-by-Step Guide"
                value={title}
                onChange={e => handleTitleChange(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-2.5 text-base font-bold text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-craft-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                  URL Slug (/post/[slug])
                </label>
                <input
                  type="text"
                  placeholder="how-to-make-crepe-paper-peonies"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-2.5 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-craft-primary font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-craft-primary"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                Featured Cover Image (Hero Image)
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or upload image"
                  value={featuredImage}
                  onChange={e => setFeaturedImage(e.target.value)}
                  className="flex-1 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-2 text-xs text-neutral-900 dark:text-neutral-100"
                />
                <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 px-4 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200">
                  <Upload className="h-3.5 w-3.5" />
                  {uploadLoading === 'featured' ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageUpload(e, 'featured')}
                    className="hidden"
                  />
                </label>
              </div>

              {featuredImage && (
                <div className="mt-3 aspect-21/9 max-w-sm rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                  <img src={featuredImage} alt="Featured preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                Short Excerpt (Card Summary & Social Snippet)
              </label>
              <textarea
                rows={2}
                placeholder="A compelling 1-2 sentence preview shown on card grids and search results..."
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-2.5 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-craft-primary"
              />
            </div>

            {/* Introduction paragraph */}
            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                Tutorial Introduction Paragraph
              </label>
              <textarea
                rows={4}
                placeholder="Warmly welcome readers to this project. Explain why this craft is special, its inspiration, and how beginner-friendly it is..."
                value={introduction}
                onChange={e => setIntroduction(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-craft-primary"
              />
            </div>

            {/* Embedded video URL */}
            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5 flex items-center gap-1">
                <Video className="h-3.5 w-3.5 text-craft-primary" />
                Optional Video Link (YouTube Embed or Social Clip)
              </label>
              <input
                type="text"
                placeholder="https://www.youtube.com/embed/... or https://..."
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-2 text-xs text-neutral-900 dark:text-neutral-100"
              />
            </div>

            {/* Tags & Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Paper Flowers, Crepe Paper, DIY"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-2 text-xs text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as any)}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-2 text-xs font-semibold"
                >
                  <option value="Easy">Easy (Beginner)</option>
                  <option value="Medium">Medium (Intermediate)</option>
                  <option value="Advanced">Advanced (Expert)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                  Time Needed
                </label>
                <input
                  type="text"
                  placeholder="30 mins, 1 hour..."
                  value={timeNeeded}
                  onChange={e => setTimeNeeded(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-2 text-xs text-neutral-900 dark:text-neutral-100"
                />
              </div>
            </div>

            {/* Featured and Status Toggles */}
            <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-800 dark:text-neutral-200">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={e => setIsFeatured(e.target.checked)}
                  className="rounded text-craft-primary focus:ring-craft-primary"
                />
                Mark as Featured Post (Hero highlight)
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-800 dark:text-neutral-200">
                <input
                  type="checkbox"
                  checked={status === 'published'}
                  onChange={e => setStatus(e.target.checked ? 'published' : 'draft')}
                  className="rounded text-teal-600 focus:ring-teal-600"
                />
                Published (publicly visible)
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: STEP-BY-STEP BUILDER (1 to 10 Dynamic Steps) */}
      {/* ======================================================== */}
      {activeTab === 'steps' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-neutral-900 dark:text-neutral-100">
                Step-by-Step Craft Instructions ({steps.length} Steps)
              </h3>
              <p className="text-xs text-neutral-500">
                Each step features a prominent photo badge, headline, and written guidance.
              </p>
            </div>
            <button
              onClick={addStep}
              className="flex items-center gap-1.5 rounded-xl bg-craft-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add Another Step
            </button>
          </div>

          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div
                key={step.id || idx}
                className="rounded-2xl bg-white dark:bg-[#201E24] p-5 border border-neutral-200 dark:border-neutral-800 craft-card-shadow space-y-4"
              >
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-craft-primary text-xs font-black text-white">
                      {step.stepNumber}
                    </span>
                    <span className="font-bold text-sm text-neutral-800 dark:text-neutral-200">
                      Step #{step.stepNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveStep(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 disabled:opacity-30"
                      title="Move up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveStep(idx, 'down')}
                      disabled={idx === steps.length - 1}
                      className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 disabled:opacity-30"
                      title="Move down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeStep(idx)}
                      className="p-1 rounded-lg text-neutral-400 hover:text-red-500 ml-2"
                      title="Delete step"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Step Title & Description */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        Step Title *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Cut the Petals in Graded Sizes"
                        value={step.title}
                        onChange={e => updateStep(idx, 'title', e.target.value)}
                        className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs font-bold text-neutral-900 dark:text-neutral-100"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        Step Explanation / Written Instructions *
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Detailed instructions for this specific step..."
                        value={step.description}
                        onChange={e => updateStep(idx, 'description', e.target.value)}
                        className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs text-neutral-900 dark:text-neutral-100"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        Maker's Tip (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Stack 4-5 layers of crepe paper to cut simultaneously..."
                        value={step.tips || ''}
                        onChange={e => updateStep(idx, 'tips', e.target.value)}
                        className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs text-neutral-900 dark:text-neutral-100"
                      />
                    </div>
                  </div>

                  {/* Step Image */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Step Image (Visual Photo)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Image URL or upload"
                        value={step.imageUrl}
                        onChange={e => updateStep(idx, 'imageUrl', e.target.value)}
                        className="flex-1 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3 py-1.5 text-xs text-neutral-900 dark:text-neutral-100"
                      />
                      <label className="cursor-pointer shrink-0 inline-flex items-center gap-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200">
                        <Upload className="h-3 w-3" />
                        {uploadLoading === `step-${idx}` ? '...' : 'Upload'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleImageUpload(e, { stepIndex: idx })}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="aspect-4/3 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                      <img
                        src={step.imageUrl || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80'}
                        alt={step.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={addStep}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-dashed border-craft-primary/50 px-6 py-3 text-xs font-bold text-craft-primary hover:bg-craft-primary/5"
            >
              <Plus className="h-4 w-4" />
              Add Step #{steps.length + 1}
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: MATERIALS LIST BUILDER */}
      {/* ======================================================== */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white dark:bg-[#201E24] p-6 border border-neutral-200 dark:border-neutral-800 craft-card-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-base text-neutral-900 dark:text-neutral-100">
                  What You Will Need (Materials & Supplies)
                </h3>
                <p className="text-xs text-neutral-500">
                  These items appear as an interactive checklist on the article page.
                </p>
              </div>
              <button
                onClick={addMaterial}
                className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:opacity-90"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Item
              </button>
            </div>

            <div className="space-y-2.5">
              {materials.map((mat, idx) => (
                <div key={mat.id || idx} className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Material name (e.g. 180g Italian Crepe Paper, Hot glue gun)"
                    value={mat.name}
                    onChange={e => updateMaterial(idx, 'name', e.target.value)}
                    className="flex-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs text-neutral-900 dark:text-neutral-100"
                  />
                  <input
                    type="text"
                    placeholder="Amount / Qty (e.g. 2 rolls, 1 piece)"
                    value={mat.amount || ''}
                    onChange={e => updateMaterial(idx, 'amount', e.target.value)}
                    className="flex-1 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs text-neutral-900 dark:text-neutral-100"
                  />
                  <button
                    onClick={() => removeMaterial(idx)}
                    className="p-2 text-neutral-400 hover:text-red-500 rounded-lg"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
              <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200 mb-2">
                Final Result & Closing Section
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">
                    Final Result / Staging Image
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Image URL or upload"
                      value={finalLookImage}
                      onChange={e => setFinalLookImage(e.target.value)}
                      className="flex-1 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3 py-1.5 text-xs"
                    />
                    <label className="cursor-pointer shrink-0 inline-flex items-center gap-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      <Upload className="h-3 w-3" />
                      {uploadLoading === 'final' ? '...' : 'Upload'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageUpload(e, 'final')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">
                    Closing Advice & Display Tips
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide recommendations for preserving, displaying, or styling this craft in the home..."
                    value={closingTips}
                    onChange={e => setClosingTips(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: SEO & SEARCH CONSOLE OPTIMIZATION */}
      {/* ======================================================== */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white dark:bg-[#201E24] p-6 border border-neutral-200 dark:border-neutral-800 space-y-4 craft-card-shadow">
            <div>
              <h3 className="font-extrabold text-base text-neutral-900 dark:text-neutral-100">
                SEO & Google Search Snippet Preview
              </h3>
              <p className="text-xs text-neutral-500">
                Optimize title tags and meta descriptions to rank high on Google and Pinterest search.
              </p>
            </div>

            {/* Google SERP Card Preview */}
            <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 p-4 border border-neutral-200 dark:border-neutral-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Google Search Snippet Preview:
              </span>
              <div className="text-blue-700 dark:text-blue-400 text-base font-semibold truncate hover:underline cursor-pointer">
                {seoTitle || title || 'DIY Craft Tutorial | CraftNest'}
              </div>
              <div className="text-emerald-700 dark:text-emerald-400 text-xs truncate">
                https://craftnest.com/post/{slug || 'craft-tutorial'}
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                {seoDescription || excerpt || 'Discover how to make this DIY craft with step-by-step instructions, supply checklist, and high-resolution photos.'}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                Focus Keyword
              </label>
              <input
                type="text"
                placeholder="e.g. crepe paper peonies, macrame feather wall"
                value={focusKeyword}
                onChange={e => setFocusKeyword(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-2 text-xs text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                SEO Meta Title (Title Tag)
              </label>
              <input
                type="text"
                placeholder="Leave blank to use main post title"
                value={seoTitle}
                onChange={e => setSeoTitle(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-2 text-xs text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                Meta Description (Search Snippet)
              </label>
              <textarea
                rows={3}
                placeholder="Recommended 120-160 characters describing the craft tutorial..."
                value={seoDescription}
                onChange={e => setSeoDescription(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-2 text-xs text-neutral-900 dark:text-neutral-100"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
