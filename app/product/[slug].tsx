// app/product/[slug].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import Share from 'react-native-share';

import AttributeServices from '~/services/AttributeServices';
import ProductServices from '~/services/ProductServices';
import { Product } from '~/models/Product';
import { Attribute } from '~/models/Attribute';

const ProductScreen = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // product states
  const [price, setPrice] = useState(0);
  const [img, setImg] = useState<string | null>(null);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [selectVariant, setSelectVariant] = useState<any>({});
  const [variants, setVariants] = useState<any[]>([]);

  // ✅ fetch product details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProduct = await ProductServices.getProductBySlug(slug);
        const resAttributes = await AttributeServices.getAllAttributes();
        const resRelated = (await ProductServices.getShowingStoreProducts({ slug }))
          .relatedProducts;

        setProduct(resProduct);
        setAttributes(resAttributes);
        setRelatedProducts(resRelated);
      } catch (err) {
        Toast.show({ type: 'error', text1: 'Failed to load product' });
      }
    };

    if (slug) fetchData();
  }, [slug]);

  useEffect(() => {
    if (!product) return;

    const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;

    if (hasVariants) {
      const firstVariant = product.variants![0]; // ✅ safe since we checked length
      setVariants(product.variants || []); // ✅ fallback to empty array
      setStock(firstVariant?.quantity || 0);
      setSelectVariant(firstVariant);
      setImg(firstVariant?.image || null);

      const price = firstVariant?.price || 0;
      const originalPrice = firstVariant?.originalPrice || price;
      const discountPercentage =
        originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

      setDiscount(discountPercentage);
      setPrice(price);
      setOriginalPrice(originalPrice);
    } else {
      setVariants([]); // ✅ reset when no variants
      setStock(product?.stock || 0);
      setImg(product?.image?.[0] || null);

      const price = product?.prices?.price || 0;
      const originalPrice = product?.prices?.originalPrice || price;
      const discountPercentage =
        originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

      setDiscount(discountPercentage);
      setPrice(price);
      setOriginalPrice(originalPrice);
    }
  }, [product]);

  // ✅ add to cart (dummy)
  const handleAddToCart = () => {
    if (!product) return;
    if (stock <= 0) return Toast.show({ type: 'error', text1: 'Insufficient stock' });

    Toast.show({
      type: 'success',
      text1: 'Added to cart',
      text2: `${product.title?.en || 'Product'} - ${price}`,
    });
  };

  // ✅ share product
  const handleShare = async () => {
    try {
      await Share.open({
        message: `Check out this product: ${product?.title?.en || ''}`,
        url: `https://your-app-url.com/product/${product?.slug}`,
      });
    } catch (err) {
      console.log('Share error:', err);
    }
  };

  if (!product) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView>
      {img && <Image source={{ uri: img }} style={{ width: '100%', height: 300 }} />}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{product.title?.en || 'Untitled'}</Text>
        <Text style={{ fontSize: 18, marginVertical: 8 }}>
          ${price} {discount > 0 && <Text style={{ color: 'red' }}>({discount}% off)</Text>}
        </Text>

        <TouchableOpacity
          onPress={handleAddToCart}
          style={{
            backgroundColor: '#000',
            padding: 12,
            borderRadius: 8,
            marginVertical: 8,
          }}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleShare}
          style={{
            backgroundColor: '#eee',
            padding: 12,
            borderRadius: 8,
            marginVertical: 8,
          }}>
          <Text style={{ textAlign: 'center' }}>Share</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProductScreen;
