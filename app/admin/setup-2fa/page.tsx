'use client';
import { useEffect, useState } from 'react';
import AdminNavbar from '@/components/AdminNavbar';

export default function Setup2FA() {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');

  useEffect(() => {
    fetch('/api/admin/setup-2fa')
      .then(r => r.json())
      .then(d => { setQrCode(d.qrCode); setSecret(d.secret); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <div className="max-w-md mx-auto pt-20 px-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Set Up 2FA</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Scan this QR code with <strong>Google Authenticator</strong> or <strong>Authy</strong>.<br />
          After scanning, every login will require the 6-digit code.
        </p>
        {qrCode ? (
          <>
            <img src={qrCode} alt="QR Code" className="mx-auto rounded-xl border border-border mb-4" width={200} height={200} />
            <p className="text-xs text-muted-foreground mb-1">Manual entry secret:</p>
            <code className="text-sm font-mono bg-muted px-3 py-1 rounded">{secret}</code>
          </>
        ) : (
          <p className="text-muted-foreground">Loading...</p>
        )}
        <a href="/admin" className="block mt-8 text-sm text-primary underline">← Back to Admin</a>
      </div>
    </div>
  );
}
