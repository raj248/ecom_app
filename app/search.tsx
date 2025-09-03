import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

// Internal imports
import ProductCard from '../components/ProductCard';
import ProductServices from '../services/ProductServices';
import AttributeServices from '../services/AttributeServices';
import { Product } from '~/models/Product';
import { Attribute } from '~/models/Attribute';

import Noresult from '~/assets/no-result.svg';
import CustomHeader from '~/components/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
const SearchScreen = () => {
  const navigation = useNavigation();
  const { initialQuery } = useLocalSearchParams();

  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [visibleProduct, setVisibleProduct] = useState(18);
  const [sortOrder, setSortOrder] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.trim() === '') {
      setProducts([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [resProducts, resAttributes] = await Promise.all([
          ProductServices.getShowingStoreProducts({ title: query }),
          AttributeServices.getShowingAttributes(),
        ]);
        setProducts(resProducts?.products || []);
        setAttributes(resAttributes);
      } catch (err) {
        Toast.show({ type: 'error', text1: 'Failed to load products' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [query]);

  // Sorting logic
  const sortedProducts = React.useMemo(() => {
    if (sortOrder === 'Low') {
      return [...products].sort((a, b) => a.prices?.price - b.prices?.price);
    }
    if (sortOrder === 'High') {
      return [...products].sort((a, b) => b.prices?.price - a.prices?.price);
    }
    return products;
  }, [products, sortOrder]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Search Bar */}
      <CustomHeader
        placeholder="Search for products (e.g. fish, apple, oil)"
        showBackButton={true}
        initialQuery={initialQuery as string}
        onBackPress={() => navigation.goBack()}
        onSearch={(text) => setQuery(text)}
      />

      {/* Categories */}
      {/* <CategoryCarousel /> */}

      {/* Loading */}
      {isLoading && <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 20 }} />}

      {/* No results */}
      {!isLoading && query.length > 0 && products.length === 0 && (
        <View style={{ alignItems: 'center', marginTop: 50 }}>
          <Image
            source={require('../assets/no-result.svg')}
            style={{ width: 200, height: 200, marginBottom: 16 }}
            resizeMode="contain"
          />
          <Noresult width={200} height={200} />
          <Text style={{ fontSize: 16, color: '#666' }}>Sorry, no products found 😞</Text>
        </View>
      )}

      {/* Results */}
      {sortedProducts.length > 0 && (
        <>
          {/* Info + Sort */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
              backgroundColor: '#fef3c7',
              margin: 8,
              borderRadius: 8,
            }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#333' }}>
              Total: {sortedProducts.length} items found
            </Text>
            <View>
              <Text
                style={{ fontSize: 14, color: '#2563eb' }}
                onPress={() => setSortOrder(sortOrder === 'Low' ? 'High' : 'Low')}>
                Sort: {sortOrder === 'All' ? 'Price' : sortOrder}
              </Text>
            </View>
          </View>

          {/* Products Grid */}
          <FlatList
            data={sortedProducts.slice(0, visibleProduct)}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            renderItem={({ item }) => <ProductCard product={item} />}
            contentContainerStyle={{ paddingHorizontal: 8 }}
            ListFooterComponent={() =>
              sortedProducts.length > visibleProduct ? (
                <TouchableOpacity
                  onPress={() => setVisibleProduct((prev) => prev + 10)}
                  style={{
                    backgroundColor: '#e0f2fe',
                    padding: 12,
                    borderRadius: 8,
                    margin: 16,
                    alignItems: 'center',
                  }}>
                  <Text style={{ color: '#0284c7', fontWeight: '600' }}>Load More</Text>
                </TouchableOpacity>
              ) : null
            }
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;
