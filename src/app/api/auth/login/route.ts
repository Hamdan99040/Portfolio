import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/security';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    
    const admin = await db.getAdmin();
    
    if (admin.email.toLowerCase() !== email.toLowerCase() || !verifyPassword(password, admin.passwordHash)) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    
    // Password correct, proceed to 2FA / OTP verification step
    return NextResponse.json({ 
      success: true, 
      requireOtp: true,
      message: 'Password verified. 2FA verification code required.'
    });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
