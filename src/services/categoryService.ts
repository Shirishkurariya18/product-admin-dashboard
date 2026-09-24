import { api } from '@/lib/axios';
import type { Category } from '@/types/product';

type RawCategory = string | { slug: string; name: string };

export async function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  const { data } = await api.get<RawCategory[]>('/products/categories', { signal });

  // Older DummyJSON versions return plain strings, newer ones return objects.
  return data.map((item) =>
    typeof item === 'string' ? { slug: item, name: item } : { slug: item.slug, name: item.name },
  );
}
