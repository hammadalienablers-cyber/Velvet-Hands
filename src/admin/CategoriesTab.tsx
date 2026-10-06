import React, { useState, useEffect } from 'react';
import { Category } from '../types';
import { api } from '../api';
import { Plus, Edit, Trash2, Layers, AlertCircle, CheckCircle, Upload } from 'lucide-react';

export const CategoriesTab: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCat, setCurrentCat] = useState<Partial<Category> | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [reassignModal, setReassignModal] = useState<{ catToDelete: Category; targetId: string } | null>(null);

  const fetchCats = async () => {
    setIsLoading(true);
    try {
      const res = await api.getCategories();
      setCategories(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleOpenNew = () => {
    setCurrentCat({
      name: '',
      slug: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      iconName: 'Scissors',
      order: categories.length + 1
    });
    setIsEditing(true);
    setErrorMsg('');
  };

  const handleOpenEdit = (cat: Category) => {
    setCurrentCat({ ...cat });
    setIsEditing(true);
    setErrorMsg('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCat?.name) return;

    try {
      if (currentCat.id) {
        await api.updateCategory(currentCat.id, currentCat);
      } else {
        await api.createCategory(currentCat);
      }
      setIsEditing(false);
      setCurrentCat(null);
      fetchCats();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save category');
    }
  };

  const handleDelete = async (cat: Category) => {
    if ((cat.postCount || 0) > 0) {
      // Must reassign
      const otherCats = categories.filter(c => c.id !== cat.id);
      if (otherCats.length === 0) {
        alert('Cannot delete the only category while it has posts.');
        return;
      }
      setReassignModal({ catToDelete: cat, targetId: otherCats[0].id });
      return;
    }

    if (window.confirm(`Delete category "${cat.name}"?`)) {
      try {
        await api.deleteCategory(cat.id);
        fetchCats();
      } catch (err: any) {
        alert(err.message || 'Failed to delete');
      }
    }
  };

  const handleConfirmReassignDelete = async () => {
    if (!reassignModal) return;
    try {
      await api.deleteCategory(reassignModal.catToDelete.id, reassignModal.targetId);
      setReassignModal(null);
      fetchCats();
    } catch (err: any) {
      alert(err.message || 'Failed to reassign and delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-50">
            Craft Categories
          </h2>
          <p className="text-xs text-neutral-500">
            Organize crafts by medium, occasion, and material type.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 rounded-xl bg-craft-primary px-4 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="rounded-2xl bg-white dark:bg-[#201E24] p-5 border border-neutral-200 dark:border-neutral-800 craft-card-shadow flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-16/9 rounded-xl overflow-hidden mb-3 bg-neutral-100">
                <img src={cat.imageUrl} alt={cat.name} className="h-full w-full object-cover" />
                <div className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
                  {cat.postCount || 0} posts
                </div>
              </div>

              <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                {cat.name}
              </h3>
              <span className="text-[10px] text-neutral-400 font-mono">
                /category/{cat.slug}
              </span>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(cat)}
                className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:underline"
              >
                <Edit className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(cat)}
                className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline ml-2"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {isEditing && currentCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#201E24] p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              {currentCat.id ? 'Edit Category' : 'Create New Category'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paper Crafts, Wall Art"
                  value={currentCat.name || ''}
                  onChange={e => setCurrentCat({ 
                    ...currentCat, 
                    name: e.target.value,
                    slug: currentCat.id ? currentCat.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                  })}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Slug (/category/[slug])
                </label>
                <input
                  type="text"
                  required
                  value={currentCat.slug || ''}
                  onChange={e => setCurrentCat({ ...currentCat, slug: e.target.value })}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description for the archive header..."
                  value={currentCat.description || ''}
                  onChange={e => setCurrentCat({ ...currentCat, description: e.target.value })}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={currentCat.imageUrl || ''}
                  onChange={e => setCurrentCat({ ...currentCat, imageUrl: e.target.value })}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs"
                />
              </div>

              {errorMsg && (
                <div className="text-xs text-red-500 font-semibold">{errorMsg}</div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-xs font-bold text-neutral-600 dark:text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-craft-primary px-5 py-2 text-xs font-bold text-white shadow-md hover:opacity-90"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reassign Posts Warning Modal */}
      {reassignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#201E24] p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-amber-600 mb-3">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                Reassign Crafts Before Deleting
              </h3>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
              Category <strong>"{reassignModal.catToDelete.name}"</strong> has {reassignModal.catToDelete.postCount} published craft tutorials. Please choose a new category to transfer these posts into:
            </p>

            <select
              value={reassignModal.targetId}
              onChange={e => setReassignModal({ ...reassignModal, targetId: e.target.value })}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs mb-5 font-semibold"
            >
              {categories.filter(c => c.id !== reassignModal.catToDelete.id).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReassignModal(null)}
                className="rounded-xl border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReassignDelete}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-md"
              >
                Reassign & Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
