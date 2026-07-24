import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/lib/auth';
import { saveImage } from '@/lib/storage';
import { analyzePlantImage } from '@/lib/ai-analysis';
import { sanitizeInput } from '@/lib/validation';

// Analiz Oluştur
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const formData = await request.formData();
    const image = formData.get('image') as File;
    const isPublic = formData.get('isPublic') === 'true';
    const plantName = sanitizeInput((formData.get('plantName') as string) || 'Bilinmeyen Bitki');

    if (!image) {
      return NextResponse.json({ error: 'Görsel zorunludur' }, { status: 400 });
    }

    // Görseli diske kaydet (base64 yerine)
    const uploadResult = await saveImage(image);
    if (uploadResult.error) {
      return NextResponse.json({ error: uploadResult.error }, { status: 400 });
    }

    // AI Analizi (dış API veya yerel veritabanı)
    const aiResult = await analyzePlantImage(uploadResult.url);

    // Analizi kaydet
    const analysis = await prisma.analysis.create({
      data: {
        userId: decoded.userId,
        imageUrl: uploadResult.url,
        diagnosis: aiResult.diagnosis,
        solutions: JSON.stringify(aiResult.solutions),
        isPublic,
        status: 'beklemede',
      },
    });

    // Eğer public ise post olarak da kaydet
    if (isPublic) {
      await prisma.post.create({
        data: {
          userId: decoded.userId,
          analysisId: analysis.id,
          plantName,
          description: `${plantName} bitkimde ${aiResult.diagnosis} tespit edildi.`,
          imageUrl: uploadResult.url,
          status: 'beklemede',
        },
      });
    }

    // Benzer vakaları bul
    const similarCases = await prisma.analysis.findMany({
      where: {
        diagnosis: aiResult.diagnosis,
        isPublic: true,
        NOT: { id: analysis.id },
      },
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
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      analysis: {
        ...analysis,
        solutions: JSON.parse(analysis.solutions),
        severity: aiResult.severity,
        prevention: aiResult.prevention,
      },
      similarCases: similarCases.map(c => ({
        id: c.id,
        userName: `${c.user.firstName} ${c.user.lastName}`,
        userAvatar: c.user.avatar,
        diagnosis: c.diagnosis,
        status: c.status,
      })),
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Analiz sırasında bir hata oluştu' }, { status: 500 });
  }
}

// Kullanıcının analizlerini getir
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

    const [analyses, total] = await Promise.all([
      prisma.analysis.findMany({
        where: { userId: decoded.userId },
        include: {
          progressLogs: { orderBy: { createdAt: 'desc' } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.analysis.count({ where: { userId: decoded.userId } }),
    ]);

    return NextResponse.json({
      analyses: analyses.map(a => ({
        ...a,
        solutions: JSON.parse(a.solutions),
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Veriler alınırken hata oluştu' }, { status: 500 });
  }
}
