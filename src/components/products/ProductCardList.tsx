import Link from 'next/link';
import { formatCategory, formatPrice } from '@/lib/format';
import type { Product } from '@/types/product';
import { LocalBadge } from './LocalBadge';
import { ProductImage } from './ProductImage';
import { RatingBadge } from './RatingBadge';
import { RowActions } from './RowActions';
import { StockBadge } from './StockBadge';

interface Props {
  products: Product[];
  onDelete: (product: Product) => void;
}

/** Mobile layout (below md). */
export function ProductCardList({ products, onDelete }: Props) {
  return (
    <ul className="space-y-3 md:hidden">
      {products.map((product) => (
        <li key={product.id} className="rounded-lg border border-stone-200 bg-white p-3">
          <div className="flex gap-3">
            <ProductImage
              src={product.thumbnail}
              alt={product.title}
              className="h-20 w-20 shrink-0 rounded bg-stone-100 object-cover"
            />
            <div className="min-w-0 flex-1">
              <Link href={`/products/${product.id}`} className="font-medium hover:text-teal-700">
                {product.title}
              </Link>
              <LocalBadge id={product.id} />
              <p className="text-xs text-stone-500">{formatCategory(product.category)}</p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span className="font-semibold">{formatPrice(product.price)}</span>
                <RatingBadge rating={product.rating} />
                <StockBadge stock={product.stock} />
              </div>
            </div>
          </div>
          <div className="mt-3">
            <RowActions product={product} onDelete={onDelete} />
          </div>
        </li>
      ))}
    </ul>
  );
}
