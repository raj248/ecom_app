import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useCartStore } from '~/store/useCartStore';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Cart() {
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const removeAllFromCart = useCartStore((state) => state.removeAllFromCart);
  const total = useCartStore((state) => state.getTotal());

  const rupee = '₹';

  return (
    <View className="flex-1 bg-white ">
      {/* <Text className="mb-4 text-xl font-bold">My Cart</Text> */}

      {cart.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Feather name="shopping-cart" size={48} color="gray" />
          <Text className="mt-2 text-base text-gray-500">Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item._id + (item.variant?.sku || '')}
            renderItem={({ item }) => (
              <View className="mb-3 flex-row items-center rounded-lg bg-gray-50 p-3 shadow-sm">
                {/* Product Image */}
                <Image
                  source={{
                    uri:
                      typeof item.image === 'string'
                        ? item.image
                        : Array.isArray(item.image) && item.image.length > 0
                          ? item.image[0]
                          : 'https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png',
                  }}
                  className="h-16 w-16 rounded-md"
                  resizeMode="contain"
                />

                {/* Product Info */}
                <View className="ml-3 flex-1">
                  <Text numberOfLines={2} className="mb-1 text-sm font-medium text-gray-800">
                    {typeof item.title === 'string' ? item.title : item.title?.en || 'Product'}
                  </Text>

                  <Text className="text-xs text-gray-600">
                    {rupee}
                    {item.price.toFixed(2)} <Text className="text-gray-400">(per unit)</Text>
                  </Text>

                  {/* Quantity Controls + Subtotal */}
                  <View className="mt-2 flex-row items-center justify-between">
                    {/* Quantity */}
                    <View className="flex-row items-center">
                      <TouchableOpacity
                        onPress={() => removeFromCart(item._id, item.variant?.sku)}
                        className="rounded bg-gray-200 p-1">
                        <Feather name="minus" size={16} color="#000" />
                      </TouchableOpacity>
                      <Text className="mx-3 text-sm font-semibold">{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => addToCart(item, item.variant)}
                        className="rounded bg-gray-200 p-1">
                        <Feather name="plus" size={16} color="#000" />
                      </TouchableOpacity>
                    </View>

                    {/* Subtotal */}
                    <Text className="text-sm font-semibold text-black">
                      {rupee}
                      {item.itemTotal.toFixed(2)}
                    </Text>
                  </View>
                </View>

                {/* Remove All */}
                <TouchableOpacity
                  onPress={() => removeAllFromCart(item._id, item.variant?.sku)}
                  className="ml-2">
                  <Feather name="trash-2" size={20} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Footer */}
          <View className="border-t  border-gray-200 px-4 pt-2">
            <Text className=" mb-3 text-lg font-bold">
              Total: {rupee}
              {total.toFixed(2)}
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/checkout')}
              className="items-center rounded-lg bg-emerald-500 py-3">
              <Text className="text-base font-semibold text-white">Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
