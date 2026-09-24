import { DEFAULT_LIMIT, PAGE_SIZES, SORT_OPTIONS } from './constants';
import type { ProductQuery, SortValue } from '@/types/product';

/**
 * URL values are untrusted (anyone can type ?page=abc). Every value is parsed
 * here and falls back to a safe default, so the rest of the app only ever sees
 * valid numbers and known strings.
 */

type ParamSource = { get(name: string): string | null };

export function parsePage(raw: string | null): number {
  if (raw === null || !/^\d+$/.test(raw.trim())) return 1; // "abc", "-2", "1.5" -> 1
  const n = Number(raw);
  return Number.isSafeInteger(n) && n >= 1 ? n : 1; // "0" -> 1
}

export function parseLimit(raw: string | null): number {
  const n = Number(raw);
  return (PAGE_SIZES as readonly number[]).includes(n) ? n : DEFAULT_LIMIT;
}

export function parseSort(raw: string | null): SortValue {
  return SORT_OPTIONS.some((option) => option.value === raw) ? (raw as SortValue) : '';
}

export function parseSearch(raw: string | null): string {
  return (raw ?? '').trim().slice(0, 100);
}

export function parseCategory(raw: string | null): string {
  const value = (raw ?? '').trim();
  return /^[a-z0-9-]{1,60}$/i.test(value) ? value : '';
}

export function parseQuery(source: ParamSource): ProductQuery {
  const q = parseSearch(source.get('q'));
  return {
    page: parsePage(source.get('page')),
    limit: parseLimit(source.get('limit')),
    q,
    // The API cannot search and filter by category together. If a hand-edited
    // URL has both, search wins. See README, "Search + category".
    category: q ? '' : parseCategory(source.get('category')),
    sort: parseSort(source.get('sort')),
  };
}

/** "price-desc" -> { sortBy: "price", order: "desc" } for the API. */
export function splitSort(sort: Exclude<SortValue, ''>) {
  const [sortBy, order] = sort.split('-') as [string, 'asc' | 'desc'];
  return { sortBy, order };
}

/** /products/12 is fine, /products/abc or /products/-5 is a "not found". */
export function parseProductId(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const n = Number(raw);
  return Number.isSafeInteger(n) && n >= 1 ? n : null;
}
