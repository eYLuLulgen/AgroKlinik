import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/lib/auth';
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, profession: true, avatar: true },
        },
        analysis: { select: { diagnosis: true, solutions: true, status: true } },
        comments: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { comments: true, likedBy: true } },
      },
    });
    if (!post) {
      return NextResponse.json({ error: 'Paylaşım bulunamadı' }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: 'Veri alınırken hata oluştu' }, { status: 500 });
  }
}
export async function DELETE(
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
    const post = await prisma.post.findFirst({
      where: { id: params.id, userId: decoded.userId },
    });
    if (!post) {
      return NextResponse.json({ error: 'Paylaşım bulunamadı' }, { status: 404 });
    }
    await prisma.post.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Paylaşım silindi' });
  } catch (error) {
    return NextResponse.json({ error: 'Silme sırasında hata oluştu' }, { status: 500 });
  }
}
