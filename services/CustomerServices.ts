// CustomerServices.ts
import requests from './httpServices';

export type LoginCustomerResponse = {
  refreshToken: string;
  token: string;
  _id: string;
  name: string;
  email: string;
  address?: string;
  phone?: string;
  image?: string;
};

const CustomerServices = {
  loginCustomer: async (body: any): Promise<LoginCustomerResponse> => {
    return requests.post<LoginCustomerResponse>('/customer/login', body);
  },

  verifyEmailAddress: async (body: any): Promise<any> => {
    return requests.post('/customer/verify-email', body);
  },

  verifyPhoneNumber: async (body: any): Promise<any> => {
    return requests.post('/customer/verify-phone', body);
  },

  registerCustomer: async (token: string, body: any): Promise<any> => {
    return requests.post(`/customer/register/${token}`, body);
  },

  signUpWithOauthProvider: async (body: any): Promise<any> => {
    return requests.post('/customer/signup/oauth', body);
  },

  signUpWithProvider: async (token: string, body: any): Promise<any> => {
    return requests.post(`/customer/signup/${token}`, body);
  },

  forgetPassword: async (body: any): Promise<any> => {
    return requests.put('/customer/forget-password', body);
  },

  resetPassword: async (body: any): Promise<any> => {
    return requests.put('/customer/reset-password', body);
  },

  changePassword: async (body: any): Promise<any> => {
    return requests.post('/customer/change-password', body);
  },

  updateCustomer: async (id: string, body: any): Promise<any> => {
    return requests.put(`/customer/${id}`, body);
  },

  getShippingAddress: async ({ userId = '' }): Promise<any> => {
    return requests.get(`/customer/shipping/address/${userId}`);
  },

  addShippingAddress: async ({
    userId = '',
    shippingAddressData,
  }: {
    userId?: string;
    shippingAddressData: any;
  }): Promise<any> => {
    return requests.post(`/customer/shipping/address/${userId}`, shippingAddressData);
  },
};

export default CustomerServices;
