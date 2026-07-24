# 🌱 AgroKlinik

AI destekli bitki sağlığı platformu. Bitki fotoğraflarınızı yükleyin, yapay zeka hastalıkları teşhis etsin, toplulukla paylaşın ve tedavi süreçlerinizi takip edin.

## Özellikler

- **AI Teşhis** — Bitki fotoğrafı yükleyin, hastalık tespiti alın (15+ hastalık veritabanı, opsiyonel gerçek API entegrasyonu)
- **Kullanıcı Sistemi** — Kayıt/giriş, JWT tabanlı kimlik doğrulama, profil yönetimi
- **Topluluk** — Paylaşım akışı, yorumlar, beğeniler
- **Geçmiş Takip** — Analiz geçmişi, ilerleme kayıtları, istatistikler
- **Güvenlik** — Rate limiting, girdi doğrulama, güvenlik başlıkları

## Kurulum

### Gereksinimler
- Node.js 18+
- npm

### Adımlar

```bash
# 1. Repoyu klonlayın
git clone https://github.com/eYLuLulgen/AgroKlinik.git
cd AgroKlinik

# 2. Bağımlılıkları yükle (prisma generate otomatik çalışır)
npm install

# 3. Ortam değişkenlerini ayarla
cp .env.example .env
# .env dosyasını düzenleyin (özellikle JWT_SECRET)

# 4. Veritabanını kur (tablo + test verisi)
npm run db:setup

# 5. Uygulamayı başlat
npm run dev
```

Uygulama `http://localhost:3000` adresinde açılır.

## Test Hesapları

| Kullanıcı | Şifre    | Meslek           |
|-----------|----------|------------------|
| demo      | demo123  | Çiftçi           |
| uzman     | uzman123 | Ziraat Mühendisi |

## Ortam Değişkenleri

`.env` dosyasında aşağıdaki değişkenleri ayarlayın:

| Değişken       | Zorunlu | Açıklama                                      |
|----------------|---------|-----------------------------------------------|
| `DATABASE_URL`  | Evet    | SQLite bağlantı: `file:./dev.db`              |
| `JWT_SECRET`    | Evet    | JWT imzalama anahtarı (güçlü bir değer kullanın) |
| `PLANT_API_KEY` | Hayır   | Bitki tanıma API anahtarı (Plant.id vb.)        |

## AI Analiz Sistemi

AgroKlinik'in AI analiz sistemi iki modda çalışır:

### 1. Yerel Mod (varsayılan)
`PLANT_API_KEY` ayarlı değilse, 15+ hastalık içeren yerel veritabanı kullanılır. Her hastalık için:
- Teşhis adı
- Şiddet derecesi (düşük/orta/yüksek)
- Çözüm önerileri
- Önleme tavsiyeleri
- Etkilenen bitki türleri

### 2. Gerçek API Modu
`PLANT_API_KEY` ayarlıysa, [Plant.id API](https://web.plant.id/) çağrılır ve gerçek teşhis sonuçları alınır.

## Klasör Yapısı

```
AgroKlinik/
├── app/                    # Next.js App Router
│   ├── (protected)/       # Giriş gerektiren sayfalar
│   ├── api/               # API route'ları
│   ├── giris/             # Giriş sayfası
│   └── kayit/            # Kayıt sayfası
├── components/            # React bileşenleri
├── lib/                   # Yardımcı kütüphaneler
│   ├── ai-analysis.ts     # AI analiz motoru
│   ├── auth.ts            # JWT secret
│   ├── db.ts              # Prisma client
│   ├── storage.ts         # Görsel depolama
│   └── validation.ts      # Girdi doğrulama
├── prisma/                # Veritabanı şeması
├── public/                # Statik dosyalar
│   └── uploads/           # Kullanıcı görselleri (gitignore edilir)
├── scripts/               # Yardımcı script'ler
│   └── seed.mjs           # Test verisi oluşturma
└── store/                 # Zustand state yönetimi
```

## Teknolojiler

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js API Routes (Turbopack)
- **Veritabanı**: SQLite (Prisma ORM)
- **Kimlik Dorulama**: JWT + bcrypt
- **State**: Zustand
- **AI**: Pluggable (yerel veritabanı / Plant.id API)

## Production Dağıtım Notları

- **Veritabanı**: SQLite yerel kullanım içindir. Production için PostgreSQL veya MySQL'e geçin (`prisma/schema.prisma` provider değiştir + `DATABASE_URL` güncelle)
- **Görsel Depolama**: `public/uploads/` yerel disk kullanır. Production için S3, Cloudinary veya Vercel Blob kullanın (`lib/storage.ts` güncelle)
- **JWT Secret**: `.env` dosyasında güçlü bir secret kullanın, asla koda gömmeyin
- **AI API**: Gerçek teşhis için `PLANT_API_KEY` ayarlayın

## Komutlar

| Komut              | Açıklama                                    |
|--------------------|---------------------------------------------|
| `npm run dev`      | Geliştirme sunucusunu başlat                |
| `npm run build`    | Production build                            |
| `npm run start`    | Production sunucusunu başlat                |
| `npm run db:setup` | Veritabanı kur + test verisi yükle          |
| `npm run seed`     | Sadece test verisi yükle                    |
| `npm run db:push`  | Şemayı veritabanına uygula                  |

## Lisans

MIT
