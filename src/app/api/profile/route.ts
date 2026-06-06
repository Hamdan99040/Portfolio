import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

function toPublicProfile(admin: Record<string, unknown>) {
  const safeProfile = { ...admin };
  delete safeProfile.passwordHash;
  delete safeProfile.otpSecret;
  return safeProfile;
}

export async function GET() {
  try {
    const admin = await db.getAdmin();
    const adminData = typeof admin.toObject === 'function' ? admin.toObject() : admin;

    return NextResponse.json(toPublicProfile(adminData));
  } catch (err) {
    console.error('GET Profile API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
