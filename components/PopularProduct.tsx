import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import ProductCard from '~/components/ProductCard';
import ProductServices from '~/services/ProductServices';
import { Product } from '~/models/Product';
import { router } from 'expo-router';

export default function PopularProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      const res = await ProductServices.getShowingStoreProducts({});
      setProducts(res.popularProducts); // from your backend response
    })();
  }, []);

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item._id}
      numColumns={2}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={() => {}}
          onTap={() => {
            router.push({
              pathname: '/product/[slug]',
              params: { slug: item.slug, id: item._id },
            });
          }}
        />
      )}
      contentContainerStyle={{ padding: 8 }}
      scrollEnabled={false}
    />
  );
}
