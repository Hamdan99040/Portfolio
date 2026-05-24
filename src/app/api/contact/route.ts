import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;
    
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    
    const newMsg = await db.createMessage({
      name,
      email,
      subject,
      message,
      sentAt: new Date().toISOString()
    });
    
    return NextResponse.json({
      success: true,
      message: 'Message sent successfully! Thank you for contacting me.',
      data: newMsg
    }, { status: 201 });
  } catch (err) {
    console.error('Contact Form API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  // Return contact details or configuration, or list messages for authenticated admins
  // Secured under cookies
  const { cookies } = await import('next/headers');
  const { verifySessionToken } = await import('@/lib/security');
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin-session');
  
  if (!sessionCookie || !verifySessionToken(sessionCookie.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const messages = await db.getMessages();
    return NextResponse.json(messages);
  } catch (err) {
    console.error('GET Contact Messages error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
export async function DELETE(request: Request) {
  // Admin can delete messages
  const { cookies } = await import('next/headers');
  const { verifySessionToken } = await import('@/lib/security');
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin-session');
  
  if (!sessionCookie || !verifySessionToken(sessionCookie.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }
    await db.deleteMessage(id);
    return NextResponse.json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    console.error('DELETE Contact Message error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
