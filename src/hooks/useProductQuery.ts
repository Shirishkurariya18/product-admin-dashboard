import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DEFAULT_LIMIT } from '@/lib/constants';
import { parseQuery } from '@/lib/params';
import type { SortValue } from '@/types/product';

type NavMode = 'push' | 'replace';

/** Set a param, or remove it when it equals the default (keeps URLs short and clean). */
function setParam(params: URLSearchParams, key: string, value: string, defaultValue = '') {
  if (value === '' || value === defaultValue) params.delete(key);
  else params.set(key, value);
}

/**
 * The URL is the single source of truth for page / limit / search / category / sort.
 *  - reading:  parse the URL into a safe ProductQuery
 *  - writing:  every setter edits the URL; the page re-renders from the new URL
 * Refresh, back button and shared links therefore all work for free.
 */
export function useProductQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  const query = useMemo(() => parseQuery(new URLSearchParams(search)), [search]);

  const update = useCallback(
    (mutate: (params: URLSearchParams) => void, mode: NavMode = 'push') => {
      // Start from the current URL so unrelated params (like ?delay=2000) are kept.
      const params = new URLSearchParams(search);
      mutate(params);
      const qs = params.toString();
      router[mode](qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, search],
  );

  const setPage = useCallback(
    (page: number, mode: NavMode = 'push') => update((p) => setParam(p, 'page', String(page), '1'), mode),
    [update],
  );

  const setLimit = useCallback(
    (limit: number) =>
      update((p) => {
        setParam(p, 'limit', String(limit), String(DEFAULT_LIMIT));
        p.delete('page');
      }),
    [update],
  );

  // Typing replaces the history entry (so Back doesn't step through every keystroke).
  // A new search always goes back to page 1, and clears the category (API limitation).
  const setSearch = useCallback(
    (q: string) =>
      update((p) => {
        setParam(p, 'q', q.trim());
        if (q.trim()) p.delete('category');
        p.delete('page');
      }, 'replace'),
    [update],
  );

  const setCategory = useCallback(
    (category: string) =>
      update((p) => {
        setParam(p, 'category', category);
        if (category) p.delete('q');
        p.delete('page');
      }),
    [update],
  );

  const setSort = useCallback(
    (sort: SortValue) =>
      update((p) => {
        setParam(p, 'sort', sort);
        p.delete('page');
      }),
    [update],
  );

  const clearFilters = useCallback(
    () =>
      update((p) => {
        ['q', 'category', 'sort', 'page'].forEach((key) => p.delete(key));
      }),
    [update],
  );

  return { query, setPage, setLimit, setSearch, setCategory, setSort, clearFilters };
}
