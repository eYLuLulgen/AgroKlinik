# AgroKlinik 🌱

AI destekli bitki sağlığı platformu. Bitki fotoğrafı yükleyin, yapay zeka hastalık teşhisi alsın, toplulukla paylaşın ve tedavi süreçlerini takip edin.

## Özellikler

- **AI Teşhis** — Bitki fotoğrafı yükleyin, hastalık teşhisi ve çözüm önerileri alın
- **Topluluk** — Deneyimlerinizi paylaşın, diğer kullanıcıların sorunlarına yorum yapın
- **Geçmiş Takip** — Tüm analizlerinizi görüntüleyin, tedavi ilerlemesini kaydedin
- **Kullanıcı Profilleri** — Meslek, konum ve uzmanlık bilgisi ile profil

## Teknoloji

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js API Routes (App Router)
- **Veritabanı**: Prisma 7 + SQLite
- **Kimlik Dorulama**: JWT + bcrypt
- **State Yönetimi**: Zustand
- **Görsel Depolama**: Disk tabanlı (`public/uploads/`)

## Kurulum

### 1. Bağımlılıkları yükle
```bash
npm install
```

### 2. Ortam değişkenlerini ayarla
```bash
cp .env.example .env
```
`.env` dosyasını düzenleyin:
- `DATABASE_URL` — SQLite dosya yolu (varsayılan: `file:./dev.db`)
- `JWT_SECRET` — JWT imzalama anahtarı (production'da mutlaka değiştirin)
- `PLANT_API_KEY` — (opsiyonel) Gerçek bitki tanıma API anahtarı

### 3. Veritabanını kur
```bash
npm run db:setup
```
Bu komut:
1. Tabloları oluşturur (`prisma db push`)
2. Prisma Client'ı üretir (`prisma generate`)
3. Test verilerini yükler (`seed`)

### 4. Uygulamayı başlat
```bash
npm run dev
```
Uygulama `http://localhost:3000` adresinde açılır.

## Test Hesapları

| Kullanıcı | Şifre   | Meslek           |
|-----------|---------|------------------|
| demo      | demo123 | Çiftçi           |
| uzman     | uzman123| Ziraat Mühendisi |

## Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production build |
| `npm run db:setup` | Veritabanı kur + seed |
| `npm run db:push` | Tabloları senkronize et |
| `npm run seed` | Test verisini yükle |
| `npm run lint` | ESLint kontrolü |

## API Endpoints

### Kimlik Doğrulama
- `POST /api/auth/register` — Kayıt ol
- `POST /api/auth/login` — Giriş yap
- `GET /api/auth/me` — Mevcut kullanıcı bilgisi

### Analiz
- `POST /api/analysis` — Görsel yükle ve analiz et (auth gerekli)
- `GET /api/analysis` — Kullanıcının analizlerini getir (auth gerekli)
- `GET /api/analysis/[id]` — Tekil analiz detayı (auth gerekli)
- `POST /api/analysis/[id]/progress` — İlerleme kaydı ekle (auth gerekli)

### Paylaşımlar
- `GET /api/posts` — Tüm public paylaşımlar
- `GET /api/posts/[id]` — Tekil paylaşım detayı
- `DELETE /api/posts/[id]` — Paylaşım sil (auth gerekli, sahip olmalı)
- `POST /api/posts/[id]/comments` — Yorum ekle (auth gerekli)
- `GET /api/posts/[id]/comments` — Yorumları getir
- `POST /api/posts/[id]/like` — Beğeni toggle (auth gerekli)

### Kullanıcı
- `PUT /api/users/me` — Profil güncelle (auth gerekli)
- `DELETE /api/users/me` — Hesap sil (auth gerekli)
- `GET /api/users/me/comments` — Kullanıcının yorumları (auth gerekli)

### İstatistik
- `GET /api/stats` — Kullanıcı istatistikleri (auth gerekli)

## Güvenlik

- JWT tabanlı kimlik doğrulama (7 gün geçerli)
- bcrypt ile şifre hashleme (12 rounds)
- Rate limiting (dakikada 60 istek per IP)
- Güvenlik başlıkları (X-Frame-Options, X-Content-Type-Options, vb.)
- Girdi doğrulama ve sanitizasyon
- Dosya yükleme doğrulama (tip + boyut kontrolü)
- Production'da JWT_SECRET zorunluluğu

## Production Dağıtımı

### Güvenlik kontrol listesi
- [ ] `.env` dosyasında güçlü bir `JWT_SECRET` ayarlayın (en az 32 karakter)
- [ ] `NODE_ENV=production` ayarlayın
- [ ] `PLANT_API_KEY` ile gerçek bitki tanıma API'sine geçin (opsiyonel)
- [ ] Görsel depolama için cloud storage (S3, Cloudinary) kullanın
- [ ] SQLite yerine PostgreSQL/MySQL'e geçin (çok kullanıcılı için)
- [ ] HTTPS kullanın
- [ ] Rate limiting için Redis kullanın (çok sunuculu kurulumda)

### Prisma'ı PostgreSQL'e geçirme
1. `prisma/schema.prisma` dosyasında `provider = "sqlite"` satırını `provider = "postgresql"` olarak değiştirin
2. `.env` dosyasında `DATABASE_URL`'i PostgreSQL bağlantı adresi ile değiştirin
3. `lib/db.ts` dosyasında driver adapter'ı `@prisma/adapter-pg` ile değiştirin
4. `npm run db:setup` çalıştırın

## Proje Yapısı

```
agroklinik/
├─ app/
│  ├─ (protected)/          # Giriş gerektiren sayfalar
│  │  ├─ sorun-ekle/        # AI analiz sayfası
│  │  ├─ gecmis/            # Geçmiş analizler
│  │  ├─ paylasim/          # Topluluk paylaşımları
│  │  ├─ hesabim/           # Profil ayarları
│  │  └─ yorumlarim/        # Kullanıcının yorumları
│  ├─ giris/                # Giriş sayfası
│  ├─ kayit/                # Kayıt sayfası
│  ├─ api/                  # API route'ları
│  └─ layout.tsx            # Root layout
├─ components/
│  ├─ auth/                 # AuthGuard
│  ├─ feed/                 # PostFeed
│  └─ layout/               # Sidebar, Header, AppShell
├─ lib/
│  ├─ ai-analysis.ts        # Hastalık teşhis (pluggable)
│  ├─ auth.ts               # JWT secret
│  ├─ db.ts                 # Prisma client
│  ├─ storage.ts            # Görsel depolama
│  └─ validation.ts         # Girdi doğrulama
├─ middleware.ts            # Rate limiting + güvenlik başlıkları
├─ prisma/
│  ├─ schema.prisma         # Veritabanı şeması
│  └─ dev.db                # SQLite veritabanı
├─ scripts/
│  └─ seed.mjs              # Test verisi
└─ store/
   ├─ authStore.ts          # Auth state
   └─ analysisStore.ts      # Analiz state
```

## Lisans

MIT
