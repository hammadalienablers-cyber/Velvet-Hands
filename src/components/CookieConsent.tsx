import React, { useState, useEffect } from 'react';
import { Cookie, X, Check } from 'lucide-react';

export const CookieConsent: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('craftnest_cookie_consent');
    if (!consent) {
      // Small timeout for smooth appearance
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('craftnest_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('craftnest_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom duration-300">
      <div className="rounded-2xl border border-amber-200 dark:border-neutral-800 bg-white/95 dark:bg-[#201E24]/95 p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="rounded-xl bg-craft-primary/10 p-2.5 text-craft-primary shrink-0 mt-0.5">
              <Cookie className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                We value your privacy & crafting experience
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                CraftNest uses cookies and third-party advertising partners like Google AdSense to personalize content, deliver relevant craft tutorials, and analyze site traffic. Review our{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('/privacy')}
                  className="font-medium text-craft-primary underline hover:opacity-80"
                >
                  Privacy Policy
                </button>{' '}
                to learn more.
              </p>
            </div>
          </div>

          <div className="flex w-full md:w-auto items-center justify-end gap-2 shrink-0">
            <button
              onClick={handleDecline}
              className="flex-1 md:flex-initial rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Essential Only
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-craft-primary px-5 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 transition-opacity"
            >
              <Check className="h-3.5 w-3.5" />
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
