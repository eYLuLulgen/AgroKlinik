'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';

const NO_SIDEBAR_ROUTES = ['/giris', '/kayit'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = NO_SIDEBAR_ROUTES.some((route) => pathname?.startsWith(route));

  if (hideSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Sidebar />
      <main className="lg:mr-20 min-h-screen pb-20 lg:pb-0">
        {children}
      </main>
    </div>
  );
}
