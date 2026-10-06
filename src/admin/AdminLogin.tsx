import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Scissors, Lock, Mail, ArrowRight, Shield, AlertCircle } from 'lucide-react';

export const AdminLogin: React.FC<{ onBackToSite: () => void }> = ({ onBackToSite }) => {
  const { login } = useAuth();
  const { settings } = useSettings();
  const [email, setEmail] = useState('admin@craftnest.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0] dark:bg-[#151417] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-craft-primary text-white shadow-lg shadow-craft-primary/20 mb-4">
            <Scissors className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight">
            {settings.siteName} Creator Studio
          </h1>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Secure admin portal for crafting, writing, and publishing tutorials
          </p>
        </div>

        <div className="rounded-3xl bg-white dark:bg-[#201E24] p-8 border border-neutral-200 dark:border-neutral-800 craft-card-shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@craftnest.com"
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 pl-10 pr-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-craft-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 pl-10 pr-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-craft-primary"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/40 p-3 text-xs text-red-600 dark:text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-craft-primary py-3 text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Enter Admin Panel'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Reminder */}
          <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800 text-center">
            <span className="text-[11px] font-semibold text-neutral-400 block mb-1">
              Default Admin Credentials:
            </span>
            <code className="text-[11px] text-craft-primary bg-amber-50 dark:bg-neutral-900 px-2.5 py-1 rounded-lg border border-amber-200/50 dark:border-neutral-800">
              admin@craftnest.com / admin123
            </code>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onBackToSite}
            className="text-xs font-semibold text-neutral-500 hover:text-craft-primary transition-colors"
          >
            ← Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
