'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { setUnauthorizedHandler } from '@/lib/axios';
import { authStorage } from '@/lib/authStorage';
import * as authService from '@/services/authService';
import type { AuthUser } from '@/types/auth';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  /** false until we have read localStorage (avoids a flash of the login page). */
  ready: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ user: AuthUser | null; token: string | null; ready: boolean }>({
    user: null,
    token: null,
    ready: false,
  });

  // Read the saved session once, on the client (localStorage does not exist on the server).
  useEffect(() => {
    setState({ token: authStorage.getToken(), user: authStorage.getUser(), ready: true });
  }, []);

  const logout = useCallback(() => {
    authStorage.clear();
    setState({ user: null, token: null, ready: true });
    // No router call here: AuthGuard sees token === null and redirects to /login.
  }, []);

  // Let the shared Axios instance log us out when the API says 401.
  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const login = useCallback(async (username: string, password: string) => {
    const { token, user } = await authService.login(username, password);
    authStorage.save(token, user);
    setState({ user, token, ready: true });
  }, []);

  const value = useMemo(() => ({ ...state, login, logout }), [state, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
