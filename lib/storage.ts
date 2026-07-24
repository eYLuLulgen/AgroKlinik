import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export interface UploadResult {
  url: string;
  error?: string;
}

export async function saveImage(file: File): Promise<UploadResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { url: '', error: 'Sadece JPEG, PNG, WebP ve GIF formatları desteklenir' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { url: '', error: 'Dosya boyutu 10MB\'yi geçemez' };
  }

  if (file.size < 1024) {
    return { url: '', error: 'Dosya çok küçük, geçerli bir görsel yükleyin' };
  }

  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const filename = `${crypto.randomUUID()}.${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  const bytes = await file.arrayBuffer();
  await writeFile(filepath, Buffer.from(bytes));

  return { url: `/uploads/${filename}` };
}
