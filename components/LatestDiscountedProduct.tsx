import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import ProductCard from '~/components/ProductCard';
import ProductServices from '~/services/ProductServices';
import { Product } from '~/models/Product';

export default function LatestDiscountedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      const res = await ProductServices.getShowingStoreProducts({});
      setProducts(res.discountedProducts); // from your backend response
    })();
  }, []);

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item._id}
      numColumns={2}
      renderItem={({ item }) => <ProductCard product={item} />}
      contentContainerStyle={{ padding: 8 }}
      scrollEnabled={false}
    />
  );
}
