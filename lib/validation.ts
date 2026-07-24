// Girdi doğrulama yardımcıları

export function validateEmail(email: string): { valid: boolean; message?: string } {
  if (!email) return { valid: false, message: 'Email zorunludur' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, message: 'Geçerli bir email adresi girin' };
  }
  if (email.length > 254) {
    return { valid: false, message: 'Email çok uzun' };
  }
  return { valid: true };
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (!password) return { valid: false, message: 'Şifre zorunludur' };
  if (password.length < 6) {
    return { valid: false, message: 'Şifre en az 6 karakter olmalı' };
  }
  if (password.length > 128) {
    return { valid: false, message: 'Şifre çok uzun' };
  }
  return { valid: true };
}

export function validateUsername(username: string): { valid: boolean; message?: string } {
  if (!username) return { valid: false, message: 'Kullanıcı adı zorunludur' };
  if (username.length < 3) {
    return { valid: false, message: 'Kullanıcı adı en az 3 karakter olmalı' };
  }
  if (username.length > 30) {
    return { valid: false, message: 'Kullanıcı adı 30 karakteri geçemez' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, message: 'Sadece harf, rakam ve alt çizgi kullanılabilir' };
  }
  return { valid: true };
}

export function validateName(name: string, field: string): { valid: boolean; message?: string } {
  if (!name || !name.trim()) {
    return { valid: false, message: `${field} zorunludur` };
  }
  if (name.length > 50) {
    return { valid: false, message: `${field} 50 karakteri geçemez` };
  }
  return { valid: true };
}

export function sanitizeInput(input: string): string {
  return input.trim().slice(0, 1000);
}

export function validateCommentContent(content: string): { valid: boolean; message?: string } {
  if (!content || !content.trim()) {
    return { valid: false, message: 'Yorum içeriği boş olamaz' };
  }
  if (content.length > 500) {
    return { valid: false, message: 'Yorum 500 karakteri geçemez' };
  }
  return { valid: true };
}
