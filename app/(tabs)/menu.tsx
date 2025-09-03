import { router } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/Button';
import FeatureCategory from '~/components/FeatureCategory';
import PageList from '~/components/PageList';

export default function MenuPage() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView className="flex-1 bg-white">
        {/* Heading */}
        <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>All Categories</Text>
        </View>

        {/* Category List */}
        <View style={{ flex: 1, paddingTop: 8 }}>
          <FeatureCategory />
        </View>
        <View style={{ flex: 1 }}>
          <PageList onPress={(page) => console.log('Clicked page:', page.name)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
