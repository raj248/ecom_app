import { useEffect, useState, useMemo } from 'react';
import { View, FlatList, Image, Dimensions } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import useGetSetting from '~/hooks/useGetSetting';
import { Product } from '~/models/Product';
import ProductServices from '~/services/ProductServices';

const { width } = Dimensions.get('window');

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const { storeCustomizationSetting } = useGetSetting();

  useEffect(() => {
    (async () => {
      const productList = await ProductServices.getShowingProducts();
      setProducts(productList);
    })();
  }, []);

  const sliderImages: string[] = useMemo(() => {
    if (!storeCustomizationSetting?.slider) return [];
    const s = storeCustomizationSetting.slider;
    return [s.first_img, s.second_img, s.third_img, s.four_img, s.five_img].filter(
      (url): url is string => Boolean(url)
    ); // type guard
  }, [storeCustomizationSetting]);

  console.log('Slider images:', sliderImages);

  const renderSlide = ({ item }: { item: string }) => (
    <View style={{ width, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={{ uri: item }}
        style={{ width: width * 0.9, height: 200, borderRadius: 12 }}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <Text className="p-4 text-xl font-bold">Number of products: {products.length}</Text>

      {/* 👇 Slider */}
      <FlatList
        data={sliderImages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, height: 220 }}
      />
    </View>
  );
}
