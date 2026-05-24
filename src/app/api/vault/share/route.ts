import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifySessionToken, generateToken } from '@/lib/security';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin-session');
  if (!sessionCookie) return false;
  const payload = verifySessionToken(sessionCookie.value);
  return payload !== null;
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { documentId, expiresInHours, watermarkText } = body;
    
    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }
    
    // Check if document exists
    const doc = await db.getDocumentById(documentId);
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    
    const hours = parseInt(expiresInHours) || 24;
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * hours).toISOString();
    
    const newLink = await db.createSharedLink({
      token,
      documentId,
      expiresAt,
      watermarkText: watermarkText || 'FOR RECRUITER VERIFICATION - CONFIDENTIAL'
    });
    
    return NextResponse.json({
      success: true,
      token,
      expiresAt,
      shareUrl: `/vault/shared?token=${token}`
    }, { status: 201 });
  } catch (err) {
    console.error('POST Share link error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
