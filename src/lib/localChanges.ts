import { LOCAL_ID_START } from './constants';
import type { Product, ProductInput, ProductQuery, ProductsResponse } from '@/types/product';

/**
 * DummyJSON accepts add/edit/delete calls but never stores them. So the app
 * keeps its own record of what the user changed ("local changes") and merges
 * it into whatever the API returns. This file is the merge logic (pure
 * functions, no React).
 */

export interface DeletedInfo {
  title: string;
  category: string;
}

export interface LocalChanges {
  /** Products created in the UI (ids >= LOCAL_ID_START), newest first. */
  added: Product[];
  /** Full replacement for a server product the user edited, by id. */
  edited: Record<number, Product>;
  /** Server products the user deleted, by id. Only title/category are kept (for counting). */
  deleted: Record<number, DeletedInfo>;
}

export const EMPTY_CHANGES: LocalChanges = { added: [], edited: {}, deleted: {} };

export function isLocalId(id: number): boolean {
  return id >= LOCAL_ID_START;
}

export function buildLocalProduct(id: number, input: ProductInput): Product {
  return {
    id,
    title: input.title,
    description: input.description,
    category: input.category,
    price: input.price,
    stock: input.stock,
    brand: input.brand,
    thumbnail: input.thumbnail,
    images: input.thumbnail ? [input.thumbnail] : [],
    rating: 0,
    reviews: [],
    tags: [],
  };
}

/** Does a locally known product belong in the current search / category view? */
function matchesFilters(item: { title: string; category: string }, q: string, category: string) {
  if (q) return item.title.toLowerCase().includes(q.toLowerCase());
  if (category) return item.category === category;
  return true;
}

/**
 * Apply local changes to one page of API results:
 *  - deleted products disappear
 *  - edited products are replaced
 *  - added products are put at the top of page 1 (if they match search/category)
 *  - `total` is adjusted so the page count and "Showing x-y of N" stay sensible
 *
 * This is an approximation (see README): a page can be one item short after a
 * delete, and page 1 can show a few extra rows after an add.
 */
export function mergeList(data: ProductsResponse, changes: LocalChanges, query: ProductQuery) {
  const addedMatching = changes.added.filter((p) => matchesFilters(p, query.q, query.category));
  const deletedMatching = Object.values(changes.deleted).filter((d) =>
    matchesFilters(d, query.q, query.category),
  ).length;

  let products = data.products.filter((p) => !changes.deleted[p.id]).map((p) => changes.edited[p.id] ?? p);
  if (query.page === 1) products = [...addedMatching, ...products];

  return {
    products,
    total: Math.max(0, data.total + addedMatching.length - deletedMatching),
  };
}

const STORAGE_KEY = 'pad.localChanges';

export function readLocalChanges(): LocalChanges {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_CHANGES;
    const parsed = JSON.parse(raw) as Partial<LocalChanges>;
    if (!Array.isArray(parsed.added) || typeof parsed.edited !== 'object' || typeof parsed.deleted !== 'object') {
      return EMPTY_CHANGES;
    }
    return { added: parsed.added, edited: parsed.edited ?? {}, deleted: parsed.deleted ?? {} };
  } catch {
    return EMPTY_CHANGES;
  }
}

export function writeLocalChanges(changes: LocalChanges) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(changes));
  } catch {
    /* ignore: changes just won't survive a refresh */
  }
}
