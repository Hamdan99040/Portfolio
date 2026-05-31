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
    const experiences = await db.getExperiences();
    return NextResponse.json(experiences);
  } catch (err) {
    console.error('GET Experiences API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { company, role, period, description, type, attachmentUrl } = body;
    
    if (!company || !role || !period || !description || !type) {
      return NextResponse.json({ error: 'Missing required experience fields' }, { status: 400 });
    }
    
    const newExp = await db.createExperience({
      company,
      role,
      period,
      description,
      type,
      attachmentUrl: attachmentUrl || ''
    });
    
    return NextResponse.json(newExp, { status: 201 });
  } catch (err) {
    console.error('POST Experience API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
