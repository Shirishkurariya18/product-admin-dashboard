'use client';

import { useCategories } from '@/hooks/useCategories';
import { formatCategory } from '@/lib/format';

interface Props {
  value: string;
  onChange: (category: string) => void;
}

export function CategoryFilter({ value, onChange }: Props) {
  const { categories, status } = useCategories();

  return (
    <div>
      <label htmlFor="category" className="sr-only">
        Category
      </label>
      <select
        id="category"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={status === 'error'}
        className="input"
      >
        <option value="">{status === 'error' ? 'Categories unavailable' : 'All categories'}</option>
        {/* Keep the URL's category selectable even before the list has loaded. */}
        {value && !categories.some((c) => c.slug === value) && (
          <option value={value}>{formatCategory(value)}</option>
        )}
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
