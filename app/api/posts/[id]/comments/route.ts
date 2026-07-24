import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { JWT_SECRET } from '@/lib/auth';
import jwt from 'jsonwebtoken';
import { validateCommentContent, sanitizeInput } from '@/lib/validation';

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
    const content = sanitizeInput(body.content || '');

    const contentCheck = validateCommentContent(content);
    if (!contentCheck.valid) {
      return NextResponse.json({ error: contentCheck.message }, { status: 400 });
    }

    // Post var mı kontrol et
    const post = await prisma.post.findUnique({ where: { id: params.id } });
    if (!post) {
      return NextResponse.json({ error: 'Paylaşım bulunamadı' }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        userId: decoded.userId,
        postId: params.id,
        content,
      },
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
