import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import ProductCard from '~/components/ProductCard';
import { Product } from '~/models/Product';
import { router } from 'expo-router';

export default function RelatedProducts({ relatedProducts }: { relatedProducts: Product[] }) {
  return (
    <FlatList
      data={relatedProducts}
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
