import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // if using Expo
// if not Expo, install react-native-vector-icons

interface CustomHeaderProps {
  placeholder?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  onSearch?: (text: string) => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  placeholder = 'Search for products (e.g. fish, apple, oil)',
  showBackButton = false,
  onBackPress,
  onSearch,
}) => {
  const [query, setQuery] = React.useState('');

  const handleChange = (text: string) => {
    setQuery(text);
    onSearch?.(text);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10b981', // green background
        paddingHorizontal: 10,
        paddingVertical: 8,
      }}>
      {showBackButton && (
        <TouchableOpacity onPress={onBackPress} style={{ marginRight: 8 }}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      )}

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
          onChangeText={handleChange}
          placeholder={placeholder}
          style={{
            flex: 1,
            height: 40,
          }}
        />
        <Ionicons name="search" size={20} color="#888" />
      </View>
    </View>
  );
};

export default CustomHeader;
