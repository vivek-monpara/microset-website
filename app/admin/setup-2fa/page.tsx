'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/AdminNavbar';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Setup2FA() {
  const router = useRouter();
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'done' | 'locked' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetch('/api/admin/setup-2fa')
      .then(async (r) => {
        if (r.status === 401) { router.replace('/admin/login'); return; }
        if (r.status === 403) { setStatus('locked'); return; }
        const d = await r.json();
        if (d.qrCode) { setQrCode(d.qrCode); setSecret(d.secret); setStatus('ready'); }
        else setStatus('error');
      })
      .catch(() => setStatus('error'));
  }, [router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/setup-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('done');
      } else {
        setErrorMsg(data.error || 'Verification failed.');
        setToken('');
      }
    } catch {
      setErrorMsg('Something went wrong. Try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <div className="max-w-md mx-auto pt-16 px-4">

        {status === 'loading' && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
          </div>
        )}

        {status === 'locked' && (
          <div className="bg-white border border-border rounded-2xl p-8 text-center shadow-lg">
            <ShieldCheck className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">2FA Already Active</h1>
            <p className="text-muted-foreground text-sm mb-6">
              Two-factor authentication is already configured and locked.<br />
              This setup page cannot be accessed again.
            </p>
            <a href="/admin" className="text-sm text-primary underline">← Back to Admin</a>
          </div>
        )}

        {status === 'done' && (
          <div className="bg-white border border-border rounded-2xl p-8 text-center shadow-lg">
            <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">2FA Activated!</h1>
            <p className="text-muted-foreground text-sm mb-2">
              Two-factor authentication is now <strong>permanently active</strong>.<br />
              This setup page is now locked forever.
            </p>
            <p className="text-muted-foreground text-sm mb-6">
              Every future login will require your password <strong>+</strong> the 6-digit code from your authenticator app.
            </p>
            <a href="/admin" className="inline-block px-6 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
              Go to Admin →
            </a>
          </div>
        )}

        {status === 'ready' && (
          <div className="bg-white border border-border rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-6">
              <ShieldCheck className="w-10 h-10 text-primary mx-auto mb-3" />
              <h1 className="text-2xl font-bold">Set Up 2FA</h1>
              <p className="text-muted-foreground text-sm mt-1">
                This can only be done once. After confirming, this page is permanently locked.
              </p>
            </div>

            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground mb-3">
                Step 1 — Open <strong>Google Authenticator</strong> or <strong>Authy</strong>, tap <strong>+</strong>, then scan:
              </p>
              <img src={qrCode} alt="QR Code" className="mx-auto rounded-xl border border-border mb-4" width={200} height={200} />
              <p className="text-xs text-muted-foreground mb-1">Or enter this secret manually:</p>
              <code className="text-xs font-mono bg-muted px-3 py-1.5 rounded break-all inline-block">{secret}</code>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Step 2 — Enter the 6-digit code to confirm setup:
                </label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  required
                  autoFocus
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl tracking-[0.5em] font-mono"
                />
              </div>

              {errorMsg && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={verifying || token.length !== 6}
                className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {verifying ? 'Verifying…' : 'Confirm & Activate 2FA'}
              </button>
            </form>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load setup. Make sure TOTP_SECRET is set in Vercel.</p>
            <a href="/admin" className="block mt-4 text-sm text-primary underline">← Back to Admin</a>
          </div>
        )}
      </div>
    </div>
  );
}
