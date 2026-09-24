import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-stone-600">This page does not exist.</p>
      <Link href="/products" className="btn-primary mt-6">
        Go to products
      </Link>
    </main>
  );
}
