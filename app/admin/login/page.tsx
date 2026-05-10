'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Lock, Shield } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, token: token || undefined }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin');
        router.refresh();
      } else if (data.require2fa) {
        setShow2FA(true);
        setError(token ? 'Invalid authenticator code. Try again.' : '');
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-border rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              {show2FA ? <Shield className="w-8 h-8 text-primary" /> : <Lock className="w-8 h-8 text-primary" />}
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {show2FA ? '2-Factor Auth' : 'Admin Access'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {show2FA
                ? 'Enter the 6-digit code from your authenticator app'
                : 'MICROSET — Product Management'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!show2FA && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  autoFocus
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            {show2FA && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Authenticator Code</label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  required
                  autoFocus
                  maxLength={6}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl tracking-[0.5em] font-mono"
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading || (show2FA && token.length !== 6)}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              {loading ? 'Verifying...' : show2FA ? 'Verify Code' : 'Sign In'}
            </Button>

            {show2FA && (
              <button
                type="button"
                onClick={() => { setShow2FA(false); setToken(''); setError(''); }}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
