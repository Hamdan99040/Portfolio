import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/security';
import fs from 'fs';
import path from 'path';

// Allowed file extensions
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.pdf', '.docx', '.doc'];

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null; // e.g. 'message', 'project', 'cert', 'resume', 'experience'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 1. Authorization Check
    // If the upload is NOT for a public message attachment, it requires a valid admin session.
    if (type !== 'message') {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get('admin-session');
      if (!sessionCookie || !verifySessionToken(sessionCookie.value)) {
        return NextResponse.json({ error: 'Unauthorized upload attempt' }, { status: 401 });
      }
    }

    // 2. Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    // 3. Validate File Extension
    const fileExt = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
      return NextResponse.json(
        { error: `File type not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}` },
        { status: 400 }
      );
    }

    // 4. Sanitize and Create Unique Filename
    const sanitizedBase = path.basename(file.name, fileExt).replace(/[^a-z0-9-_]/gi, '_');
    const uniqueFileName = `${Date.now()}_${sanitizedBase}${fileExt}`;

    // 5. Ensure Target Upload Directory Exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 6. Write File Stream
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, uniqueFileName);
    fs.writeFileSync(filePath, buffer);

    // 7. Return Web-Accessible File Path
    const fileUrl = `/uploads/${uniqueFileName}`;
    return NextResponse.json({ success: true, fileUrl }, { status: 201 });
  } catch (err) {
    console.error('File upload system error:', err);
    return NextResponse.json({ error: 'Failed to write file scan' }, { status: 500 });
  }
}
