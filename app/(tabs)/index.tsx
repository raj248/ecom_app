import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import useGetSetting from '~/hooks/useGetSetting';
import { Product } from '~/models/Product';
import ProductServices from '~/services/ProductServices';
import Carousel from '~/components/Carousel';
import PromotionBanner from '~/components/PromotionBanner';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const { storeCustomizationSetting } = useGetSetting();

  useEffect(() => {
    (async () => {
      const productList = await ProductServices.getShowingProducts();
      setProducts(productList);
    })();
  }, []);
  console.log('Promotion Banner Status', storeCustomizationSetting?.home.promotion_banner_status);
  return (
    <View className="flex-1 bg-white">
      {/* Drop-in carousel */}
      <Carousel slider={storeCustomizationSetting?.slider} />
      <PromotionBanner
        status={storeCustomizationSetting?.home.promotion_banner_status}
        title={storeCustomizationSetting?.home.promotion_title}
        description={storeCustomizationSetting?.home.promotion_description}
        buttonName={storeCustomizationSetting?.home.promotion_button_name}
        buttonLink={storeCustomizationSetting?.home.promotion_button_link}
      />
    </View>
  );
}
