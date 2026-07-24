import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { JWT_SECRET } from '@/lib/auth';
import jwt from 'jsonwebtoken';
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const totalAnalyses = await prisma.analysis.count({ where: { userId: decoded.userId } });
    const solvedAnalyses = await prisma.analysis.count({ where: { userId: decoded.userId, status: 'çözüldü' } });
    const ongoingAnalyses = await prisma.analysis.count({ where: { userId: decoded.userId, status: 'devam ediyor' } });
    const totalComments = await prisma.comment.count({ where: { userId: decoded.userId } });
    const totalPosts = await prisma.post.count({ where: { userId: decoded.userId } });
    const successRate = totalAnalyses > 0 ? Math.round((solvedAnalyses / totalAnalyses) * 100) : 0;
    return NextResponse.json({
      stats: { totalAnalyses, solvedAnalyses, ongoingAnalyses, totalComments, totalPosts, successRate },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Veriler alınırken hata oluştu' }, { status: 500 });
  }
}
