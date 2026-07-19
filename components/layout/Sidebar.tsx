'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const menuItems = [
  { href: '/', icon: '🏠', label: 'Ana Sayfa', public: true },
  { href: '/sorun-ekle', icon: '🔬', label: 'Sorun Ekle' },
  { href: '/gecmis', icon: '📊', label: 'Geçmiş Veriler' },
  { href: '/paylasim', icon: '🌐', label: 'Paylaşım Alanı' },
  { href: '/yorumlarim', icon: '💬', label: 'Yorumlarım' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);

  // Giriş yapmamış kullanıcı için: genel sayfalar hariç tıklanan linkler giriş sayfasına yönlendirir
  const handleNavClick = (e: React.MouseEvent, isPublic?: boolean) => {
    if (!isAuthenticated && !isPublic) {
      e.preventDefault();
      router.push('/giris');
    }
  };

  return (
    <>
      {/* Desktop Sidebar - sağda sabit, üzerine gelince yana kayarak genişler */}
      <aside
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`hidden lg:flex flex-col fixed right-0 top-0 h-screen bg-white border-l border-green-100 transition-all duration-300 z-40 ${
          isExpanded ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-green-100">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl">🌱</span>
            </div>
            {isExpanded && (
              <span className="text-xl font-bold text-gray-900 whitespace-nowrap">
                Agro<span className="text-green-600">Klinik</span>
              </span>
            )}
          </Link>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-green-100">
          {isAuthenticated ? (
            <Link href="/hesabim" className={`flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors ${!isExpanded ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                {user?.avatar}
              </div>
              {isExpanded && (
                <div className="overflow-hidden">
                  <p className="font-semibold text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{user?.profession}</p>
                </div>
              )}
            </Link>
          ) : (
            <Link href="/giris" className={`flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors ${!isExpanded ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                👤
              </div>
              {isExpanded && (
                <div className="overflow-hidden">
                  <p className="font-semibold text-gray-900 truncate">Giriş Yap</p>
                  <p className="text-sm text-gray-500 truncate">Hesabınıza erişin</p>
                </div>
              )}
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.public)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-green-600'
                } ${!isExpanded ? 'justify-center' : ''}`}
              >
                <span className="text-xl">{item.icon}</span>
                {isExpanded && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-green-100 space-y-2">
          {isAuthenticated ? (
            <button
              onClick={logout}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 w-full transition-colors ${!isExpanded ? 'justify-center' : ''}`}
            >
              <span className="text-xl">🚪</span>
              {isExpanded && <span className="font-medium whitespace-nowrap">Çıkış Yap</span>}
            </button>
          ) : (
            <Link
              href="/giris"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-green-600 hover:bg-green-50 w-full transition-colors ${!isExpanded ? 'justify-center' : ''}`}
            >
              <span className="text-xl">🔑</span>
              {isExpanded && <span className="font-medium whitespace-nowrap">Giriş Yap</span>}
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-green-100 px-2 py-2 z-50">
        <div className="flex justify-around">
          {menuItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.public)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg ${
                  isActive ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs mt-1">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
