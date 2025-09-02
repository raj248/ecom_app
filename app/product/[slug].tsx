// app/product/[slug].tsx
import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { Stack, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import Share from 'react-native-share';

import AttributeServices from '~/services/AttributeServices';
import ProductServices from '~/services/ProductServices';
import { Product, Variant } from '~/models/Product';
import { Attribute } from '~/models/Attribute';
import QuantitySelector from '~/components/QuantitySelector';
import RelatedProducts from '~/components/RelatedProduct';

const ProductScreen = () => {
  const { slug, id } = useLocalSearchParams<{ slug: string; id: string }>();
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
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({});

  const [amount, setAmount] = useState(1);

  // ✅ fetch product details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProduct = await ProductServices.getProductById(id);
        const resAttributes = await AttributeServices.getShowingAttributes();
        const resRelated = (await ProductServices.getShowingStoreProducts({ slug }))
          .relatedProducts;

        setProduct(resProduct);
        setAttributes(resAttributes);
        setRelatedProducts(resRelated);
        // console.log('Product: ', resProduct);
      } catch (err) {
        Toast.show({ type: 'error', text1: 'Failed to load product' });
      }
    };

    if (slug) fetchData();
  }, [slug]);

  useEffect(() => {
    if (!product) return;

    const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;

    if (hasVariants && product.isCombination) {
      const firstVariant = product.variants![0];
      setVariants(product.variants || []);

      // ✅ set default attributes from first variant
      const defaultAttrs: Record<string, string> = {};
      Object.entries(firstVariant).forEach(([key, value]) => {
        if (
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
        ) {
          defaultAttrs[key] = String(value);
        }
      });
      setSelectedAttrs(defaultAttrs);

      // ✅ update product state
      setSelectVariant(firstVariant);
      setImg(firstVariant?.image || null);
      setStock(firstVariant?.quantity || 0);

      const price = firstVariant?.price || 0;
      const originalPrice = firstVariant?.originalPrice || price;
      const discountPercentage =
        originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

      setDiscount(discountPercentage);
      setPrice(price);
      setOriginalPrice(originalPrice);
    } else {
      // fallback to single product case
      setVariants([]);
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

  useEffect(() => {
    if (Object.keys(selectedAttrs).length === 0) return;

    const match = variants.find((variant) =>
      Object.entries(selectedAttrs).every(([attrId, value]) => String(variant[attrId]) === value)
    );

    if (match) {
      setSelectVariant(match);
      setImg(match.image || null);
      setStock(match.quantity || 0);
      setPrice(match.price || 0);
      setOriginalPrice(match.originalPrice || match.price || 0);
    }
  }, [selectedAttrs, variants]);

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
        url: `https://demo.zenextech.in/product/${product?.slug}`,
      });
    } catch (err) {
      console.log('Share error:', err);
    }
  };

  // helpers: build map of attributes → unique values
  const buildAttributeOptions = (variants: any[]) => {
    const options: Record<string, string[]> = {};
    variants.forEach((variant) => {
      Object.entries(variant).forEach(([attrId, value]) => {
        if (
          ![
            'originalPrice',
            'price',
            'quantity',
            'discount',
            'productId',
            'sku',
            'barcode',
            'image',
          ].includes(attrId)
        ) {
          if (!options[attrId]) options[attrId] = [];
          if (!options[attrId].includes(String(value))) {
            options[attrId].push(String(value));
          }
        }
      });
    });
    return options;
  };

  const handleSelectAttr = (attrId: string, value: string) => {
    setSelectedAttrs((prev) => ({ ...prev, [attrId]: value }));
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

        {/* Attribute-based selectors */}
        {product.isCombination && variants.length > 0 && (
          <View style={{ marginTop: 16 }}>
            {Object.entries(buildAttributeOptions(variants)).map(([attrId, values]) => (
              <View key={attrId} style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                  {getAttributeName(attrId)}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {values.map((val) => (
                    <TouchableOpacity
                      key={val}
                      onPress={() => handleSelectAttr(attrId, val)}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: selectedAttrs[attrId] === val ? '#10B981' : '#ccc',
                        backgroundColor: selectedAttrs[attrId] === val ? '#10B981' : '#fff',
                        marginRight: 8,
                        marginBottom: 8,
                      }}>
                      <Text
                        style={{
                          color: selectedAttrs[attrId] === val ? '#fff' : '#000',
                          fontSize: 14,
                        }}>
                        {getVariantName(attrId, val)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
        {/* Product description */}
        <Text className="my-1 text-gray-500" variant={'footnote'}>
          {product.description?.en || 'No description'}
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}> */}
          <QuantitySelector amount={amount} setAmount={setAmount} />

          <TouchableOpacity
            onPress={handleAddToCart}
            style={{
              backgroundColor: '#000',
              padding: 7,
              paddingVertical: 8,
              borderRadius: 8,
              marginVertical: 8,
              width: '55%',
              alignItems: 'center',
            }}>
            <Text style={{ color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '600' }}>
              Add to Cart
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category & Tags Section */}
        <View style={{ marginTop: 16 }}>
          {/* Primary Category */}
          {product.category && (
            <View
              style={{
                marginBottom: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 8,
                flexWrap: 'wrap',
              }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 4 }}>
                Category:
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
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                  }}>
                  <Text style={{ fontSize: 12, color: '#1d4ed8', fontWeight: '500' }}>
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
              {/* <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 }}>
                Tags
              </Text> */}
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
                      <Text style={{ fontSize: 14, color: '#374151', fontWeight: '700' }}>
                        #{tag}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>
          )}
        </View>
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
      <RelatedProducts relatedProducts={relatedProducts} />
    </ScrollView>
  );
};

export default ProductScreen;
