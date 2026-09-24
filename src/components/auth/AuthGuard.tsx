'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FullPageLoader } from '@/components/ui/Loader';

/**
 * Wraps every /products page. Not logged in -> go to /login (and come back
 * to the same page afterwards). This runs in the browser because the token
 * lives in localStorage.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { token, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !token) {
      const here = pathname + window.location.search;
      router.replace(`/login?redirect=${encodeURIComponent(here)}`);
    }
  }, [ready, token, pathname, router]);

  if (!ready || !token) return <FullPageLoader />;
  return <>{children}</>;
}
