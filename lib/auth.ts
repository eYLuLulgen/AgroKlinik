// Merkezi JWT secret tanımı
// Production'da JWT_SECRET zorunludur, geliştirmede fallback kullanılır
const FALLBACK_SECRET = 'agroklinik-dev-only-secret-change-me';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET ortam değişkeni production modunda zorunludur');
    }
    console.warn('⚠️  JWT_SECRET tanımlı değil, dev secret kullanılıyor. Production\'da .env dosyasına ekleyin.');
    return FALLBACK_SECRET;
  }
  return secret;
}

export const JWT_SECRET = getJwtSecret();
