import React, { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useQuery } from '@tanstack/react-query';
import CouponServices from '~/services/CouponServices';
import CouponCard from '~/components/CouponCard';

const OfferPage = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['coupons'],
    queryFn: () => CouponServices.getShowingCoupons(),
  });

  const handleCopy = (code: string) => {
    Clipboard.setString(code);
    setCopiedCode(code);
    Alert.alert('Copied', `Coupon ${code} copied to clipboard`);
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#10b981" className="mt-10" />;
  }

  if (error) {
    return <Text className="mt-10 text-red-500">Failed to load coupons</Text>;
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="mb-4 text-2xl font-bold text-gray-900">Offers</Text>

      <FlatList
        data={data || []}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <CouponCard coupon={item} copiedCode={copiedCode} onCopy={handleCopy} />
        )}
        ItemSeparatorComponent={() => <View className="h-4" />}
      />
    </View>
  );
};

export default OfferPage;
