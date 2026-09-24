'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useLocalChanges } from '@/context/LocalChangesContext';
import { useProductQuery } from '@/hooks/useProductQuery';
import { useProducts } from '@/hooks/useProducts';
import { saveListSearch } from '@/lib/listUrl';
import { mergeList } from '@/lib/localChanges';
import { getRange, getTotalPages } from '@/lib/pagination';
import type { Product } from '@/types/product';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Loader } from '@/components/ui/Loader';
import { Pagination } from '@/components/ui/Pagination';
import { PageSizeSelect } from '@/components/ui/PageSizeSelect';
import { CategoryFilter } from './CategoryFilter';
import { DeleteProductDialog } from './DeleteProductDialog';
import { ProductCardList } from './ProductCardList';
import { ProductTable } from './ProductTable';
import { SearchBar } from './SearchBar';
import { SortSelect } from './SortSelect';

export function ProductsView() {
  const { query, setPage, setLimit, setSearch, setCategory, setSort, clearFilters } = useProductQuery();
  const { data, loading, error, retry } = useProducts(query);
  const { changes, ready } = useLocalChanges();
  const [toDelete, setToDelete] = useState<Product | null>(null);

  // API data + the user's local add/edit/delete changes.
  const merged = useMemo(() => (data ? mergeList(data, changes, query) : null), [data, changes, query]);

  const total = merged?.total ?? 0;
  const totalPages = getTotalPages(total, query.limit);
  const outOfRange = merged !== null && query.page > totalPages; // e.g. ?page=999

  // ?page=999 -> quietly move to the last real page (replace, so Back still works).
  useEffect(() => {
    if (outOfRange && !loading) setPage(totalPages, 'replace');
  }, [outOfRange, loading, totalPages, setPage]);

  // Remember this list URL so the details page can link "Back to products".
  useEffect(() => {
    saveListSearch(window.location.search);
  }, [query]);

  const hasFilters = Boolean(query.q || query.category || query.sort);
  const { from, to } = getRange(query.page, query.limit, total);

  function renderContent() {
    if (error) return <ErrorState message={error} onRetry={retry} />;
    if (!ready || !merged || outOfRange) return <Loader label="Loading products…" />;
    if (merged.products.length === 0) return <EmptyState hasFilters={hasFilters} onClear={clearFilters} />;

    return (
      <div aria-busy={loading} className={loading ? 'opacity-50 transition-opacity' : 'transition-opacity'}>
        <ProductTable products={merged.products} onDelete={setToDelete} />
        <ProductCardList products={merged.products} onDelete={setToDelete} />
      </div>
    );
  }

  const showFooter = !error && ready && merged !== null && !outOfRange && merged.products.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link href="/products/new" className="btn-primary">
          Add product
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
        <SearchBar value={query.q} onSearch={setSearch} />
        <CategoryFilter value={query.category} onChange={setCategory} />
        <SortSelect value={query.sort} onChange={setSort} />
      </div>
      {/* <p className="text-xs text-stone-500">
        Search and category can&apos;t be combined (the API doesn&apos;t support it), so choosing one clears the other.
      </p> */}

      {renderContent()}

      {showFooter && (
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <p className="text-sm text-stone-600" aria-live="polite">
            Showing {from}–{to} of {total}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <PageSizeSelect value={query.limit} onChange={setLimit} />
            <Pagination page={query.page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      )}

      {toDelete && (
        <DeleteProductDialog
          product={toDelete}
          onClose={() => setToDelete(null)}
          onDeleted={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
