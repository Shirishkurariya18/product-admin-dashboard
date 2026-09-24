import type { ProductFormValues, ProductInput } from '@/types/product';

export type FormErrors = Partial<Record<keyof ProductFormValues, string>>;

export function validateProductForm(values: ProductFormValues): FormErrors {
  const errors: FormErrors = {};

  const title = values.title.trim();
  if (!title) errors.title = 'Enter a title.';
  else if (title.length < 3) errors.title = 'Title must be at least 3 characters.';
  else if (title.length > 100) errors.title = 'Title must be 100 characters or fewer.';

  const description = values.description.trim();
  if (!description) errors.description = 'Enter a description.';
  else if (description.length < 10) errors.description = 'Description must be at least 10 characters.';
  else if (description.length > 1000) errors.description = 'Description must be 1000 characters or fewer.';

  if (!values.category.trim()) errors.category = 'Choose a category.';

  const price = values.price.trim();
  if (!price) errors.price = 'Enter a price.';
  else if (!/^\d+(\.\d{1,2})?$/.test(price)) errors.price = 'Enter a price like 19.99 (up to 2 decimals).';
  else if (Number(price) <= 0) errors.price = 'Price must be greater than 0.';
  else if (Number(price) > 1_000_000) errors.price = 'Price must be 1,000,000 or less.';

  const stock = values.stock.trim();
  if (!stock) errors.stock = 'Enter the stock count.';
  else if (!/^\d+$/.test(stock)) errors.stock = 'Stock must be a whole number, 0 or more.';
  else if (Number(stock) > 100_000) errors.stock = 'Stock must be 100,000 or less.';

  if (values.brand.trim().length > 50) errors.brand = 'Brand must be 50 characters or fewer.';

  const thumbnail = values.thumbnail.trim();
  if (thumbnail) {
    try {
      const url = new URL(thumbnail);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('protocol');
    } catch {
      errors.thumbnail = 'Enter a full image URL starting with http:// or https://.';
    }
  }

  return errors;
}

/** Only call this after validateProductForm returned no errors. */
export function toProductInput(values: ProductFormValues): ProductInput {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    category: values.category.trim(),
    price: Number(values.price),
    stock: Number(values.stock),
    brand: values.brand.trim() || undefined,
    thumbnail: values.thumbnail.trim(),
  };
}
