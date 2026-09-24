import { api } from '@/lib/axios';
import { splitSort } from '@/lib/params';
import type { Product, ProductInput, ProductQuery, ProductsResponse } from '@/types/product';

/**
 * All product API calls live here. Components never call Axios directly.
 *
 * Search and category are separate endpoints in DummyJSON, so at most one of
 * them is used per request (parseQuery guarantees q and category are never both set).
 */
export async function fetchProducts(query: ProductQuery, signal?: AbortSignal): Promise<ProductsResponse> {
  const params: Record<string, string | number> = {
    limit: query.limit,
    skip: (query.page - 1) * query.limit,
  };

  let url = '/products';
  if (query.q) {
    url = '/products/search';
    params.q = query.q;
  } else if (query.category) {
    url = `/products/category/${encodeURIComponent(query.category)}`;
  }

  if (query.sort) {
    const { sortBy, order } = splitSort(query.sort);
    params.sortBy = sortBy;
    params.order = order;
  }

  const { data } = await api.get<ProductsResponse>(url, { params, signal });
  return data;
}

export async function fetchProduct(id: number, signal?: AbortSignal): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`, { signal });
  return data;
}

// The three calls below are accepted by DummyJSON but NOT persisted.
// useProductActions stores the result locally afterwards.
export async function createProductRemote(input: ProductInput): Promise<void> {
  await api.post('/products/add', input);
}

export async function updateProductRemote(id: number, input: ProductInput): Promise<void> {
  await api.put(`/products/${id}`, input);
}

export async function deleteProductRemote(id: number): Promise<void> {
  await api.delete(`/products/${id}`);
}
