import { useEffect, useState } from 'react';
import { View, FlatList, Image } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { Product } from '~/models/Product';
import ProductServices from '~/services/ProductServices';

export default function Cart() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      const productList = await ProductServices.getShowingProducts();
      setProducts(productList);
    })();
  }, []);

  const renderItem = ({ item }: { item: Product }) => (
    <View className="flex-row items-center border-b border-gray-200 p-4">
      {/* Show product image if exists */}
      {item.image && item.image[0] && (
        <Image
          source={{ uri: item.image[0] }}
          style={{ width: 60, height: 60, marginRight: 12, borderRadius: 8 }}
        />
      )}
      <View>
        <Text className="text-lg font-semibold">{item.title?.en || item.slug}</Text>
        <Text className="text-gray-600">
          ${item.prices?.price} {item.prices?.discount ? `( -${item.prices.discount}% )` : ''}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <Text className="p-4 text-xl font-bold">Number of products: {products.length}</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
