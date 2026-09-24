import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="rounded-lg border border-stone-200 bg-white px-6 py-16 text-center">
      <h1 className="text-xl font-semibold">Product not found</h1>
      <p className="mt-2 text-sm text-stone-600">
        This product does not exist, or it was deleted.
      </p>
      <Link href="/products" className="btn-primary mt-6">
        Back to products
      </Link>
    </div>
  );
}
