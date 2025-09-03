import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import dayjs from 'dayjs';
import OfferTimer from './OfferTimer';
import { Coupon } from '~/models/Coupon';

interface Props {
  coupon: Coupon;
  copiedCode: string | null;
  onCopy: (code: string) => void;
}

const CouponCard: React.FC<Props> = ({ coupon, copiedCode, onCopy }) => {
  const expired = dayjs().isAfter(dayjs(coupon.endTime));

  return (
    <View className="flex-row items-center justify-between rounded-xl bg-white p-4 shadow">
      {/* Left: Logo + Info */}
      <View className="flex-row items-center">
        <Image
          source={{ uri: coupon.logo || 'https://via.placeholder.com/80' }}
          className="h-16 w-16 rounded-lg"
        />
        <View className="ml-3">
          <Text className="text-lg font-semibold text-gray-800">
            {typeof coupon.title === 'string' ? coupon.title : coupon.title?.en || 'Coupon'}
          </Text>
          <Text className="text-gray-600">
            {coupon.discountType
              ? coupon.discountType.type === 'fixed'
                ? `$${coupon.discountType.value}`
                : `${coupon.discountType.value}%`
              : 'N/A'}{' '}
            Off
          </Text>

          {expired ? (
            <Text className="mt-1 text-xs text-red-500">Expired</Text>
          ) : (
            <OfferTimer expiryTimestamp={new Date(coupon.endTime)} />
          )}
        </View>
      </View>

      {/* Right: Code */}
      <Pressable
        onPress={() => onCopy(coupon.couponCode)}
        className="rounded-lg border border-emerald-500 px-3 py-2">
        <Text className="font-bold uppercase text-emerald-600">
          {copiedCode === coupon.couponCode ? 'Copied!' : coupon.couponCode}
        </Text>
      </Pressable>
    </View>
  );
};

export default CouponCard;
