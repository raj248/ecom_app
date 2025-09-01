import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import useGetSetting from '~/hooks/useGetSetting';
import { Product } from '~/models/Product';
import ProductServices from '~/services/ProductServices';
import Carousel from '~/components/Carousel';
import PromotionBanner from '~/components/PromotionBanner';
import FeatureSection from '~/components/FeatureSection';
import FeatureCategory from '~/components/FeatureCategory';
import PopularProductsSection from '~/components/PopularProductsSection';
import PopularProducts from '~/components/PopularProduct';
import DiscountedProductsSection from '~/components/DiscountedProductsSection';
import LatestDiscountedProducts from '~/components/LatestDiscountedProduct';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '~/components/CustomHeader';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const { storeCustomizationSetting } = useGetSetting();
  const homeSetting = storeCustomizationSetting?.home;

  useEffect(() => {
    (async () => {
      const productList = await ProductServices.getShowingProducts();
      setProducts(productList);
    })();
  }, []);

  return (
    <SafeAreaView edges={['top']} className="flex-1">
      <CustomHeader />
      <ScrollView className="flex-1 bg-white">
        {/* Drop-in carousel */}
        <Carousel slider={storeCustomizationSetting?.slider} />

        {/* Promotion Banner */}
        <PromotionBanner
          status={homeSetting?.promotion_banner_status}
          title={homeSetting?.promotion_title}
          description={homeSetting?.promotion_description}
          buttonName={homeSetting?.promotion_button_name}
          buttonLink={homeSetting?.promotion_button_link}
        />

        {/* Feature Section */}
        <FeatureSection
          status={homeSetting?.featured_status}
          title={homeSetting?.feature_title}
          description={homeSetting?.feature_description}
        />

        {/* Categories */}
        <FeatureCategory />

        <PopularProductsSection
          status={homeSetting?.popular_products_status}
          title={homeSetting?.popular_title}
          description={homeSetting?.popular_description}
        />
        <PopularProducts />

        <DiscountedProductsSection
          status={homeSetting?.discount_product_status}
          title={homeSetting?.latest_discount_title}
          description={homeSetting?.latest_discount_description}
        />

        <LatestDiscountedProducts />
      </ScrollView>
    </SafeAreaView>
  );
}
