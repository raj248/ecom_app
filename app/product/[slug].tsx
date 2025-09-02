// app/product/[slug].tsx
import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { Stack, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import Share from 'react-native-share';

import AttributeServices from '~/services/AttributeServices';
import ProductServices from '~/services/ProductServices';
import { Product } from '~/models/Product';
import { Attribute } from '~/models/Attribute';
import QuantitySelector from '~/components/QuantitySelector';

const ProductScreen = () => {
  const { slug, id } = useLocalSearchParams<{ slug: string; id: string }>();
  console.log('ID: ', id);
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

  const [amount, setAmount] = useState(1);

  // ✅ fetch product details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProduct = await ProductServices.getProductById(id);
        const resAttributes = await AttributeServices.getAllAttributes();
        const resRelated = (await ProductServices.getShowingStoreProducts({ slug }))
          .relatedProducts;

        setProduct(resProduct);
        setAttributes(resAttributes);
        setRelatedProducts(resRelated);
        console.log('Product: ', resProduct);
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
    console.log('Categories: ', product.category);
    Toast.show({
      type: 'success',
      text1: 'Added to cart',
      text2: `${amount} ${product.title?.en || 'Product'} - for ${price * amount}`,
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

  // helpers: build maps for quick lookup
  // 🔎 resolve attribute ID → name (localized)
  const getAttributeName = (attrId: string) => {
    const attr = attributes.find((a) => a._id === attrId);
    return attr?.name?.en || attr?.title?.en || attrId;
  };

  // 🔎 resolve variant option ID → name
  const getVariantName = (attrId: string, variantId: string) => {
    const attr = attributes.find((a) => a._id === attrId);
    const variant = attr?.variants.find((v) => v._id === variantId);
    return variant?.name?.en || variantId;
  };

  return (
    <ScrollView>
      <Stack.Screen options={{ title: product.title?.en || 'Untitled' }} />
      {img && <Image source={{ uri: img }} style={{ width: '100%', height: 300 }} />}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{product.title?.en || 'Untitled'}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
          <View
            style={{
              backgroundColor: stock <= 5 ? '#fee2e2' : '#dcfce7', // light red if low, green if ok
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 6,
            }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: stock <= 5 ? '#dc2626' : '#16a34a', // red text if low, green otherwise
              }}>
              Stock: {stock}
            </Text>
          </View>
        </View>

        <Text className="my-1 text-gray-500" variant={'footnote'}>
          {product.description?.en || 'No description'}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#000' }}>₹ {price}</Text>

          {discount > 0 && (
            <>
              <Text
                style={{
                  fontSize: 16,
                  color: '#666',
                  marginLeft: 8,
                  textDecorationLine: 'line-through',
                }}>
                ₹ {originalPrice}
              </Text>
              <Text style={{ fontSize: 16, color: 'red', marginLeft: 8 }}>({discount}% off)</Text>
            </>
          )}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}> */}
          <QuantitySelector amount={amount} setAmount={setAmount} />

          <TouchableOpacity
            onPress={handleAddToCart}
            style={{
              backgroundColor: '#000',
              padding: 12,
              borderRadius: 8,
              marginVertical: 8,
              width: '50%',
              alignItems: 'center',
            }}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Add to Cart</Text>
          </TouchableOpacity>
        </View>

        {/* Category & Tags Section */}
        <View style={{ marginTop: 16 }}>
          {/* Primary Category */}
          {product.category && (
            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 }}>
                Category
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 6,
                }}>
                <View
                  style={{
                    backgroundColor: '#dbeafe',
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                  }}>
                  <Text style={{ fontSize: 14, color: '#1d4ed8', fontWeight: '500' }}>
                    {product.category?.name.en || 'Uncategorized'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Multiple Categories */}
          {/* {product.categories && product.categories.length > 0 && (
            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 }}>
                Categories
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {product.categories.map((cat) => (
                  <View
                    key={cat._id}
                    style={{
                      backgroundColor: '#fef3c7',
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 12,
                      marginRight: 6,
                      marginBottom: 6,
                    }}>
                    <Text style={{ fontSize: 14, color: '#b45309', fontWeight: '500' }}>
                      {cat.name.en}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )} */}

          {/* Tags */}
          {product.tag && product.tag.length > 0 && (
            <View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 }}>
                Tags
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {product.tag
                  .flatMap((t) => {
                    let parsed: string[] = [];
                    try {
                      parsed = JSON.parse(t); // ✅ parse JSON string into array
                    } catch (e) {
                      parsed = [t]; // fallback if it's not JSON
                    }
                    return parsed;
                  })
                  .map((tag, idx) => (
                    <View
                      key={idx}
                      style={{
                        backgroundColor: '#f3f4f6',
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 12,
                        marginRight: 6,
                        marginBottom: 6,
                      }}>
                      <Text style={{ fontSize: 14, color: '#374151' }}>#{tag}</Text>
                    </View>
                  ))}
              </View>
            </View>
          )}
        </View>
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

      {/* Variants Section */}
      {product.isCombination && variants.length > 0 && (
        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 }}>
            Available Variants
          </Text>

          {variants.map((variant, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => {
                setSelectVariant(variant);
                setImg(variant.image || null);
                setStock(variant.quantity || 0);
                setPrice(variant.price || 0);
                setOriginalPrice(variant.originalPrice || variant.price || 0);
              }}
              style={{
                borderWidth: 1,
                borderColor: selectVariant === variant ? '#000' : '#e5e7eb',
                borderRadius: 12,
                padding: 12,
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                backgroundColor: selectVariant === variant ? '#f9fafb' : '#fff',
              }}>
              {/* Variant image */}
              {variant.image && (
                <Image
                  source={{ uri: variant.image }}
                  style={{ width: 60, height: 60, borderRadius: 8 }}
                />
              )}

              <View style={{ flex: 1 }}>
                {/* Render attribute name + variant value */}
                {Object.entries(variant)
                  .filter(
                    ([key]) =>
                      ![
                        'originalPrice',
                        'price',
                        'quantity',
                        'discount',
                        'productId',
                        'sku',
                        'barcode',
                        'image',
                      ].includes(key)
                  )
                  .map(([attrId, variantId]) => (
                    <Text key={attrId} style={{ fontSize: 14, color: '#374151' }}>
                      {getAttributeName(attrId)}: {getVariantName(attrId, String(variantId))}
                    </Text>
                  ))}

                {/* Price + Stock */}
                <Text style={{ fontSize: 14, fontWeight: '500', color: '#111', marginTop: 4 }}>
                  ₹ {variant.price}
                </Text>
                <Text style={{ fontSize: 12, color: '#6b7280' }}>Stock: {variant.quantity}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default ProductScreen;
