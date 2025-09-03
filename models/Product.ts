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

  title: string | Record<string, any>; // sometimes plain string, sometimes object with `en`
  description?: Record<string, any>;

  slug: string;
  categories?: string[]; // in your sample: array of IDs
  category?: Category; // populated version

  image?: string | string[]; // can be single or array
  stock?: number;
  sales?: number;

  tag?: string[]; // comes as serialized JSON sometimes
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
