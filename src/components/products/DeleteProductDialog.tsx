'use client';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useProductActions } from '@/hooks/useProductActions';
import type { Product } from '@/types/product';

interface Props {
  product: Product;
  onClose: () => void;
  onDeleted: () => void;
}

/** Mount this only while a delete is being confirmed; it disappears when done. */
export function DeleteProductDialog({ product, onClose, onDeleted }: Props) {
  const actions = useProductActions();
  const { run, pending, error } = useAsyncAction(async () => {
    await actions.remove(product);
    onDeleted();
  });

  return (
    <ConfirmDialog
      title="Delete this product?"
      confirmLabel="Delete"
      pending={pending}
      error={error}
      onConfirm={() => void run()}
      onCancel={onClose}
    >
      <p>
        <strong>{product.title}</strong> will be removed from the list. This can&apos;t be undone.
      </p>
    </ConfirmDialog>
  );
}
