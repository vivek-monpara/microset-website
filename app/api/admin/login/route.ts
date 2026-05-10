import { NextRequest, NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import { prisma } from '@/lib/prisma';

const attempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

function getIP(request: NextRequest) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function POST(request: NextRequest) {
  try {
    const ip = getIP(request);
    const now = Date.now();

    const record = attempts.get(ip) || { count: 0, lockedUntil: 0 };
    if (record.lockedUntil > now) {
      const minutesLeft = Math.ceil((record.lockedUntil - now) / 60000);
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${minutesLeft} minute(s).` },
        { status: 429 }
      );
    }

    const { password, token } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;
    const totpSecret = process.env.TOTP_SECRET;

    if (!adminPassword) {
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    if (password !== adminPassword) {
      record.count += 1;
      if (record.count >= MAX_ATTEMPTS) {
        record.lockedUntil = now + LOCK_DURATION_MS;
        record.count = 0;
      }
      attempts.set(ip, record);
      const remaining = MAX_ATTEMPTS - record.count;
      return NextResponse.json(
        { error: remaining > 0 ? `Invalid password. ${remaining} attempt(s) left.` : 'Account locked for 15 minutes.' },
        { status: 401 }
      );
    }

    // Check if 2FA has been configured in the database
    if (totpSecret) {
      const setting = await prisma.setting.findUnique({ where: { key: 'totp_configured' } });
      const is2FAActive = setting?.value === 'true';

      if (is2FAActive) {
        // 2FA is active — require TOTP token
        if (!token) {
          return NextResponse.json({ error: 'Authenticator code required', require2fa: true }, { status: 401 });
        }
        const isValid = authenticator.verify({ token, secret: totpSecret });
        if (!isValid) {
          record.count += 1;
          if (record.count >= MAX_ATTEMPTS) {
            record.lockedUntil = now + LOCK_DURATION_MS;
            record.count = 0;
          }
          attempts.set(ip, record);
          return NextResponse.json({ error: 'Invalid authenticator code. Try again.', require2fa: true }, { status: 401 });
        }
      }
      // If 2FA is NOT yet configured, allow login with just password
      // so admin can get in and complete setup at /admin/setup-2fa
    }

    // Success
    attempts.delete(ip);
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', adminPassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
