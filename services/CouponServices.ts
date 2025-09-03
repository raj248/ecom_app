import { Coupon } from '~/models/Coupon';
import requests from './httpServices';

const CouponServices = {
  // Fetch all coupons
  getAllCoupons: async (): Promise<Coupon[]> => {
    return await requests.get<Coupon[]>('/coupon');
  },

  // Fetch only coupons with status = "show"
  getShowingCoupons: async (): Promise<Coupon[]> => {
    return await requests.get<Coupon[]>('/coupon/show');
  },
};

export default CouponServices;
