import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Product } from '~/models/Product';
import { useCartStore } from '~/store/useCartStore';

interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void; // for add-to-cart button
  onTap?: (product: Product) => void; // for card tap → navigate to detail
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, onTap }) => {
  const { title, prices, stock, image } = product;
  const { addToCart } = useCartStore.getState();
  const rupee = '₹';

  const discount =
    prices?.originalPrice && prices.originalPrice > prices.price
      ? Math.round(((prices.originalPrice - prices.price) / prices.originalPrice) * 100)
      : null;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      // onPress={() => onTap?.(product)} // 🔥 call onTap when the card is pressed
      onPress={() =>
        router.push({
          pathname: '/product/[slug]',
          params: { slug: product.slug, id: product._id },
        })
      }
      style={{
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
        padding: 10,
        margin: 6,
        elevation: 2,
      }}>
      {/* Stock & discount row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text style={{ fontSize: 12, color: 'green' }}>Stock : {stock ?? 0}</Text>
        {discount !== null && (
          <Text
            style={{
              fontSize: 12,
              color: 'white',
              backgroundColor: 'orange',
              paddingHorizontal: 6,
              borderRadius: 4,
            }}>
            {discount}% Off
          </Text>
        )}
      </View>

      {/* Product image */}
      <Image
        source={{
          uri:
            image && image.length > 0
              ? image[0]
              : 'https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png',
        }}
        style={{
          width: '100%',
          height: 120,
          resizeMode: 'contain',
          marginBottom: 8,
        }}
      />

      {/* Title */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: '500',
          color: '#333',
          marginBottom: 4,
        }}
        numberOfLines={2}>
        {typeof title === 'string' ? title : title?.en}
        {/* {title?.en || 'Unnamed Product'} */}
      </Text>

      {/* Price & Add button */}
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-black">
          {rupee}
          {prices?.price?.toFixed(2) ?? '0.00'}
        </Text>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation(); // ✅ prevent triggering onTap when pressing Add
            // onPress?.(product);
            addToCart(product); // ✅ add to cart
          }}
          className="h-8 w-8 items-center justify-center rounded-md bg-emerald-500">
          <Feather name="shopping-bag" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
