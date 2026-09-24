export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail?: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  stock: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  availabilityStatus?: string;
  warrantyInformation?: string;
  shippingInformation?: string;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  reviews?: Review[];
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
}

/** What the add/edit form produces once it has been validated. */
export interface ProductInput {
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  brand?: string;
  thumbnail: string;
}

/** Raw text values of the form fields (inputs always give us strings). */
export interface ProductFormValues {
  title: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  brand: string;
  thumbnail: string;
}

export type SortValue =
  | ''
  | 'price-asc'
  | 'price-desc'
  | 'rating-asc'
  | 'rating-desc'
  | 'title-asc'
  | 'title-desc';

/** Everything that lives in the URL for the product list. */
export interface ProductQuery {
  page: number;
  limit: number;
  q: string;
  category: string;
  sort: SortValue;
}
