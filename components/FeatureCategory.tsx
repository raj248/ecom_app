import { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import CategoryServices from '~/services/CategoryServices';
import { Category } from '~/models/Category';

export default function FeatureCategory({ navigation }: any) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await CategoryServices.getShowingCategory();
        // assuming first element has children like in Next.js
        setCategories(data[0]?.children || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCategoryClick = (id: string, categoryName: string) => {
    const categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/gi, '-');
    const url = `/search?category=${categorySlug}&_id=${id}`;
    console.log('Navigate to:', url);

    // If you’re using React Navigation
    // navigation.navigate('SearchScreen', { category: categorySlug, id });
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      onPress={() => handleCategoryClick(item._id, item.name.en)}
      style={{
        flex: 1,
        margin: 6,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        padding: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{
            uri: item.icon
              ? item.icon
              : 'https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png',
          }}
          style={{ width: 35, height: 35, borderRadius: 6 }}
          resizeMode="contain"
        />

        <View style={{ marginLeft: 10, flexShrink: 1 }}>
          <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>
            {item.name.en}
          </Text>

          {/* Render up to 3 children */}
          <View style={{ marginTop: 4 }}>
            {item.children?.slice(0, 3).map((child) => (
              <TouchableOpacity
                key={child._id}
                onPress={() => handleCategoryClick(child._id, child.name.en)}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#9ca3af',
                    marginVertical: 1,
                  }}>
                  › {child.name.en}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={{ marginTop: 10, color: '#6b7280' }}>Loading categories...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={categories}
      renderItem={renderCategory}
      keyExtractor={(item) => item._id}
      numColumns={2}
      contentContainerStyle={{ padding: 8 }}
      scrollEnabled={false}
    />
  );
}
