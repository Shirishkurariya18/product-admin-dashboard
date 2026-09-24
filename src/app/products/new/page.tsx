import Link from 'next/link';
import { ProductForm } from '@/components/products/ProductForm';

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link href="/products" className="text-sm text-teal-700 hover:underline">
        ‹ Back to products
      </Link>
      <h1 className="text-2xl font-semibold">Add product</h1>
      <ProductForm mode="create" />
    </div>
  );
}
