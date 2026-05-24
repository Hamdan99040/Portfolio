import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/security';

async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin-session');
  if (!sessionCookie) return false;
  const payload = verifySessionToken(sessionCookie.value);
  return payload !== null;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Check if there is a query token (used for temporary sharing links)
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    let isAuthorized = false;
    let customWatermark = '';
    
    if (token) {
      const sharedLink = await db.getSharedLink(token);
      if (sharedLink && sharedLink.documentId === id) {
        const expiresAt = new Date(sharedLink.expiresAt);
        if (expiresAt > new Date()) {
          isAuthorized = true;
          customWatermark = sharedLink.watermarkText || 'TEMP VISITOR ACCESS - SECURE';
        }
      }
    }
    
    // If not authorized by token, check if authorized by admin session
    if (!isAuthorized) {
      const isAdmin = await isAdminAuthenticated();
      if (isAdmin) {
        isAuthorized = true;
      }
    }
    
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized or access link expired' }, { status: 401 });
    }
    
    // Retrieve full document with fileContent (base64)
    const doc = await db.getDocumentById(id);
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    
    // If accessed via a temporary token, overlay or inject the visitor watermark
    if (token && customWatermark) {
      doc.watermarkText = customWatermark;
    }
    
    return NextResponse.json(doc);
  } catch (err) {
    console.error('GET Individual Document error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = await params;
    const deleted = await db.deleteDocument(id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Document deleted successfully' });
  } catch (err) {
    console.error('DELETE Document error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
