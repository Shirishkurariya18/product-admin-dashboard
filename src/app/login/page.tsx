import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Loader } from '@/components/ui/Loader';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 bg-white">
      <div className="w-full max-w-sm rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Sign in to Product Admin</h1>
        <p className="mb-6 mt-1 text-sm text-stone-700">
          Demo account: <code className="rounded bg-stone-100 px-1">emilys</code> /{' '}
          <code className="rounded bg-stone-100 px-1">emilyspass</code>
        </p>
        {/* useSearchParams() (used inside LoginForm) needs a Suspense boundary for the production build. */}
        <Suspense fallback={<Loader />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
