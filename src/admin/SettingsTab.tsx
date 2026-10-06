import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { Save, Check, Shield, DollarSign, Palette, Globe, Lock, ExternalLink } from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const { updateAdminState } = useAuth();

  // Settings form states
  const [siteName, setSiteName] = useState(settings.siteName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [description, setDescription] = useState(settings.description);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor || '#F26B5B');
  const [secondaryColor, setSecondaryColor] = useState(settings.secondaryColor || '#2BB5A5');
  const [authorName, setAuthorName] = useState(settings.authorName);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);

  // Social links
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl || '');
  const [facebookUrl, setFacebookUrl] = useState(settings.facebookUrl || '');
  const [youtubeUrl, setYoutubeUrl] = useState(settings.youtubeUrl || '');
  const [tiktokUrl, setTiktokUrl] = useState(settings.tiktokUrl || '');
  const [pinterestUrl, setPinterestUrl] = useState(settings.pinterestUrl || '');
  const [twitterUrl, setTwitterUrl] = useState(settings.twitterUrl || '');

  // AdSense & SEO
  const [adsensePublisherId, setAdsensePublisherId] = useState(settings.adsensePublisherId || '');
  const [adsenseEnabled, setAdsenseEnabled] = useState(settings.adsenseEnabled);
  const [adsTxt, setAdsTxt] = useState(settings.adsTxt || '');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(settings.googleAnalyticsId || '');
  const [googleSearchConsoleTag, setGoogleSearchConsoleTag] = useState(settings.googleSearchConsoleTag || '');
  const [footerText, setFooterText] = useState(settings.footerText || '');

  // Password change
  const [adminEmail, setAdminEmail] = useState('admin@craftnest.com');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      await updateSettings({
        siteName,
        tagline,
        description,
        logoUrl,
        primaryColor,
        secondaryColor,
        authorName,
        contactEmail,
        instagramUrl,
        facebookUrl,
        youtubeUrl,
        tiktokUrl,
        pinterestUrl,
        twitterUrl,
        adsensePublisherId,
        adsenseEnabled,
        adsTxt,
        googleAnalyticsId,
        googleSearchConsoleTag,
        footerText
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword && newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      await api.updateProfile({
        email: adminEmail,
        password: newPassword || undefined
      });
      updateAdminState(adminEmail);
      setPasswordSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update credentials');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-50">
          Site & Monetization Settings
        </h2>
        <p className="text-xs text-neutral-500">
          Control website branding, Google AdSense integration, ads.txt, and theme colors.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Branding & Visuals */}
        <div className="rounded-2xl bg-white dark:bg-[#201E24] p-6 border border-neutral-200 dark:border-neutral-800 craft-card-shadow space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <Palette className="h-4 w-4 text-craft-primary" />
            <h3 className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100">
              Branding & Visual Palette
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                Website Name
              </label>
              <input
                type="text"
                required
                value={siteName}
                onChange={e => setSiteName(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">
              Primary Brand Color (Coral / Terracotta)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={e => setPrimaryColor(e.target.value)}
                className="h-10 w-16 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={e => setPrimaryColor(e.target.value)}
                className="w-32 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs font-mono"
              />
              <span className="text-xs text-neutral-500">Live preview applies across all buttons and accents.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                Custom Logo URL (optional, leave blank for icon badge)
              </label>
              <input
                type="text"
                value={logoUrl}
                onChange={e => setLogoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Google AdSense & ads.txt */}
        <div className="rounded-2xl bg-white dark:bg-[#201E24] p-6 border border-neutral-200 dark:border-neutral-800 craft-card-shadow space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              <h3 className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100">
                Google AdSense Monetization
              </h3>
            </div>
            <a
              href="/ads.txt"
              target="_blank"
              className="text-xs font-bold text-craft-primary flex items-center gap-1 hover:underline"
            >
              Verify /ads.txt
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-800 dark:text-neutral-200">
              <input
                type="checkbox"
                checked={adsenseEnabled}
                onChange={e => setAdsenseEnabled(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-600"
              />
              Enable Google AdSense Ad Units across website
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">
              AdSense Publisher ID
            </label>
            <input
              type="text"
              placeholder="e.g. ca-pub-9876543210987654"
              value={adsensePublisherId}
              onChange={e => setAdsensePublisherId(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs font-mono"
            />
            <p className="text-[11px] text-neutral-500 mt-1">
              When specified, the Google AdSense loader script is automatically injected into the HTML head.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">
              ads.txt Content (Served dynamically at /ads.txt)
            </label>
            <textarea
              rows={3}
              placeholder="google.com, pub-9876543210987654, DIRECT, f08c47fec0942fa0"
              value={adsTxt}
              onChange={e => setAdsTxt(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-3 text-xs font-mono"
            />
          </div>
        </div>

        {/* Social Media Channels */}
        <div className="rounded-2xl bg-white dark:bg-[#201E24] p-6 border border-neutral-200 dark:border-neutral-800 craft-card-shadow space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <Globe className="h-4 w-4 text-craft-secondary" />
            <h3 className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100">
              Social Media Channels
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                Instagram URL
              </label>
              <input
                type="text"
                value={instagramUrl}
                onChange={e => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                YouTube URL
              </label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={e => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/@..."
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                Pinterest URL
              </label>
              <input
                type="text"
                value={pinterestUrl}
                onChange={e => setPinterestUrl(e.target.value)}
                placeholder="https://pinterest.com/..."
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Google Analytics & Search Console */}
        <div className="rounded-2xl bg-white dark:bg-[#201E24] p-6 border border-neutral-200 dark:border-neutral-800 craft-card-shadow space-y-4">
          <h3 className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            Analytics & Search Console Verification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                Google Analytics Measurement ID (GA4)
              </label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={googleAnalyticsId}
                onChange={e => setGoogleAnalyticsId(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                Google Search Console Meta Verification Tag
              </label>
              <input
                type="text"
                placeholder="google-site-verification=..."
                value={googleSearchConsoleTag}
                onChange={e => setGoogleSearchConsoleTag(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-teal-600">
              <Check className="h-4 w-4" />
              Settings updated successfully!
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="ml-auto flex items-center gap-2 rounded-xl bg-craft-primary px-7 py-3 text-sm font-bold text-white shadow-md hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>

      {/* Admin Password Change Form */}
      <div className="rounded-2xl bg-white dark:bg-[#201E24] p-6 border border-neutral-200 dark:border-neutral-800 craft-card-shadow space-y-4">
        <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <Lock className="h-4 w-4 text-amber-600" />
          <h3 className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100">
            Change Admin Credentials
          </h3>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="Leave blank to keep current"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-xs"
              />
            </div>
          </div>

          {passwordError && (
            <div className="text-xs text-red-500 font-bold">{passwordError}</div>
          )}

          {passwordSuccess && (
            <div className="text-xs text-teal-600 font-bold">Admin credentials updated successfully!</div>
          )}

          <div className="text-right">
            <button
              type="submit"
              className="rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-5 py-2 text-xs font-bold shadow-sm hover:opacity-90"
            >
              Update Admin Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
