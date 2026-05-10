import { NextRequest, NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

export async function GET(request: NextRequest) {
  const session = request.cookies.get('admin_session');
  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const secret = process.env.TOTP_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'TOTP_SECRET not configured' }, { status: 500 });
  }

  const otpauth = authenticator.keyuri('admin', 'MICROSET Admin', secret);
  const qrCode = await QRCode.toDataURL(otpauth);

  return NextResponse.json({ qrCode, secret });
}
