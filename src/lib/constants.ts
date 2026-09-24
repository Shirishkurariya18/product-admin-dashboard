import type { SortValue } from '@/types/product';

export const API_BASE_URL = 'https://dummyjson.com';

export const PAGE_SIZES = [10, 20, 50] as const;
export const DEFAULT_LIMIT = 10;

export const SEARCH_DEBOUNCE_MS = 400;

/**
 * Products added in the UI never reach the server, so they get ids from this
 * range. Real DummyJSON ids are small (1..~200), so the two can never clash.
 */
export const LOCAL_ID_START = 1_000_000;

export const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: '', label: 'Default order' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating-desc', label: 'Rating: high to low' },
  { value: 'rating-asc', label: 'Rating: low to high' },
  { value: 'title-asc', label: 'Title: A to Z' },
  { value: 'title-desc', label: 'Title: Z to A' },
];
