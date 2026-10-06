import React, { useState, useEffect } from 'react';
import { Subscriber } from '../types';
import { api } from '../api';
import { Download, Trash2, Mail, Users, CheckCircle } from 'lucide-react';

export const SubscribersTab: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubs = async () => {
    setIsLoading(true);
    try {
      const res = await api.getSubscribers();
      setSubscribers(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  const handleExportCsv = () => {
    window.open('/api/subscribers/export', '_blank');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove subscriber from the list?')) return;
    try {
      await api.deleteSubscriber(id);
      setSubscribers(subscribers.filter(s => s.id !== id));
    } catch (e) {
      alert('Failed to remove subscriber');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-50">
            Newsletter Subscribers ({subscribers.length})
          </h2>
          <p className="text-xs text-neutral-500">
            Makers who subscribed to your weekly DIY craft newsletters.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90"
        >
          <Download className="h-4 w-4" />
          Export Subscribers (CSV)
        </button>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#201E24] border border-neutral-200 dark:border-neutral-800 overflow-hidden craft-card-shadow">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-neutral-500">Loading subscribers...</div>
        ) : subscribers.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500">No subscribers yet.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Subscribed Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {subscribers.map(sub => (
                <tr key={sub.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50">
                  <td className="py-3 px-4 font-bold text-neutral-800 dark:text-neutral-200">
                    {sub.email}
                  </td>
                  <td className="py-3 px-4 text-neutral-500">
                    {new Date(sub.subscribedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="p-1 text-neutral-400 hover:text-red-500"
                      title="Delete subscriber"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
