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

/** Desktop layout (md and up). Phones get ProductCardList instead. */
export function ProductTable({ products, onDelete }: Props) {
  return (
    <div className="hidden overflow-x-auto rounded-lg border border-slate-200 bg-white md:block">
      <table className="min-w-full divide-y divide-stone-200 text-sm">
        <thead className="bg-stone-100 text-left font-medium text-slate-600">
          <tr>
            <th scope="col" className="px-4 py-3">Image</th>
            <th scope="col" className="px-4 py-3">Title</th>
            <th scope="col" className="px-4 py-3">Category</th>
            <th scope="col" className="px-4 py-3">Price</th>
            <th scope="col" className="px-4 py-3">Rating</th>
            <th scope="col" className="px-4 py-3">Stock</th>
            <th scope="col" className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-slate-50">
              <td className="px-4 py-2">
                <ProductImage
                  src={product.thumbnail}
                  alt={product.title}
                  className="h-12 w-12 rounded bg-stone-100 object-cover"
                />
              </td>
              <td className="max-w-xs px-4 py-2 font-medium">
                <Link href={`/products/${product.id}`} className="hover:text-teal-700 hover:underline">
                  {product.title}
                </Link>
                <LocalBadge id={product.id} />
              </td>
              <td className="px-4 py-2 text-stone-600">{formatCategory(product.category)}</td>
              <td className="px-4 py-2">{formatPrice(product.price)}</td>
              <td className="px-4 py-2">
                <RatingBadge rating={product.rating} />
              </td>
              <td className="px-4 py-2">
                <StockBadge stock={product.stock} />
              </td>
              <td className="px-4 py-2">
                <RowActions product={product} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
