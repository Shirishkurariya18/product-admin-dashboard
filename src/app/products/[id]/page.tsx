import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/products/ProductDetail';
import { parseProductId } from '@/lib/params';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = parseProductId(id);
  if (productId === null) notFound(); // /products/abc

  return <ProductDetail id={productId} />;
}
