import { Category } from './Category';

// models/Product.ts
export interface Prices {
  originalPrice: number;
  price: number;
  discount?: number;
}

export interface Product {
  _id: string;
  productId?: string;
  sku?: string;
  barcode?: string;

  title: Record<string, any>; // since it's `type: Object` in Mongoose
  description?: Record<string, any>;

  slug: string;
  categories: Category[];
  category: Category;

  image?: string[];
  stock?: number;
  sales?: number;

  tag?: string[];
  prices: Prices;

  variants?: Variant[];
  isCombination: boolean;

  average_rating?: number;
  total_reviews?: number;

  status?: 'show' | 'hide';

  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    image?: string;
  };
  comment?: string;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetShowingStoreProductsResponse {
  reviews: Review[];
  products: Product[];
  popularProducts: Product[];
  relatedProducts: Product[];
  discountedProducts: Product[];
}

export interface Variant {
  // Dynamic attribute-value mapping (attributeId -> valueId)
  [attributeId: string]: string | number | undefined;

  // Fixed fields
  originalPrice: number;
  price: number;
  quantity: number;
  discount: number;

  productId: string;
  sku?: string;
  barcode?: string;
  image?: string;
}
