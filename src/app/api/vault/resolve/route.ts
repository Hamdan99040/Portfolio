import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json({ error: 'Security access token is required' }, { status: 400 });
    }
    
    // Retrieve the shared link record
    const sharedLink = await db.getSharedLink(token);
    
    if (!sharedLink) {
      return NextResponse.json({ error: 'Access token is invalid or has been revoked.' }, { status: 401 });
    }
    
    // Check if the link has expired
    const expiresAt = new Date(sharedLink.expiresAt);
    if (expiresAt < new Date()) {
      return NextResponse.json({ error: 'This temporary access link has expired.' }, { status: 401 });
    }
    
    // Retrieve the target document (including fileContent)
    const doc = await db.getDocumentById(sharedLink.documentId);
    
    if (!doc) {
      return NextResponse.json({ error: 'Target document was not found or has been deleted.' }, { status: 404 });
    }
    
    // Inject the specific visitor watermark text locked inside the shared link
    doc.watermarkText = sharedLink.watermarkText || 'FOR VERIFICATION USE ONLY';
    
    return NextResponse.json(doc);
  } catch (err) {
    console.error('Resolve Token API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
