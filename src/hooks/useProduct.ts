import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError, getErrorMessage, isCanceled } from '@/lib/axios';
import { isLocalId } from '@/lib/localChanges';
import { useLocalChanges } from '@/context/LocalChangesContext';
import { fetchProduct } from '@/services/productService';
import type { Product } from '@/types/product';

export interface ProductState {
  status: 'loading' | 'ready' | 'notfound' | 'error';
  product: Product | null;
  error: string | null;
}

const LOADING: ProductState = { status: 'loading', product: null, error: null };
const NOT_FOUND: ProductState = { status: 'notfound', product: null, error: null };

/**
 * Loads a single product for the details and edit pages.
 *  - locally added products (big ids) come from local changes only
 *  - server products are fetched, then local edits/deletes are applied on top
 */
export function useProduct(id: number) {
  const { changes, ready } = useLocalChanges();
  const local = isLocalId(id);
  const [remote, setRemote] = useState<ProductState>(LOADING);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (local) return; // nothing to fetch: the API has never heard of this product
    const controller = new AbortController();
    setRemote(LOADING);

    fetchProduct(id, controller.signal)
      .then((product) => {
        if (!controller.signal.aborted) setRemote({ status: 'ready', product, error: null });
      })
      .catch((err) => {
        if (controller.signal.aborted || isCanceled(err)) return;
        if (err instanceof ApiError && err.status === 404) setRemote(NOT_FOUND);
        else setRemote({ status: 'error', product: null, error: getErrorMessage(err) });
      });

    return () => controller.abort();
  }, [id, local, attempt]);

  const state = useMemo<ProductState>(() => {
    if (!ready) return LOADING;
    if (local) {
      const product = changes.added.find((p) => p.id === id);
      return product ? { status: 'ready', product, error: null } : NOT_FOUND;
    }
    if (changes.deleted[id]) return NOT_FOUND;
    if (remote.status === 'ready' && remote.product) {
      return { status: 'ready', product: changes.edited[id] ?? remote.product, error: null };
    }
    return remote;
  }, [ready, local, changes, id, remote]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}
