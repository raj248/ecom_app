import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

type Page = {
  id: string;
  name: string;
  onClick: () => void;
  icon: string;
};

type PageListProps = {
  pages?: Page[];
  onPress?: (page: Page) => void;
};

export default function PageList({ pages, onPress }: PageListProps) {
  // Updated pages list
  const defaultPages: Page[] = [
    {
      id: '1',
      name: 'Offer Page',
      onClick: () => {
        router.push('/offer-page');
      },
      icon: 'tag',
    },
    {
      id: '2',
      name: 'Checkout Page',
      onClick: () => {
        router.push('/checkout');
      },
      icon: 'credit-card',
    },
    {
      id: '3',
      name: 'FAQ Page',
      onClick: () => {
        router.push('/+not-found');
      },
      icon: 'help-circle',
    },
    {
      id: '4',
      name: 'About Us Page',
      onClick: () => {
        router.push('/+not-found');
      },
      icon: 'info',
    },
    {
      id: '5',
      name: 'Contact Us Page',
      onClick: () => {
        router.push('/+not-found');
      },
      icon: 'mail',
    },
    {
      id: '6',
      name: 'Privacy Policy Page',
      onClick: () => {
        router.push('/+not-found');
      },
      icon: 'lock',
    },
    {
      id: '7',
      name: 'Terms and Conditions Page',
      onClick: () => {
        router.push('/+not-found');
      },
      icon: 'file-text',
    },
    {
      id: '8',
      name: 'Not Found Page',
      onClick: () => {
        router.push('/+not-found');
      },
      icon: 'alert-triangle',
    },
  ];

  const renderItem = ({ item }: { item: Page }) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        backgroundColor: 'white',
      }}
      onPress={() => onPress?.(item)}>
      <Feather name={item.icon as any} size={24} color="#374151" />
      <Text style={{ marginLeft: 16, fontSize: 16, color: '#111827', fontWeight: '500' }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={pages || defaultPages}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ paddingVertical: 8 }}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    />
  );
}
