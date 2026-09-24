const KEY = 'pad.listSearch';

/** Remember the list's query string so "Back to products" restores page/search/filter. */
export function saveListSearch(search: string) {
  try {
    sessionStorage.setItem(KEY, search);
  } catch {
    /* ignore */
  }
}

export function getListHref(): string {
  try {
    const search = sessionStorage.getItem(KEY) ?? '';
    return search.startsWith('?') ? `/products${search}` : '/products';
  } catch {
    return '/products';
  }
}
