import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { api } from '../api';

export const NewsletterBox: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await api.addSubscriber(email, honeypot);
      if (res.success) {
        setStatus('success');
        setMessage(res.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(res.message);
      }
    } catch (err: any) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-linear-to-br from-[#FFF3E8] to-[#FFE8D6] dark:from-[#2A2328] dark:to-[#1E1C22] p-8 md:p-12 border border-amber-200/60 dark:border-neutral-800 craft-card-shadow ${className}`}>
      {/* Decorative craft accents */}
      <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-craft-primary/10 dark:bg-craft-primary/5 pointer-events-none blur-xl" />
      <div className="absolute top-4 right-6 text-craft-primary/30 pointer-events-none">
        <Sparkles className="h-10 w-10" />
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-white/10 px-3.5 py-1 text-xs font-bold text-craft-primary mb-3">
          <Mail className="h-3.5 w-3.5" />
          Join 2,500+ Makers
        </div>

        <h3 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Get Fresh DIY Craft Tutorials in Your Inbox
        </h3>

        <p className="mt-3 text-sm md:text-base text-neutral-600 dark:text-neutral-300 max-w-lg mx-auto leading-relaxed">
          Free step-by-step guides, printable templates, and weekend creative ideas delivered once a week. No spam, unsubscribe anytime.
        </p>

        {status === 'success' ? (
          <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-teal-50 dark:bg-teal-950/40 p-4 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800">
            <CheckCircle2 className="h-5 w-5 text-teal-600 shrink-0" />
            <span className="text-sm font-semibold">{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
            {/* Honeypot field hidden from users */}
            <input
              type="text"
              name="honeypot"
              value={honeypot}
              onChange={e => setHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1E1C22] px-4 py-3.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-craft-primary shadow-sm"
            />

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 rounded-2xl bg-craft-primary px-6 py-3.5 text-sm font-bold text-white shadow-md hover:opacity-90 active:scale-98 transition-all disabled:opacity-60"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                'Subscribe Free'
              )}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="mt-3 text-xs text-red-500 font-medium">{message}</p>
        )}

        <p className="mt-4 text-[11px] text-neutral-500 dark:text-neutral-400">
          We respect your privacy. By subscribing you agree to receive craft newsletters.
        </p>
      </div>
    </div>
  );
};
