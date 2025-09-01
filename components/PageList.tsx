import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Page = {
  id: string;
  name: string;
  icon: string;
};

type PageListProps = {
  pages?: Page[];
  onPress?: (page: Page) => void;
};

export default function PageList({ pages, onPress }: PageListProps) {
  // Updated pages list
  const defaultPages: Page[] = [
    { id: '1', name: 'Offer Page', icon: 'tag' },
    { id: '2', name: 'Checkout Page', icon: 'credit-card' },
    { id: '3', name: 'FAQ Page', icon: 'help-circle' },
    { id: '4', name: 'About Us Page', icon: 'info' },
    { id: '5', name: 'Contact Us Page', icon: 'mail' },
    { id: '6', name: 'Privacy Policy Page', icon: 'lock' },
    { id: '7', name: 'Terms and Conditions Page', icon: 'file-text' },
    { id: '8', name: 'Not Found Page', icon: 'alert-triangle' },
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
