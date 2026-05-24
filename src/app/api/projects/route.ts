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
    const projects = await db.getProjects();
    return NextResponse.json(projects);
  } catch (err) {
    console.error('GET Projects API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { title, description, problemSolved, role, category, technologies, image, github, demo } = body;
    
    if (!title || !description || !problemSolved || !role || !category) {
      return NextResponse.json({ error: 'Missing required project fields' }, { status: 400 });
    }
    
    const newProj = await db.createProject({
      title,
      description,
      problemSolved,
      role,
      category,
      technologies: Array.isArray(technologies) ? technologies : [],
      image: image || '',
      github: github || '',
      demo: demo || ''
    });
    
    return NextResponse.json(newProj, { status: 201 });
  } catch (err) {
    console.error('POST Project API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
