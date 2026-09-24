import axios from 'axios';
import { API_BASE_URL } from './constants';
import { authStorage } from './authStorage';

/**
 * The ONE shared Axios setup. Nothing else in the app imports `axios` to make
 * requests, so auth and error handling live here and nowhere else.
 */

/** Every failed request leaves this file as an ApiError with a readable message. */
export class ApiError extends Error {
  status?: number;
  isNetworkError: boolean;

  constructor(message: string, status?: number, isNetworkError = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isNetworkError = isNetworkError;
  }
}

/** AuthContext registers a callback here so a 401 can log the user out. */
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

/**
 * Testing hook for the "old search results must never replace new ones" rule:
 * open any page with `?delay=2000` and every API call is slowed by 2s
 * (DummyJSON supports a `delay` query param).
 */
function getDebugDelay(): string | null {
  if (typeof window === 'undefined') return null;
  const value = new URLSearchParams(window.location.search).get('delay');
  return value && /^\d{1,4}$/.test(value) ? value : null;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// 1) Add the login token to every request.
api.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) config.headers.set('Authorization', `Bearer ${token}`);

  const delay = getDebugDelay();
  if (delay) config.params = { ...config.params, delay };

  return config;
});

// 2) Turn every failure into an ApiError, in one place.
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // Cancelled requests are not failures: callers check isCanceled() and ignore them.
    if (axios.isCancel(error)) return Promise.reject(error);

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        const message =
          error.code === 'ECONNABORTED'
            ? 'The request timed out. Please try again.'
            : 'Cannot reach the server. Check your connection and try again.';
        return Promise.reject(new ApiError(message, undefined, true));
      }

      const { status, data } = error.response;
      const isLoginCall = error.config?.url?.includes('/auth/login');

      // Expired or invalid token: log out. A wrong password on the login form
      // is also an error, but it must NOT trigger a logout redirect.
      if (status === 401 && !isLoginCall) onUnauthorized?.();

      const serverMessage = (data as { message?: string } | undefined)?.message;
      return Promise.reject(new ApiError(serverMessage ?? `Request failed (${status}).`, status));
    }

    return Promise.reject(error);
  },
);

export function isCanceled(error: unknown): boolean {
  return axios.isCancel(error);
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return 'Something went wrong. Please try again.';
}
