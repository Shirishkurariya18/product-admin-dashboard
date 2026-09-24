'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-stone-200 bg-slate-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/products" className="text-base font-semibold text-white hover:text-teal-400">
          Product Admin
        </Link>
        <div className="flex items-center gap-3">
          {user && <span className="hidden text-sm text-slate-300 sm:inline">{user.firstName} {user.lastName}</span>}
          <button type="button" onClick={logout} className="btn-secondary btn-sm">
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
