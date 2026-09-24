'use client';

import { SORT_OPTIONS } from '@/lib/constants';
import type { SortValue } from '@/types/product';

interface Props {
  value: SortValue;
  onChange: (sort: SortValue) => void;
}

export function SortSelect({ value, onChange }: Props) {
  return (
    <div>
      <label htmlFor="sort" className="sr-only">
        Sort by
      </label>
      <select id="sort" value={value} onChange={(e) => onChange(e.target.value as SortValue)} className="input">
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
