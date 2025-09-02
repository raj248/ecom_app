// models/Category.ts
import { LocalizedString } from './Setting'; // reuse if you already defined

export type CategoryStatus = 'show' | 'hide';

export interface Category {
  _id: string; // MongoDB ObjectId
  name: string; // multilingual names
  description?: LocalizedString; // optional
  slug?: string;
  parentId?: string;
  parentName?: string;
  id?: string; // sometimes apps store external ID
  icon?: string; // URL of category icon
  status: CategoryStatus;

  createdAt?: string;
  updatedAt?: string;
  children?: Category[];
}
