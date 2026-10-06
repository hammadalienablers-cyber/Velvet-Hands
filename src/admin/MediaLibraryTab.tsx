import React, { useState, useEffect } from 'react';
import { MediaItem } from '../types';
import { api } from '../api';
import { Upload, Trash2, Copy, Check, Image as ImageIcon, Loader2 } from 'lucide-react';

export const MediaLibraryTab: React.FC = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const res = await api.getMedia();
      setMedia(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        await api.uploadFile(files[i]);
      }
      fetchMedia();
    } catch (err) {
      alert('Upload failed. Maximum file size is 10MB.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = (item: MediaItem) => {
    const fullUrl = item.url.startsWith('http') ? item.url : window.location.origin + item.url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (item: MediaItem) => {
    if (!window.confirm(`Delete image "${item.filename}"?`)) return;
    try {
      await api.deleteMedia(item.id);
      setMedia(media.filter(m => m.id !== item.id));
    } catch (e) {
      alert('Failed to delete media file');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-50">
            Media Library
          </h2>
          <p className="text-xs text-neutral-500">
            Upload and manage craft photos, materials diagrams, and step visuals.
          </p>
        </div>

        <label className="cursor-pointer flex items-center gap-2 rounded-xl bg-craft-primary px-5 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90">
          <Upload className="h-4 w-4" />
          {isUploading ? 'Uploading...' : 'Upload Media Files'}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-neutral-500">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-craft-primary mb-2" />
          Loading gallery...
        </div>
      ) : media.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 p-12 text-center">
          <ImageIcon className="mx-auto h-10 w-10 text-neutral-300 dark:text-neutral-700 mb-2" />
          <p className="text-neutral-500 text-xs font-medium">No uploaded images in your library yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map(item => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-[#201E24] border border-neutral-200 dark:border-neutral-800 craft-card-shadow flex flex-col justify-between"
            >
              <div className="aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <img
                  src={item.url}
                  alt={item.filename}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="p-2.5">
                <span className="block truncate text-[11px] font-bold text-neutral-800 dark:text-neutral-200">
                  {item.filename}
                </span>
                <span className="block text-[10px] text-neutral-400">
                  {item.size ? `${(item.size / 1024).toFixed(0)} KB` : 'External'}
                </span>

                <div className="mt-2 flex items-center justify-between pt-1 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    onClick={() => handleCopyUrl(item)}
                    className="flex items-center gap-1 text-[10px] font-bold text-craft-primary hover:underline"
                  >
                    {copiedId === item.id ? <Check className="h-3 w-3 text-teal-600" /> : <Copy className="h-3 w-3" />}
                    {copiedId === item.id ? 'Copied' : 'Copy URL'}
                  </button>

                  <button
                    onClick={() => handleDelete(item)}
                    className="p-1 text-neutral-400 hover:text-red-500"
                    title="Delete image"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
