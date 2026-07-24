import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/lib/auth';
import { validateEmail, validatePassword, validateUsername, validateName, sanitizeInput } from '@/lib/validation';

const professionEmojis: Record<string, string> = {
  'Çiftçi': '👨‍🌾',
  'Ziraat Mühendisi': '🌾',
  'Botanikçi': '🌿',
  'Hobi Bahçıvanı': '🪴',
  'Tarım Teknisyeni': '🛠️',
  'Veteriner': '🐄',
  'Öğrenci': '📚',
  'Diğer': '🌱',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, firstName, lastName, profession, location, avatar } = body;

    // Doğrulama
    const usernameCheck = validateUsername(sanitizeInput(username || ''));
    if (!usernameCheck.valid) {
      return NextResponse.json({ error: usernameCheck.message }, { status: 400 });
    }

    const emailCheck = validateEmail(sanitizeInput(email || ''));
    if (!emailCheck.valid) {
      return NextResponse.json({ error: emailCheck.message }, { status: 400 });
    }

    const passwordCheck = validatePassword(password || '');
    if (!passwordCheck.valid) {
      return NextResponse.json({ error: passwordCheck.message }, { status: 400 });
    }

    const firstNameCheck = validateName(sanitizeInput(firstName || ''), 'Ad');
    if (!firstNameCheck.valid) {
      return NextResponse.json({ error: firstNameCheck.message }, { status: 400 });
    }

    const lastNameCheck = validateName(sanitizeInput(lastName || ''), 'Soyad');
    if (!lastNameCheck.valid) {
      return NextResponse.json({ error: lastNameCheck.message }, { status: 400 });
    }

    if (!profession || !location) {
      return NextResponse.json({ error: 'Meslek ve konum zorunludur' }, { status: 400 });
    }

    // Kullanıcı var mı kontrol et
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: usernameCheck.message ? username : username },
          { email }
        ]
      }
    });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu kullanıcı adı veya email zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);
    // Avatar yoksa mesleğe göre emoji ata
    const userAvatar = avatar || professionEmojis[profession] || '🌱';

    // Kullanıcı oluştur
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        profession,
        location,
        avatar: userAvatar,
      },
    });

    // Token oluştur
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Şifreyi response'dan çıkar
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Kayıt sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}
