import React, { useState } from 'react';
import { Heart, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-pf-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <a
          href="/"
          className="flex items-center justify-center space-x-3 text-pf-forest hover:text-pf-moss transition-colors mb-8 cursor-pointer"
        >
          <div className="w-12 h-12 bg-pf-sage rounded-full flex items-center justify-center">
            <Heart className="h-6 w-6 text-pf-forest" aria-hidden="true" />
          </div>
          <span className="text-2xl font-display font-semibold">Prakriti Foundation</span>
        </a>

        <div className="bg-white border border-pf-border rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-semibold text-pf-forest mb-1">Admin Sign In</h1>
          <p className="text-sm text-pf-muted mb-6">Sign in to access the admin dashboard</p>

          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start space-x-2 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm"
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="flex items-center text-sm font-medium text-pf-ink mb-2">
                <Mail className="h-4 w-4 mr-1" aria-hidden="true" />
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 border border-pf-border rounded-md text-pf-ink"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="flex items-center text-sm font-medium text-pf-ink mb-2">
                <Lock className="h-4 w-4 mr-1" aria-hidden="true" />
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 border border-pf-border rounded-md text-pf-ink"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 inline-flex items-center justify-center gap-2 bg-pf-forest hover:bg-pf-moss text-white rounded-md font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-xs text-pf-muted mt-6 text-center">
            Don't have credentials yet? See <span className="font-medium">SUPABASE_SETUP.md</span> for
            instructions on creating an admin account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
