import React, { useState, useEffect } from 'react';
import { ContactMessage } from '../types';
import { api } from '../api';
import { Mail, MailOpen, Trash2, Clock, CheckCircle } from 'lucide-react';

export const MessagesTab: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await api.getMessages();
      setMessages(res);
      if (res.length > 0 && !selectedMessage) {
        setSelectedMessage(res[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (msg: ContactMessage) => {
    try {
      const updated = await api.markMessageRead(msg.id, !msg.isRead);
      setMessages(messages.map(m => m.id === msg.id ? updated : m));
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage(updated);
      }
    } catch (e) {
      alert('Failed to update message');
    }
  };

  const handleDelete = async (msg: ContactMessage) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.deleteMessage(msg.id);
      const remaining = messages.filter(m => m.id !== msg.id);
      setMessages(remaining);
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage(remaining[0] || null);
      }
    } catch (e) {
      alert('Failed to delete message');
    }
  };

  const selectMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      try {
        const updated = await api.markMessageRead(msg.id, true);
        setMessages(messages.map(m => m.id === msg.id ? updated : m));
      } catch (e) {}
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-50">
          Contact Inbox ({messages.filter(m => !m.isRead).length} Unread)
        </h2>
        <p className="text-xs text-neutral-500">
          Messages sent via your public Contact Us page.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Messages List Column */}
        <div className="rounded-2xl bg-white dark:bg-[#201E24] border border-neutral-200 dark:border-neutral-800 overflow-hidden craft-card-shadow md:col-span-1 max-h-[600px] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-neutral-500">Loading inbox...</div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500">Inbox is empty.</div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {messages.map(m => (
                <div
                  key={m.id}
                  onClick={() => selectMessage(m)}
                  className={`p-3.5 cursor-pointer transition-colors ${
                    selectedMessage?.id === m.id
                      ? 'bg-amber-50/70 dark:bg-amber-950/30'
                      : 'hover:bg-neutral-50/60 dark:hover:bg-neutral-900/40'
                  } ${!m.isRead ? 'font-bold' : ''}`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="truncate text-neutral-900 dark:text-neutral-100">
                      {m.name}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-700 dark:text-neutral-300 truncate">
                    {m.subject}
                  </div>
                  <div className="text-[11px] text-neutral-500 truncate mt-0.5">
                    {m.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Message Detail Column */}
        <div className="rounded-2xl bg-white dark:bg-[#201E24] border border-neutral-200 dark:border-neutral-800 p-6 craft-card-shadow md:col-span-2 flex flex-col justify-between">
          {selectedMessage ? (
            <div>
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    {selectedMessage.subject}
                  </h3>
                  <div className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
                    <span>From: <strong>{selectedMessage.name}</strong> ({selectedMessage.email})</span>
                    <span>•</span>
                    <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRead(selectedMessage)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-craft-primary"
                    title={selectedMessage.isRead ? 'Mark as unread' : 'Mark as read'}
                  >
                    {selectedMessage.isRead ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-red-500"
                    title="Delete message"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="text-sm text-neutral-700 dark:text-neutral-200 leading-relaxed whitespace-pre-wrap bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
                {selectedMessage.message}
              </div>

              <div className="mt-6">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-craft-primary px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-90"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Reply via Email Client
                </a>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-neutral-400">
              Select a message from the list to view its contents.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
