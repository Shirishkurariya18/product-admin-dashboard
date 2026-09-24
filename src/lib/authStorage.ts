import type { AuthUser } from '@/types/auth';

const TOKEN_KEY = 'pad.token';
const USER_KEY = 'pad.user';

/**
 * The only file that touches localStorage for auth. Every access is wrapped in
 * try/catch because storage can be unavailable (private mode, SSR, quota).
 */
export const authStorage = {
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  getUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  },

  save(token: string, user: AuthUser) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      /* storage unavailable: the user just has to log in again next time */
    }
  },

  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      /* nothing to do */
    }
  },
};
