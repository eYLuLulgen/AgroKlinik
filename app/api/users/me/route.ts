import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { JWT_SECRET } from '@/lib/auth';
import jwt from 'jsonwebtoken';
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const body = await request.json();
    const { firstName, lastName, profession, location, avatar } = body;
    const user = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(profession && { profession }),
        ...(location && { location }),
        ...(avatar && { avatar }),
      },
      select: {
        id: true, username: true, email: true, firstName: true, lastName: true,
        profession: true, location: true, avatar: true, createdAt: true,
      },
    });
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Güncelleme sırasında hata oluştu' }, { status: 500 });
  }
}
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    await prisma.user.delete({ where: { id: decoded.userId } });
    return NextResponse.json({ message: 'Hesap başarıyla silindi' });
  } catch (error) {
    return NextResponse.json({ error: 'Silme sırasında hata oluştu' }, { status: 500 });
  }
}
