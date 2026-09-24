'use client';

import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ErrorState } from '@/components/ui/ErrorState';
import { Loader } from '@/components/ui/Loader';
import { useProduct } from '@/hooks/useProduct';
import { formatCategory, formatPrice } from '@/lib/format';
import { getListHref } from '@/lib/listUrl';
import { BackLink } from './BackLink';
import { DeleteProductDialog } from './DeleteProductDialog';
import { LocalBadge } from './LocalBadge';
import { ProductGallery } from './ProductGallery';
import { RatingBadge } from './RatingBadge';
import { ReviewList } from './ReviewList';
import { StockBadge } from './StockBadge';

export function ProductDetail({ id }: { id: number }) {
  const router = useRouter();
  const { status, product, error, retry } = useProduct(id);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Renders app/products/not-found.tsx (API said 404, or the product was deleted locally).
  if (status === 'notfound') notFound();
  if (status === 'loading') return <Loader label="Loading product…" />;
  if (status === 'error' || !product) {
    return <ErrorState message={error ?? 'Could not load this product.'} onRetry={retry} />;
  }

  const facts: [string, string | undefined][] = [
    ['Brand', product.brand],
    ['SKU', product.sku],
    ['Availability', product.availabilityStatus],
    ['Shipping', product.shippingInformation],
    ['Warranty', product.warrantyInformation],
    ['Returns', product.returnPolicy],
    ['Minimum order', product.minimumOrderQuantity ? String(product.minimumOrderQuantity) : undefined],
  ];

  return (
    <div className="space-y-6">
      <BackLink />

      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery images={product.images} title={product.title} />

        <div className="space-y-4">
          <div>
            <p className="text-sm text-stone-500">{formatCategory(product.category)}</p>
            <h1 className="text-2xl font-semibold">
              {product.title}
              <LocalBadge id={product.id} />
            </h1>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="text-3xl font-semibold">{formatPrice(product.price)}</span>
            {product.discountPercentage ? (
              <span className="text-sm font-medium text-emerald-700">
                {product.discountPercentage.toFixed(0)}% off
              </span>
            ) : null}
            <RatingBadge rating={product.rating} />
            <StockBadge stock={product.stock} />
          </div>

          <p className="text-stone-700">{product.description}</p>

          {product.tags && product.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <li key={tag} className="rounded-full bg-stone-200 px-2.5 py-0.5 text-xs text-stone-700">
                  {tag}
                </li>
              ))}
            </ul>
          )}

          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
            {facts
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-stone-500">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
          </dl>

          <div className="flex gap-2 pt-2">
            <Link href={`/products/${product.id}/edit`} className="btn-primary">
              Edit
            </Link>
            <button type="button" onClick={() => setConfirmingDelete(true)} className="btn-secondary text-red-700">
              Delete
            </button>
          </div>
        </div>
      </div>

      <section aria-labelledby="reviews-heading" className="space-y-3">
        <h2 id="reviews-heading" className="text-lg font-semibold">
          Reviews ({product.reviews?.length ?? 0})
        </h2>
        <ReviewList reviews={product.reviews ?? []} />
      </section>

      {confirmingDelete && (
        <DeleteProductDialog
          product={product}
          onClose={() => setConfirmingDelete(false)}
          onDeleted={() => router.replace(getListHref())}
        />
      )}
    </div>
  );
}
