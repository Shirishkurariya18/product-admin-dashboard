'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { FormField } from '@/components/ui/FormField';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useCategories } from '@/hooks/useCategories';
import { useProductActions } from '@/hooks/useProductActions';
import { formatCategory } from '@/lib/format';
import { toProductInput, validateProductForm } from '@/lib/validation';
import type { Product, ProductFormValues } from '@/types/product';

interface Props {
  mode: 'create' | 'edit';
  /** Required in edit mode. */
  product?: Product;
}

function initialValues(product?: Product): ProductFormValues {
  return {
    title: product?.title ?? '',
    description: product?.description ?? '',
    category: product?.category ?? '',
    price: product ? String(product.price) : '',
    stock: product ? String(product.stock) : '',
    brand: product?.brand ?? '',
    thumbnail: product?.thumbnail ?? '',
  };
}

export function ProductForm({ mode, product }: Props) {
  const router = useRouter();
  const actions = useProductActions();
  const { categories } = useCategories();

  const [values, setValues] = useState<ProductFormValues>(() => initialValues(product));
  const [touched, setTouched] = useState<Partial<Record<keyof ProductFormValues, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const errors = validateProductForm(values);
  const hasErrors = Object.keys(errors).length > 0;

  // Show an error once the field has been visited, or after the first Save click.
  const visibleError = (field: keyof ProductFormValues) =>
    touched[field] || submitAttempted ? errors[field] : undefined;

  const { run, pending, error } = useAsyncAction(async () => {
    const input = toProductInput(values);
    const saved =
      mode === 'edit' && product ? await actions.update(product, input) : await actions.create(input);
    router.replace(`/products/${saved.id}`);
  });

  // Props shared by every field: value, change/blur handlers and accessibility attributes.
  const bind = (field: keyof ProductFormValues) => ({
    id: field,
    name: field,
    value: values[field],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((v) => ({ ...v, [field]: e.target.value })),
    onBlur: () => setTouched((t) => ({ ...t, [field]: true })),
    disabled: pending,
    'aria-invalid': Boolean(visibleError(field)),
    'aria-describedby': visibleError(field) ? `${field}-error` : undefined,
    className: visibleError(field) ? 'input input-error' : 'input',
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);
    if (hasErrors) return;
    void run();
  }

  const cancelHref = mode === 'edit' && product ? `/products/${product.id}` : '/products';

  // If the current category is not in the loaded list (or the list failed to load), still let the user keep it.
  const categoryOptions =
    values.category && !categories.some((c) => c.slug === values.category)
      ? [{ slug: values.category, name: formatCategory(values.category) }, ...categories]
      : categories;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-lg border border-stone-200 bg-white p-6">
      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <FormField label="Title" htmlFor="title" error={visibleError('title')}>
        <input {...bind('title')} maxLength={120} />
      </FormField>

      <FormField label="Description" htmlFor="description" error={visibleError('description')}>
        <textarea {...bind('description')} rows={4} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Category" htmlFor="category" error={visibleError('category')}>
          {categoryOptions.length > 0 ? (
            <select {...bind('category')}>
              <option value="">Choose a category</option>
              {categoryOptions.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : (
            // Categories are loading or failed to load: allow typing a slug instead of blocking the form.
            <input {...bind('category')} placeholder="e.g. laptops" />
          )}
        </FormField>

        <FormField label="Brand (optional)" htmlFor="brand" error={visibleError('brand')}>
          <input {...bind('brand')} />
        </FormField>

        <FormField label="Price (USD)" htmlFor="price" error={visibleError('price')}>
          <input {...bind('price')} inputMode="decimal" placeholder="19.99" />
        </FormField>

        <FormField label="Stock" htmlFor="stock" error={visibleError('stock')}>
          <input {...bind('stock')} inputMode="numeric" placeholder="25" />
        </FormField>
      </div>

      <FormField
        label="Image URL (optional)"
        htmlFor="thumbnail"
        error={visibleError('thumbnail')}
        hint="A full link to an image. Leave empty to use a placeholder."
      >
        <input {...bind('thumbnail')} inputMode="url" placeholder="https://…" />
      </FormField>

      <div className="flex justify-end gap-2 pt-2">
        <Link href={cancelHref} className="btn-secondary" aria-disabled={pending}>
          Cancel
        </Link>
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Add product'}
        </button>
      </div>
    </form>
  );
}
