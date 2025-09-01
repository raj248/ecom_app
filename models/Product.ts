// models/Product.ts
export interface Category {
  _id: string;
  name?: string; // optional if your backend adds more fields later
}

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

  variants?: Record<string, any>[];
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
