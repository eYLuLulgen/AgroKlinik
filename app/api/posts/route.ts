import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { JWT_SECRET } from '@/lib/auth';
import jwt from 'jsonwebtoken';
import { validateCommentContent, sanitizeInput } from '@/lib/validation';

// Tüm public postları getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'newest';
    const status = searchParams.get('status');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'popular') {
      orderBy = { likes: 'desc' };
    }

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profession: true,
            avatar: true,
          },
        },
        analysis: {
          select: {
            diagnosis: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.post.count({ where });

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Veriler alınırken hata oluştu' }, { status: 500 });
  }
}
