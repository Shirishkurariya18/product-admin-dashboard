import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage, isCanceled } from '@/lib/axios';
import { fetchProducts } from '@/services/productService';
import type { ProductQuery, ProductsResponse } from '@/types/product';

interface State {
  data: ProductsResponse | null;
  loading: boolean;
  error: string | null;
}

/**
 * Loads one page of products for the given query.
 *
 * Race-condition rule: an old response must never replace a newer one.
 * Each effect run owns an AbortController. When the query changes (or the
 * component unmounts) React runs the cleanup, which aborts the previous
 * request. As a second safety net we also check `signal.aborted` before
 * calling setState.
 */
export function useProducts(query: ProductQuery) {
  const [state, setState] = useState<State>({ data: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0); // bumped by "Retry"
  const { q, category, sort, page, limit } = query;

  useEffect(() => {
    const controller = new AbortController();
    // Keep the old data on screen (dimmed) while the new page loads.
    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetchProducts({ q, category, sort, page, limit }, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (controller.signal.aborted || isCanceled(err)) return; // superseded, not a real error
        setState({ data: null, loading: false, error: getErrorMessage(err) });
      });

    return () => controller.abort();
  }, [q, category, sort, page, limit, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, retry };
}
