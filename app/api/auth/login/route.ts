import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/lib/auth';
import { sanitizeInput } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username = sanitizeInput(body.username || '');
    const password = body.password || '';

    // Validasyon
    if (!username || !password) {
      return NextResponse.json({ error: 'Kullanıcı adı ve şifre zorunludur' }, { status: 400 });
    }

    // Kullanıcıyı bul (username veya email ile)
    const user = await prisma.user.findFirst({
      where: { OR: [{ username }, { email: username.toLowerCase() }] },
    });

    // Güvenlik: kullanıcı bulunamasa bile aynı süreyi harca (timing attack önleme)
    if (!user) {
      await bcrypt.compare(password, '$2a$12$dummyhashdummyhashdummyhashdummyhashdummyhashdummyhashdumm');
      return NextResponse.json({ error: 'Kullanıcı adı veya şifre hatalı' }, { status: 401 });
    }

    // Şifreyi kontrol et
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Kullanıcı adı veya şifre hatalı' }, { status: 401 });
    }

    // Token oluştur
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Giriş sırasında bir hata oluştu' }, { status: 500 });
  }
}
