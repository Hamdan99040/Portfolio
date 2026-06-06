import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSessionToken } from '@/lib/security';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();
    
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP code are required' }, { status: 400 });
    }
    
    const admin = await db.getAdmin();
    
    if (admin.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: 'Invalid request context' }, { status: 400 });
    }
    
    const expectedOtp = process.env.ADMIN_OTP_CODE || (process.env.NODE_ENV === 'production' ? admin.otpSecret : '123456');
    if (!expectedOtp || otp !== expectedOtp) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 401 });
    }
    
    // Generate secure session token
    const token = createSessionToken({ email: admin.email, name: admin.name });
    
    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('admin-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    });
    
    return NextResponse.json({
      success: true,
      user: {
        name: admin.name,
        email: admin.email,
        title: admin.title,
        location: admin.location
      }
    });
  } catch (err) {
    console.error('OTP Verification error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
