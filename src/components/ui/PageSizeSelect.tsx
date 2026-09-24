'use client';

import { PAGE_SIZES } from '@/lib/constants';

interface Props {
  value: number;
  onChange: (limit: number) => void;
}

export function PageSizeSelect({ value, onChange }: Props) {
  return (
    <label className="flex items-center gap-2 text-sm text-stone-600">
      Per page
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="input w-auto py-1"
      >
        {PAGE_SIZES.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </label>
  );
}
