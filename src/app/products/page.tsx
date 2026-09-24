import { Suspense } from 'react';
import { ProductsView } from '@/components/products/ProductsView';
import { Loader } from '@/components/ui/Loader';

export default function ProductsPage() {
  // useSearchParams() (inside ProductsView) needs a Suspense boundary for the production build.
  return (
    <Suspense fallback={<Loader label="Loading products…" />}>
      <ProductsView />
    </Suspense>
  );
}
