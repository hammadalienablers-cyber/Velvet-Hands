import React, { useState, useEffect } from 'react';
import { Comment } from '../types';
import { api } from '../api';
import { MessageSquare, Check, X, Trash2, Eye, ExternalLink } from 'lucide-react';

export const CommentsTab: React.FC<{ onViewPost: (slug: string) => void }> = ({ onViewPost }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const res = await api.getComments(undefined, false);
      setComments(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleToggleApprove = async (c: Comment) => {
    try {
      const updated = await api.toggleApproveComment(c.id);
      setComments(comments.map(item => item.id === c.id ? updated : item));
    } catch (e) {
      alert('Failed to update comment');
    }
  };

  const handleDelete = async (c: Comment) => {
    if (!window.confirm('Delete this comment permanently?')) return;
    try {
      await api.deleteComment(c.id);
      setComments(comments.filter(item => item.id !== c.id));
    } catch (e) {
      alert('Failed to delete comment');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-50">
          Community Comments & Moderation
        </h2>
        <p className="text-xs text-neutral-500">
          Review visitor feedback, questions, and maker tips submitted on your craft articles.
        </p>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#201E24] border border-neutral-200 dark:border-neutral-800 overflow-hidden craft-card-shadow">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-neutral-500">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500">No comments submitted yet.</div>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {comments.map(c => (
              <div key={c.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                      {c.authorName}
                    </span>
                    {c.authorEmail && (
                      <span className="text-[11px] text-neutral-400">({c.authorEmail})</span>
                    )}
                    <span className="text-[10px] text-neutral-400">
                      • {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <span className="inline-block text-[11px] font-semibold text-craft-primary mb-2">
                    On: {c.postTitle || 'Tutorial'}
                  </span>

                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed bg-neutral-50 dark:bg-neutral-900/60 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                    {c.content}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleApprove(c)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      c.isApproved
                        ? 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                  >
                    {c.isApproved ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    {c.isApproved ? 'Approved' : 'Pending'}
                  </button>

                  <button
                    onClick={() => handleDelete(c)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500"
                    title="Delete comment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
