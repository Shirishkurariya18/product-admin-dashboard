'use client';

import { notFound } from 'next/navigation';
import { ErrorState } from '@/components/ui/ErrorState';
import { Loader } from '@/components/ui/Loader';
import { useProduct } from '@/hooks/useProduct';
import { ProductForm } from './ProductForm';

/** Loads the product, then shows the form pre-filled. */
export function EditProduct({ id }: { id: number }) {
  const { status, product, error, retry } = useProduct(id);

  if (status === 'notfound') notFound();
  if (status === 'loading') return <Loader label="Loading product…" />;
  if (status === 'error' || !product) {
    return <ErrorState message={error ?? 'Could not load this product.'} onRetry={retry} />;
  }

  return <ProductForm mode="edit" product={product} />;
}
