// productService.ts
import requests from './httpServices';
import { Product } from '~/models/Product';

const ProductServices = {
  getShowingProducts: async (): Promise<Product[]> => {
    console.log('showing products');
    return requests.get<Product[]>('/products/show');
  },

  getShowingStoreProducts: async (params: {
    category?: string;
    title?: string;
    slug?: string;
  }): Promise<Product[]> => {
    const { category = '', title = '', slug = '' } = params;
    return requests.get<Product[]>(
      `/products/store?category=${category}&title=${title}&slug=${slug}`
    );
  },

  getDiscountedProducts: async (): Promise<Product[]> => {
    return requests.get<Product[]>('/products/discount');
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    return requests.get<Product>(`/products/${slug}`);
  },
};

export default ProductServices;
