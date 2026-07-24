import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Veritabanı seed işlemi başlıyor...\n');

  // Önce mevcut verileri temizle
  await prisma.progressLog.deleteMany();
  await prisma.postLike.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.analysis.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('demo123', 10);

  const demoUser = await prisma.user.create({
    data: {
      username: 'demo',
      email: 'demo@agroklinik.com',
      password,
      firstName: 'Demo',
      lastName: 'Çiftçi',
      profession: 'Çiftçi',
      location: 'İstanbul',
      avatar: '👨‍🌾',
    },
  });

  const expertUser = await prisma.user.create({
    data: {
      username: 'uzman',
      email: 'uzman@agroklinik.com',
      password: await bcrypt.hash('uzman123', 10),
      firstName: 'Zeynep',
      lastName: 'Mühendis',
      profession: 'Ziraat Mühendisi',
      location: 'İzmir',
      avatar: '🌾',
    },
  });

  // Örnek bir analiz
  const analysis = await prisma.analysis.create({
    data: {
      userId: demoUser.id,
      imageUrl: '🌱',
      diagnosis: 'Yaprak Yanıklığı (Fungal Enfeksiyon)',
      solutions: JSON.stringify([
        'Enfekte yaprakları hemen budayın ve imha edin',
        'Bakır bazlı fungisit uygulayın (7-10 gün arayla 3 uygulama)',
        'Sulama sıklığını azaltın, yaprakları ıslatmaktan kaçının',
      ]),
      isPublic: true,
      status: 'çözüldü',
    },
  });

  // Örnek bir paylaşım
  await prisma.post.create({
    data: {
      userId: demoUser.id,
      analysisId: analysis.id,
      plantName: 'Domates',
      description: 'Domatesimin yapraklarında bu lekeleri fark ettim. Bakır sülfat ile çözdüm.',
      imageUrl: '🍅',
      status: 'çözüldü',
      likes: 5,
    },
  });

  // Uzmandan bir yorum
  const post = await prisma.post.findFirst();
  if (post) {
    await prisma.comment.create({
      data: {
        content: 'Teşhis doğru görünüyor, bakır bazlı fungisit en iyi çözüm.',
        userId: expertUser.id,
        postId: post.id,
      },
    });
  }

  console.log('✅ Seed tamamlandı!\n');
  console.log('Test hesapları:');
  console.log('  ┌────────────┬──────────┬─────────────┐');
  console.log('  │ Kullanıcı  │ Şifre    │ Meslek      │');
  console.log('  ├────────────┼──────────┼─────────────┤');
  console.log('  │ demo       │ demo123  │ Çiftçi      │');
  console.log('  │ uzman      │ uzman123 │ Z.Mühendis  │');
  console.log('  └────────────┴──────────┴─────────────┘');
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
