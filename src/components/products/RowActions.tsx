'use client';

import Link from 'next/link';
import type { Product } from '@/types/product';

interface Props {
  product: Product;
  onDelete: (product: Product) => void;
}

export function RowActions({ product, onDelete }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Link href={`/products/${product.id}`} className="btn-secondary btn-sm">
        View
      </Link>
      <Link href={`/products/${product.id}/edit`} className="btn-secondary btn-sm">
        Edit
      </Link>
      <button type="button" onClick={() => onDelete(product)} className="btn-secondary btn-sm text-red-600 hover:bg-red-50 ">
        Delete
      </button>
    </div>
  );
}
