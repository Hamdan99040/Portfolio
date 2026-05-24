import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/security';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin-session');
    
    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }
    
    const payload = verifySessionToken(sessionCookie.value);
    
    if (!payload) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }
    
    const admin = await db.getAdmin();
    
    // Exclude password and secrets in returned object
    const { passwordHash, otpSecret, ...safeAdmin } = admin;
    
    return NextResponse.json({
      authenticated: true,
      user: safeAdmin
    });
  } catch (err) {
    console.error('Session API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin-session');
    
    if (!sessionCookie || !verifySessionToken(sessionCookie.value)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const adminData = await request.json();
    const updated = await db.updateAdmin(adminData);
    
    const { passwordHash, otpSecret, ...safeAdmin } = updated;
    
    return NextResponse.json({
      success: true,
      user: safeAdmin
    });
  } catch (err) {
    console.error('Update profile API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
