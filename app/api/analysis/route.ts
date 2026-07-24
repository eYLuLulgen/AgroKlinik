import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/lib/auth';
import { saveImage } from '@/lib/storage';
import { analyzePlantImage } from '@/lib/ai-analysis';

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
    const plantName = (formData.get('plantName') as string) || 'Bilinmeyen Bitki';

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
        solutions: JSON.stringify({
          solutions: aiResult.solutions,
          prevention: aiResult.prevention,
          severity: aiResult.severity,
        }),
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

    const solutionsData = JSON.parse(analysis.solutions);

    return NextResponse.json({
      analysis: {
        ...analysis,
        solutions: solutionsData.solutions,
        prevention: solutionsData.prevention,
        severity: solutionsData.severity,
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

    const analyses = await prisma.analysis.findMany({
      where: { userId: decoded.userId },
      include: {
        progressLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      analyses: analyses.map(a => {
        const solutionsData = JSON.parse(a.solutions);
        return {
          ...a,
          solutions: solutionsData.solutions || [],
          prevention: solutionsData.prevention || [],
          severity: solutionsData.severity || 'orta',
        };
      }),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Veriler alınırken hata oluştu' }, { status: 500 });
  }
}
