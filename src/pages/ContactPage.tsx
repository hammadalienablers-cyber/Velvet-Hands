import React, { useState } from 'react';
import { api } from '../api';
import { useSettings } from '../context/SettingsContext';
import { SEOHead } from '../components/SEOHead';
import { Mail, Send, CheckCircle2, MessageSquare, MapPin, Sparkles } from 'lucide-react';

export const ContactPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { settings } = useSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await api.sendMessage({
        name,
        email,
        subject,
        message,
        honeypot
      });
      if (res.success) {
        setSuccess(true);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }
    } catch (err: any) {
      setErrorMsg('Failed to send your message. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <SEOHead
        title="Contact Us – CraftNest DIY Blog"
        description="Get in touch with the CraftNest team for tutorial suggestions, collaboration, or questions."
        canonicalPath="/contact"
        settings={settings}
      />

      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-craft-primary/10 px-3.5 py-1 text-xs font-bold text-craft-primary mb-3">
          <MessageSquare className="h-3.5 w-3.5" />
          We Love Hearing From Makers
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-50">
          Get In Touch With CraftNest
        </h1>
        <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Have a craft tutorial request, video feedback, or partnership inquiry? Drop us a note below and we'll reply as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Sidebar */}
        <div className="rounded-3xl bg-linear-to-br from-amber-50 to-rose-50 dark:from-[#24202B] dark:to-[#1B1922] p-6 sm:p-8 border border-amber-200/60 dark:border-neutral-800 craft-card-shadow flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-neutral-900 dark:text-neutral-100 mb-4">
              Creator Studio
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
              CraftNest produces high-fidelity visual craft tutorials and social videos for makers worldwide.
            </p>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white dark:bg-neutral-800 p-2.5 text-craft-primary shadow-sm">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="block font-bold text-neutral-800 dark:text-neutral-200">Email Inquiries</span>
                  <span className="text-neutral-500">{settings.contactEmail || 'hello@craftnest.com'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white dark:bg-neutral-800 p-2.5 text-craft-secondary shadow-sm">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <span className="block font-bold text-neutral-800 dark:text-neutral-200">Social Channels</span>
                  <span className="text-neutral-500">YouTube • Instagram • TikTok</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-amber-200/60 dark:border-neutral-800 text-[11px] text-neutral-500">
            Average response time: within 24-48 business hours.
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 rounded-3xl bg-white dark:bg-[#201E24] p-6 sm:p-10 border border-neutral-200/80 dark:border-neutral-800 craft-card-shadow">
          {success ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 mb-4">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Message Sent Successfully!
              </h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                Thank you for contacting CraftNest. Your inquiry has been saved to our inbox and our team will get back to you shortly.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-6 rounded-xl bg-craft-primary px-5 py-2 text-xs font-bold text-white shadow-md"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Spam Honeypot */}
              <input
                type="text"
                name="honeypot"
                value={honeypot}
                onChange={e => setHoneypot(e.target.value)}
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
                    placeholder="e.g. Maya Chen"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-craft-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-craft-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Craft Tutorial Request or Question"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-craft-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell us what you're working on or what you'd like to ask..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-craft-primary"
                />
              </div>

              {errorMsg && (
                <div className="rounded-xl bg-red-50 dark:bg-red-950/40 p-3 text-xs text-red-600 dark:text-red-300">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 rounded-2xl bg-craft-primary px-7 py-3 text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
