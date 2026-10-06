import React, { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

interface AdSenseBannerProps {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  placement: 'in-article-intro' | 'mid-steps' | 'pre-related' | 'sidebar' | 'header';
  className?: string;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slot = '1234567890',
  format = 'auto',
  placement,
  className = ''
}) => {
  const { settings } = useSettings();

  useEffect(() => {
    // If real adsense script is loaded and user has configured a valid publisher ID, push ad
    if (settings.adsenseEnabled && settings.adsensePublisherId && typeof window !== 'undefined') {
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      } catch (e) {
        // Safe ignore
      }
    }
  }, [settings.adsenseEnabled, settings.adsensePublisherId]);

  if (!settings.adsenseEnabled) {
    return null;
  }

  return (
    <div className={`my-8 flex flex-col items-center justify-center ${className}`}>
      <span className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold mb-1.5">
        Advertisement
      </span>

      <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-dashed border-amber-200 dark:border-neutral-800 bg-amber-50/50 dark:bg-neutral-900/40 p-4 transition-all">
        {settings.adsensePublisherId && settings.adsensePublisherId.startsWith('ca-pub-') ? (
          <ins
            className="adsbygoogle block"
            style={{ display: 'block', minHeight: placement === 'sidebar' ? '300px' : '90px' }}
            data-ad-client={settings.adsensePublisherId}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
            <span className="font-medium text-craft-primary">Google AdSense Space ({placement})</span>
            <p className="mt-1 max-w-md text-[11px] leading-relaxed">
              Your ads will automatically display here once you connect your Google AdSense Publisher ID in Admin Settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
