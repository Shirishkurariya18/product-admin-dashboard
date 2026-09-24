import { useMemo } from 'react';
import { useLocalChanges } from '@/context/LocalChangesContext';
import { isLocalId } from '@/lib/localChanges';
import { createProductRemote, deleteProductRemote, updateProductRemote } from '@/services/productService';
import type { Product, ProductInput } from '@/types/product';

/**
 * Add / edit / delete.
 * 1. Call the real API endpoint (so loading, errors and double-click protection are real).
 * 2. DummyJSON does not save anything, so ALSO record the change locally.
 * Products created locally are unknown to the API, so we skip the API call for them.
 */
export function useProductActions() {
  const { addProduct, updateProduct, deleteProduct } = useLocalChanges();

  return useMemo(
    () => ({
      async create(input: ProductInput): Promise<Product> {
        await createProductRemote(input);
        return addProduct(input);
      },

      async update(current: Product, input: ProductInput): Promise<Product> {
        if (!isLocalId(current.id)) await updateProductRemote(current.id, input);
        const next: Product = {
          ...current,
          ...input,
          images: isLocalId(current.id) ? (input.thumbnail ? [input.thumbnail] : []) : current.images,
        };
        updateProduct(next);
        return next;
      },

      async remove(product: Product): Promise<void> {
        if (!isLocalId(product.id)) await deleteProductRemote(product.id);
        deleteProduct(product);
      },
    }),
    [addProduct, updateProduct, deleteProduct],
  );
}
