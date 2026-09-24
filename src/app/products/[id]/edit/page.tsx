import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EditProduct } from '@/components/products/EditProduct';
import { parseProductId } from '@/lib/params';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = parseProductId(id);
  if (productId === null) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link href={`/products/${productId}`} className="text-sm text-teal-700 hover:underline">
        ‹ Back to product
      </Link>
      <h1 className="text-2xl font-semibold">Edit product</h1>
      <EditProduct id={productId} />
    </div>
  );
}
