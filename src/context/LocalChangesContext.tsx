'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { LOCAL_ID_START } from '@/lib/constants';
import {
  buildLocalProduct,
  EMPTY_CHANGES,
  isLocalId,
  readLocalChanges,
  writeLocalChanges,
  type LocalChanges,
} from '@/lib/localChanges';
import type { Product, ProductInput } from '@/types/product';

interface LocalChangesContextValue {
  changes: LocalChanges;
  /** false until sessionStorage has been read (so we never merge half-loaded data). */
  ready: boolean;
  addProduct: (input: ProductInput) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (product: Product) => void;
}

const LocalChangesContext = createContext<LocalChangesContextValue | null>(null);

export function LocalChangesProvider({ children }: { children: ReactNode }) {
  const [changes, setChanges] = useState<LocalChanges>(EMPTY_CHANGES);
  const [ready, setReady] = useState(false);
  const nextId = useRef(LOCAL_ID_START);

  useEffect(() => {
    const saved = readLocalChanges();
    nextId.current = Math.max(LOCAL_ID_START, ...saved.added.map((p) => p.id + 1));
    setChanges(saved);
    setReady(true);
  }, []);

  // Keep sessionStorage in sync so changes survive a page refresh.
  useEffect(() => {
    if (ready) writeLocalChanges(changes);
  }, [changes, ready]);

  const addProduct = useCallback((input: ProductInput) => {
    const product = buildLocalProduct(nextId.current++, input);
    setChanges((c) => ({ ...c, added: [product, ...c.added] }));
    return product;
  }, []);

  const updateProduct = useCallback((product: Product) => {
    setChanges((c) =>
      isLocalId(product.id)
        ? { ...c, added: c.added.map((p) => (p.id === product.id ? product : p)) }
        : { ...c, edited: { ...c.edited, [product.id]: product } },
    );
  }, []);

  const deleteProduct = useCallback((product: Product) => {
    setChanges((c) => {
      if (isLocalId(product.id)) {
        return { ...c, added: c.added.filter((p) => p.id !== product.id) };
      }
      const edited = { ...c.edited };
      delete edited[product.id];
      return {
        ...c,
        edited,
        deleted: { ...c.deleted, [product.id]: { title: product.title, category: product.category } },
      };
    });
  }, []);

  const value = useMemo(
    () => ({ changes, ready, addProduct, updateProduct, deleteProduct }),
    [changes, ready, addProduct, updateProduct, deleteProduct],
  );

  return <LocalChangesContext.Provider value={value}>{children}</LocalChangesContext.Provider>;
}

export function useLocalChanges(): LocalChangesContextValue {
  const ctx = useContext(LocalChangesContext);
  if (!ctx) throw new Error('useLocalChanges must be used inside <LocalChangesProvider>');
  return ctx;
}
