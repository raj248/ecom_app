import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Keyboard, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductServices from '~/services/ProductServices';
import { Product } from '~/models/Product';

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

interface CustomHeaderProps {
  placeholder?: string;
  showBackButton?: boolean;
  initialQuery?: string;
  clearQuery?: boolean;
  onBackPress?: () => void;
  onSearch?: (text: string) => void; // 🔎 Called when search is triggered
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  placeholder = 'Search for products (e.g. fish, apple, oil)',
  showBackButton = false,
  initialQuery,
  clearQuery,
  onBackPress,
  onSearch,
}) => {
  const [query, setQuery] = useState(initialQuery || '');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // 🟢 Fetch suggestions as user types
  // const debouncedQuery = useDebounce(query, 400);

  // useEffect(() => {
  //   let active = true;
  //   if (debouncedQuery.length > 1) {
  //     ProductServices.getShowingStoreProducts({ title: debouncedQuery })
  //       .then((res) => setSuggestions(res.products || []))
  //       .catch(console.log);
  //     setShowDropdown(true);
  //   } else {
  //     setSuggestions([]);
  //     setShowDropdown(false);
  //   }
  //   return () => {
  //     active = false;
  //   };
  // }, [debouncedQuery]);

  // 🔎 Trigger search (manual enter or icon press)

  useEffect(() => {
    if (!initialQuery) return;
    triggerSearch();
  }, []);

  const triggerSearch = () => {
    if (!query.trim()) return;
    Keyboard.dismiss();
    setShowDropdown(false);
    onSearch?.(query.trim());
    clearQuery && setQuery('');
  };

  return (
    <View style={{ backgroundColor: '#10b981' }}>
      {/* Top bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          paddingVertical: 8,
        }}>
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress} style={{ marginRight: 8 }}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}

        {/* Search input */}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 8,
            paddingHorizontal: 10,
          }}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={placeholder}
            returnKeyType="search"
            onSubmitEditing={triggerSearch} // ⌨️ Enter key
            style={{ flex: 1, height: 40 }}
          />
          <TouchableOpacity onPress={triggerSearch}>
            <Ionicons name="search" size={20} color="#888" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CustomHeader;
