'use client';

interface Props {
  hasFilters: boolean;
  onClear: () => void;
}

export function EmptyState({ hasFilters, onClear }: Props) {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-orange-100 px-6 py-14 text-center">
      <h2 className="text-base font-semibold">No products found</h2>
      <p className="mt-1 text-sm text-stone-500">
        {hasFilters ? 'Try a different search, or remove the filters.' : 'There are no products to show yet.'}
      </p>
      {hasFilters && (
        <button type="button" onClick={onClear} className="btn-secondary mt-4">
          Clear filters
        </button>
      )}
    </div>
  );
}
