'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { safeRedirect } from '@/lib/safeRedirect';

export function LoginForm() {
  const router = useRouter();
  const redirectTo = safeRedirect(useSearchParams().get('redirect'));
  const { login, token, ready } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { run, pending, error } = useAsyncAction(() => login(username.trim(), password));

  // Once we have a token (just logged in, or already logged in), leave the login page.
  useEffect(() => {
    if (ready && token) router.replace(redirectTo);
  }, [ready, token, redirectTo, router]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (!username.trim() || !password) return;
    void run();
  }

  const usernameMissing = submitted && !username.trim();
  const passwordMissing = submitted && !password;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="username" className="label">
          Username
        </label>
        <input
          id="username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          aria-invalid={usernameMissing}
          className={usernameMissing ? 'input input-error' : 'input'}
        />
        {usernameMissing && <p className="mt-1 text-xs text-red-600">Enter your username.</p>}
      </div>

      <div>
        <label htmlFor="password" className="label">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={passwordMissing}
          className={passwordMissing ? 'input input-error' : 'input'}
        />
        {passwordMissing && <p className="mt-1 text-xs text-red-600">Enter your password.</p>}
      </div>

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
