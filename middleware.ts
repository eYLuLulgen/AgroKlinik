import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basit in-memory rate limiting (production'da Redis önerilir)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 60; // dakikada 60 istek
const RATE_WINDOW = 60 * 1000;

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Güvenlik başlıkları
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // API route'lar için rate limiting
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now - record.lastReset > RATE_WINDOW) {
      rateLimitMap.set(ip, { count: 1, lastReset: now });
    } else {
      record.count++;
      if (record.count > RATE_LIMIT) {
        return NextResponse.json(
          { error: 'Çok fazla istek gönderildi, lütfen bekleyin' },
          { status: 429 }
        );
      }
    }
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
