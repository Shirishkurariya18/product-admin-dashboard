'use client';

import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants';

interface Props {
  /** The search text currently in the URL. */
  value: string;
  onSearch: (q: string) => void;
}

/**
 * The input keeps its own `text` so typing is instant. The URL is only updated
 * after the user pauses (debounce), so we don't call the API on every keystroke.
 *
 * `lastCommitted` remembers the last value we and the URL agreed on. It stops
 * two bugs: (1) the URL echoing back an older value and overwriting what the
 * user is still typing, (2) a stale debounced value re-submitting after the
 * URL was changed elsewhere (e.g. by picking a category, which clears search).
 */
export function SearchBar({ value, onSearch }: Props) {
  const [text, setText] = useState(value);
  const debounced = useDebounce(text.trim(), SEARCH_DEBOUNCE_MS);
  const lastCommitted = useRef(value);

  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  });

  // typing (debounced) -> URL
  useEffect(() => {
    if (debounced !== lastCommitted.current) {
      lastCommitted.current = debounced;
      onSearchRef.current(debounced);
    }
  }, [debounced]);

  // URL changed from outside (back button, category picked, "Clear filters") -> input
  useEffect(() => {
    if (value !== lastCommitted.current) {
      lastCommitted.current = value;
      setText(value);
    }
  }, [value]);

  function clear() {
    setText('');
    lastCommitted.current = '';
    onSearch('');
  }

  return (
    <div className="relative">
      <label htmlFor="search" className="sr-only">
        Search products
      </label>
      <input
        id="search"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search products…"
        maxLength={100}
        autoComplete="off"
        className="input pr-9"
      />
      {text && (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-1 text-stone-400 hover:text-stone-700"
        >
          ×
        </button>
      )}
    </div>
  );
}
