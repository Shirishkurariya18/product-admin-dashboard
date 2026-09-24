'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { LocalChangesProvider } from '@/context/LocalChangesContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LocalChangesProvider>{children}</LocalChangesProvider>
    </AuthProvider>
  );
}
