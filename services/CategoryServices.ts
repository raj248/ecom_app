// services/CategoryServices.ts
import requests from './httpServices';
import { Category } from '~/models/Category';

const CategoryServices = {
  // fetch only "show" categories
  getShowingCategory: async (): Promise<Category[]> => {
    return await requests.get<Category[]>('/category/show');
  },
};

export default CategoryServices;
