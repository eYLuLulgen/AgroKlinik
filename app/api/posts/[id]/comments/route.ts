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
    const body = await request.json();
    const { content } = body;
    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'Yorum içeriği zorunludur' }, { status: 400 });
    }
    const comment = await prisma.comment.create({
      data: { userId: decoded.userId, postId: params.id, content },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
    });
    return NextResponse.json({ comment });
  } catch (error) {
    return NextResponse.json({ error: 'Yorum eklenirken hata oluştu' }, { status: 500 });
  }
}
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: params.id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ comments });
  } catch (error) {
    return NextResponse.json({ error: 'Yorumlar alınırken hata oluştu' }, { status: 500 });
  }
}
