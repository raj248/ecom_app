type DiscountType = {
  type: 'fixed' | 'percentage';
  value: number;
};

export type Coupon = {
  _id: string;
  title: Record<string, string> | string; // sometimes object (for i18n), sometimes plain string
  logo?: string;
  couponCode: string;
  startTime?: string; // Date serialized as string in JSON
  endTime: string;
  discountType?: DiscountType;
  minimumAmount: number;
  productType?: string;
  status: 'show' | 'hide';
  createdAt: string;
  updatedAt: string;
};
