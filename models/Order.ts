// models/Order.ts

import { Product, Variant } from './Product'; // assuming you have a Product model

export interface UserInfo {
  name: string;
  email: string;
  contact: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
}

export type OrderStatus = 'pending' | 'processing' | 'delivered' | 'cancel';

// =============================
// Order
// =============================
export interface Order {
  _id: string; // MongoDB _id
  user: string; // userId ref
  invoice?: number;

  cart: CartItem[]; // more specific than just Product[]
  user_info: UserInfo;

  subTotal: number;
  shippingCost: number;
  discount?: number;

  total: number;
  shippingOption?: string;
  paymentMethod: string;
  cardInfo?: Record<string, any>; // only if you save card info

  status: OrderStatus;

  createdAt: string;
  updatedAt: string;
}

// =============================
// CartItem (extends Product with order-specific fields)
// =============================
export interface CartItem extends Product {
  price: number; // selected price
  originalPrice: number;
  quantity: number;
  itemTotal: number; // quantity * price
  variant?: Variant; // chosen variant
}

export interface GetOrderCustomerResponse {
  orders: Order[];
  limits: number;
  pages: number;
  pending: number;
  processing: number;
  delivered: number;
  totalDoc: number;
}
