// services/AttributeServices.ts
import requests from './httpServices';
import { Attribute } from '~/models/Attribute';

const AttributeServices = {
  getAllAttributes: async (): Promise<Attribute[]> => {
    const res = await requests.get<Attribute[]>('/attributes');
    return res;
  },

  getShowingAttributes: async (): Promise<Attribute[]> => {
    const res = await requests.get<Attribute[]>('/attributes/show');
    return res;
  },

  getAttributeById: async (id: string): Promise<Attribute> => {
    const res = await requests.get<Attribute>(`/attributes/${id}`);
    return res;
  },
};

export default AttributeServices;
