import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Order } from '~/models/Order';
import OrderServices from '~/services/OrderServices';

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await OrderServices.getOrderCustomer({ page: pageNum, limit: 10 });
      if (pageNum === 1) {
        setOrders(res.orders);
        console.log(`Test order with id ${res.orders[0]._id}`, res.orders[0]);
      } else {
        setOrders((prev) => [...prev, ...res.orders]);
      }
      setHasMore(res.orders.length > 0);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchOrders(nextPage);
    }
  };

  const renderOrder = ({ item: order }: { item: Order }) => (
    <View className="mb-3 rounded-xl bg-white p-4 shadow-sm">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-medium text-gray-700">
          Order #{order.invoice || order._id}
        </Text>
        <Text
          className={`text-sm font-semibold ${
            order.status === 'pending'
              ? 'text-amber-500'
              : order.status === 'processing'
                ? 'text-blue-500'
                : order.status === 'delivered'
                  ? 'text-green-600'
                  : 'text-red-500'
          }`}>
          {order.status.toUpperCase()}
        </Text>
      </View>

      {/* Date */}
      <Text className="mt-1 text-xs text-gray-500">
        {new Date(order.createdAt).toLocaleDateString()}
      </Text>

      {/* Cart preview */}
      {order.cart?.length > 0 && (
        <View className="mt-2">
          {order.cart.map((item, idx) => (
            <Text key={idx} className="text-sm text-gray-700">
              • {typeof item.title === 'string' ? item.title : item.title?.en || 'Product'} x{' '}
              {item.quantity || 1}
            </Text>
          ))}
          {/* {order.cart.length > 2 && (
            <Text className="mt-1 text-xs text-gray-500">+ {order.cart.length - 2} more items</Text>
          )} */}
        </View>
      )}

      {/* Total */}
      <Text className="mt-3 text-base font-semibold text-gray-900">
        Total: ${order.total.toFixed(2)}
      </Text>
    </View>
  );

  return (
    // <SafeAreaView className="flex-1">
    <ScrollView className="p-4">
      {loading && page === 1 ? (
        <ActivityIndicator size="large" color="#10b981" />
      ) : (
        <FlatList
          data={orders}
          scrollEnabled={false}
          keyExtractor={(order) => order._id}
          renderItem={renderOrder}
          contentContainerStyle={{ paddingBottom: 20 }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && page > 1 ? (
              <ActivityIndicator size="small" color="#10b981" className="mt-3" />
            ) : !hasMore ? (
              <Text className="mt-3 text-center text-gray-500">No more orders</Text>
            ) : null
          }
        />
      )}
    </ScrollView>
    // </SafeAreaView>
  );
}
