import { api } from '@/lib/axios';
import type { AuthUser, LoginResponse } from '@/types/auth';

export async function login(username: string, password: string): Promise<{ token: string; user: AuthUser }> {
  const { data } = await api.post<LoginResponse>('/auth/login', {
    username,
    password,
    expiresInMins: 60,
  });

  const { accessToken, refreshToken: _refreshToken, ...user } = data;
  void _refreshToken;
  return { token: accessToken, user };
}
