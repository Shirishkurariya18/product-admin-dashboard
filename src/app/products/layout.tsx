import type { ReactNode } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Header } from '@/components/layout/Header';

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </AuthGuard>
  );
}
