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
    const certifications = await db.getCertifications();
    return NextResponse.json(certifications);
  } catch (err) {
    console.error('GET Certifications API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { title, issuer, date, credentialUrl, type } = body;
    
    if (!title || !issuer || !date || !type) {
      return NextResponse.json({ error: 'Missing required certification fields' }, { status: 400 });
    }
    
    const newCert = await db.createCertification({
      title,
      issuer,
      date,
      credentialUrl: credentialUrl || '#',
      type
    });
    
    return NextResponse.json(newCert, { status: 201 });
  } catch (err) {
    console.error('POST Certification API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
