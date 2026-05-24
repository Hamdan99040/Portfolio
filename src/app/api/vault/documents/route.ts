import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/security';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin-session');
  if (!sessionCookie) return false;
  const payload = verifySessionToken(sessionCookie.value);
  return payload !== null;
}

export async function GET() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const docs = await db.getDocuments();
    return NextResponse.json(docs);
  } catch (err) {
    console.error('GET Documents API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { name, type, fileName, fileContent, watermarkText } = body;
    
    if (!name || !type || !fileName || !fileContent) {
      return NextResponse.json({ error: 'Missing required document fields' }, { status: 400 });
    }
    
    const newDoc = await db.createDocument({
      name,
      type,
      fileName,
      fileContent, // base64 representation of the file
      watermarkText: watermarkText || 'FOR RECRUITMENT USE ONLY - CONFIDENTIAL',
      uploadedAt: new Date().toISOString()
    });
    
    return NextResponse.json(newDoc, { status: 201 });
  } catch (err) {
    console.error('POST Document API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
