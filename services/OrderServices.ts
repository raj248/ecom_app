// OrderServices.ts
import requests from './httpServices';

const OrderServices = {
  addOrder: async (body: any, headers?: any): Promise<any> => {
    return requests.post('/order/add', body, headers);
  },

  createPaymentIntent: async (body: any): Promise<any> => {
    return requests.post('/order/create-payment-intent', body);
  },

  addRazorpayOrder: async (body: any): Promise<any> => {
    return requests.post('/order/add/razorpay', body);
  },

  createOrderByRazorPay: async (body: any): Promise<any> => {
    return requests.post('/order/create/razorpay', body);
  },

  getOrderCustomer: async (id: string, body?: any): Promise<any> => {
    return requests.get(`/order/customer/${id}`, body);
  },

  getOrderById: async (id: string, body?: any): Promise<any> => {
    return requests.get(`/order/${id}`, body);
  },

  sendEmailInvoiceToCustomer: async (body: any): Promise<any> => {
    return requests.post('/order/customer/invoice', body);
  },
};

export default OrderServices;
