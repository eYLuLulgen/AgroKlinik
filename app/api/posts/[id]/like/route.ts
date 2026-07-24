import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { JWT_SECRET } from '@/lib/auth';
import jwt from 'jsonwebtoken';
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const existingLike = await prisma.postLike.findUnique({
      where: { userId_postId: { userId: decoded.userId, postId: params.id } },
    });
    if (existingLike) {
      await prisma.postLike.delete({ where: { id: existingLike.id } });
      await prisma.post.update({ where: { id: params.id }, data: { likes: { decrement: 1 } } });
      return NextResponse.json({ liked: false });
    } else {
      await prisma.postLike.create({ data: { userId: decoded.userId, postId: params.id } });
      await prisma.post.update({ where: { id: params.id }, data: { likes: { increment: 1 } } });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    return NextResponse.json({ error: 'İşlem sırasında hata oluştu' }, { status: 500 });
  }
}
