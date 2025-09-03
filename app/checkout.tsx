import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { useSession } from '~/contexts/SessionContext';
import { CartItem, UserInfo } from '~/models/Order';
import OrderServices from '~/services/OrderServices';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Feather, Ionicons } from '@expo/vector-icons';

type CheckoutFormData = UserInfo & {
  shippingOption: 'standard' | 'express';
  paymentMethod: 'Cash' | 'Card' | 'RazorPay';
  couponCode?: string;
};

export default function Checkout() {
  const { session } = useSession();
  const [shippingCost, setShippingCost] = useState(20); // Default standard shipping
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Dummy cart items for demonstration
  const cartItems: CartItem[] = [
    {
      _id: '1',
      title: { en: 'Organic Apples' },
      price: 2.5,
      originalPrice: 3.0,
      quantity: 2,
      itemTotal: 5.0,
      slug: 'organic-apples',
      image: ['https://res.cloudinary.com/ahossain/image/upload/v1694089926/apple_g0g0g0.jpg'],
      prices: { price: 2.5, originalPrice: 3.0 },
      isCombination: false,
    },
    {
      _id: '2',
      title: { en: 'Fresh Salmon' },
      price: 15.0,
      originalPrice: 18.0,
      quantity: 1,
      itemTotal: 15.0,
      slug: 'fresh-salmon',
      image: ['https://res.cloudinary.com/ahossain/image/upload/v1694089926/salmon_g0g0g0.jpg'],
      prices: { price: 15.0, originalPrice: 18.0 },
      isCombination: false,
    },
  ];

  const subTotal = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);
  const total = subTotal + shippingCost - discountAmount;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      name: session?.name || '',
      email: session?.email || '',
      contact: session?.phone || '',
      address: session?.address || '',
      city: '',
      country: '',
      zipCode: '',
      shippingOption: 'standard',
      paymentMethod: 'Cash',
    },
  });

  // Pre-fill user info if session exists
  useEffect(() => {
    if (session) {
      setValue('name', session.name || '');
      setValue('email', session.email || '');
      setValue('contact', session.phone || '');
      setValue('address', session.address || '');
    }
  }, [session, setValue]);

  const selectedShippingOption = watch('shippingOption');
  const selectedPaymentMethod = watch('paymentMethod');

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      // Construct order data
      const orderData = {
        user: session?._id, // Assuming user ID is available in session
        cart: cartItems.map((item) => ({
          product: item._id, // Assuming product ID is item._id
          price: item.price,
          originalPrice: item.originalPrice,
          quantity: item.quantity,
          itemTotal: item.itemTotal,
          variant: item.variant,
        })),
        user_info: {
          name: data.name,
          email: data.email,
          contact: data.contact,
          address: data.address,
          city: data.city,
          country: data.country,
          zipCode: data.zipCode,
        },
        subTotal,
        shippingCost,
        discount: discountAmount,
        total,
        shippingOption: data.shippingOption,
        paymentMethod: data.paymentMethod,
        status: 'pending',
      };
      const res = await OrderServices.addOrder(orderData);
      Toast.show({
        type: 'success',
        text1: 'Order Placed!',
        text2: `Your order #${res.invoice} has been placed successfully.`,
      });
      router.replace('/my-order'); // Navigate to my orders page
    } catch (err: any) {
      console.error('Order placement error:', err);
      Toast.show({
        type: 'error',
        text1: 'Order Failed',
        text2: err?.response?.data?.message || 'Something went wrong while placing your order.',
      });
    }
  };
  // Shipping options
  const shippingOptions = [
    {
      key: 'standard',
      label: 'Standard ($20)',
      cost: 20,
      icon: <Feather name="truck" size={20} color="#4b5563" />,
    },
    {
      key: 'express',
      label: 'Express ($60)',
      cost: 60,
      icon: <Ionicons name="rocket-outline" size={20} color="#4b5563" />,
    },
  ];

  const paymentOptions = [
    {
      key: 'Cash',
      label: 'Cash on Delivery',
      icon: <Ionicons name="wallet-outline" size={20} color="#4b5563" />,
    },
    {
      key: 'Card',
      label: 'Credit / Debit Card',
      icon: <Feather name="credit-card" size={20} color="#4b5563" />,
    },
    {
      key: 'RazorPay',
      label: 'RazorPay',
      icon: <Feather name="smartphone" size={20} color="#4b5563" />,
    },
  ];

  return (
    <SafeAreaView edges={['right', 'left', 'bottom']} className="flex-1 bg-gray-100">
      <ScrollView className="flex-1 p-4">
        <Text className="mb-4 text-xl font-bold">Checkout</Text>

        {/* Personal Details */}
        <Text className="mb-2 text-lg font-semibold">01. Personal Details</Text>
        <Controller
          control={control}
          name="name"
          rules={{ required: 'Name is required' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="mb-2 rounded bg-white p-3"
              placeholder="Full Name"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.name && <Text className="mb-2 text-red-500">{errors.name.message}</Text>}

        <Controller
          control={control}
          name="email"
          rules={{ required: 'Email is required', pattern: /^\S+@\S+$/i }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="mb-2 rounded bg-white p-3"
              placeholder="Email"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
            />
          )}
        />
        {errors.email && <Text className="mb-2 text-red-500">{errors.email.message}</Text>}

        <Controller
          control={control}
          name="contact"
          rules={{ required: 'Phone number is required' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="mb-4 rounded bg-white p-3"
              placeholder="Phone"
              value={value}
              onChangeText={onChange}
              keyboardType="phone-pad"
            />
          )}
        />
        {errors.contact && <Text className="mb-4 text-red-500">{errors.contact.message}</Text>}

        {/* Shipping */}
        <Text className="mb-2 text-lg font-semibold">02. Shipping Details</Text>
        <Controller
          control={control}
          name="address"
          rules={{ required: 'Address is required' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Street Address"
              value={value}
              onChangeText={onChange}
              className="mb-2 rounded bg-white p-3"
            />
          )}
        />
        {errors.address && <Text className="mb-2 text-red-500">{errors.address.message}</Text>}

        <Controller
          control={control}
          name="city"
          rules={{ required: 'City is required' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="City"
              value={value}
              onChangeText={onChange}
              className="mb-2 rounded bg-white p-3"
            />
          )}
        />
        {errors.city && <Text className="mb-2 text-red-500">{errors.city.message}</Text>}

        <Controller
          control={control}
          name="country"
          rules={{ required: 'Country is required' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Country"
              value={value}
              onChangeText={onChange}
              className="mb-2 rounded bg-white p-3"
            />
          )}
        />
        {errors.country && <Text className="mb-2 text-red-500">{errors.country.message}</Text>}

        <Controller
          control={control}
          name="zipCode"
          rules={{ required: 'Zip Code is required' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Zip Code"
              value={value}
              onChangeText={onChange}
              className="mb-4 rounded bg-white p-3"
            />
          )}
        />
        {errors.zipCode && <Text className="mb-4 text-red-500">{errors.zipCode.message}</Text>}

        {/* Shipping Options */}
        <Text className="mb-2 text-lg font-semibold">Shipping Method</Text>
        <Controller
          control={control}
          name="shippingOption"
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              {shippingOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  onPress={() => {
                    onChange(option.key);
                    setShippingCost(option.cost);
                  }}
                  className="mb-3 flex-row items-center justify-between rounded border border-gray-300 bg-white p-3">
                  {/* Icon + Label */}
                  <View className="ml-3 flex-row items-center">
                    {option.icon}
                    <Text className="ml-2 text-base text-gray-800">{option.label}</Text>
                  </View>

                  {/* Radio Button */}
                  <Feather
                    name={value === option.key ? 'check-circle' : 'circle'}
                    size={20}
                    color={value === option.key ? '#10b981' : '#9ca3af'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        />

        {/* Payment Method */}
        <Text className="mb-2 text-lg font-semibold">03. Payment Method</Text>
        <Controller
          control={control}
          name="paymentMethod"
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              {paymentOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  onPress={() => onChange(option.key)}
                  className="mb-3 flex-row items-center justify-between rounded border border-gray-300 bg-white p-3">
                  {/* Icon + Label */}
                  <View className="ml-3 flex-row items-center">
                    {option.icon}
                    <Text className="ml-2 text-base text-gray-800">{option.label}</Text>
                  </View>

                  {/* Radio button */}
                  <Feather
                    name={value === option.key ? 'check-circle' : 'circle'}
                    size={20}
                    color={value === option.key ? '#10b981' : '#9ca3af'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        />

        {/* Coupon */}
        <Text className="mb-2 text-lg font-semibold">Coupon</Text>
        {couponApplied ? (
          <View className="mb-4 rounded bg-emerald-50 p-3">
            <Text className="text-emerald-600">Coupon Applied: SAVE10</Text>
          </View>
        ) : (
          <View className="mb-4 flex-row">
            <Controller
              control={control}
              name="couponCode"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Enter Coupon"
                  value={value}
                  onChangeText={onChange}
                  className="mr-2 flex-1 rounded bg-white p-3"
                />
              )}
            />
            <TouchableOpacity
              onPress={() => {
                if (watch('couponCode')?.trim() === 'SAVE10') {
                  setCouponApplied(true);
                  setDiscountAmount(10);
                  Toast.show({ type: 'success', text1: 'Coupon Applied!', text2: 'SAVE10' });
                } else {
                  setCouponApplied(false);
                  setDiscountAmount(0);
                  Toast.show({
                    type: 'error',
                    text1: 'Invalid Coupon',
                    text2: 'Please try again.',
                  });
                }
              }}
              className="rounded bg-emerald-500 p-3">
              <Text className="text-white">Apply</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Order Summary */}
        <Text className="mb-2 text-lg font-semibold">Order Summary</Text>
        {cartItems.map((item) => (
          <Text key={item._id} className="mb-1 text-gray-700">
            {typeof item.title === 'string' ? item.title : item.title?.en} x{item.quantity} - $
            {item.itemTotal.toFixed(2)}
          </Text>
        ))}
        <Text className="mt-2 text-gray-600">Subtotal: ${subTotal.toFixed(2)}</Text>
        <Text className="text-gray-600">Shipping: ${shippingCost.toFixed(2)}</Text>
        <Text className="text-gray-600">Discount: -${discountAmount.toFixed(2)}</Text>
        <Text className="mt-2 text-lg font-bold">Total: ${total.toFixed(2)}</Text>

        {/* Confirm Button */}
        <TouchableOpacity
          className="mb-8 mt-6 rounded bg-emerald-500 p-4"
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-center text-lg font-bold text-white">Confirm Order</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
