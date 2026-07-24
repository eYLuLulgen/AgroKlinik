import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/lib/auth';
export async function GET(
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
    const analysis = await prisma.analysis.findFirst({
      where: { id: params.id, userId: decoded.userId },
      include: { progressLogs: { orderBy: { createdAt: 'desc' } } },
    });
    if (!analysis) {
      return NextResponse.json({ error: 'Analiz bulunamadı' }, { status: 404 });
    }
    return NextResponse.json({
      analysis: { ...analysis, solutions: JSON.parse(analysis.solutions) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Veri alınırken hata oluştu' }, { status: 500 });
  }
}
