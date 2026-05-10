import { NextRequest, NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { prisma } from '@/lib/prisma';

function requireSession(request: NextRequest) {
  const session = request.cookies.get('admin_session');
  return session && session.value === process.env.ADMIN_PASSWORD;
}

async function is2FAConfigured() {
  const setting = await prisma.setting.findUnique({ where: { key: 'totp_configured' } });
  return setting?.value === 'true';
}

// GET — returns QR code for scanning
// Only works: (1) if you have a full admin session AND (2) 2FA is not yet configured
export async function GET(request: NextRequest) {
  if (!requireSession(request)) {
    return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 });
  }

  if (await is2FAConfigured()) {
    return NextResponse.json({ error: '2FA is already configured. Setup is locked.' }, { status: 403 });
  }

  const secret = process.env.TOTP_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'TOTP_SECRET not set in environment.' }, { status: 500 });
  }

  const otpauth = authenticator.keyuri('admin', 'MICROSET Admin', secret);
  const qrCode = await QRCode.toDataURL(otpauth);

  return NextResponse.json({ qrCode, secret });
}

// POST — verify a test code and permanently lock setup
export async function POST(request: NextRequest) {
  if (!requireSession(request)) {
    return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 });
  }

  if (await is2FAConfigured()) {
    return NextResponse.json({ error: '2FA is already configured.' }, { status: 403 });
  }

  const secret = process.env.TOTP_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'TOTP_SECRET not set in environment.' }, { status: 500 });
  }

  const { token } = await request.json();
  if (!token) {
    return NextResponse.json({ error: 'Authenticator code required.' }, { status: 400 });
  }

  const isValid = authenticator.verify({ token, secret });
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid code. Make sure your phone time is correct and try again.' }, { status: 400 });
  }

  // Valid code — permanently mark 2FA as configured
  await prisma.setting.upsert({
    where: { key: 'totp_configured' },
    update: { value: 'true' },
    create: { key: 'totp_configured', value: 'true' },
  });

  return NextResponse.json({ success: true });
}
