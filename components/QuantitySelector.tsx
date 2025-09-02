import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// it takes amount and setAmount (made from amount, setAmount] = useState(0))
const QuantitySelector = ({
  amount,
  setAmount,
}: {
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const increment = () => setAmount(amount + 1);
  const decrement = () => setAmount(amount > 1 ? amount - 1 : 1);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        paddingHorizontal: 8,
      }}>
      {/* Decrement */}
      <TouchableOpacity
        onPress={decrement}
        style={{
          backgroundColor: '#aaa',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 6,
        }}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>−</Text>
      </TouchableOpacity>

      {/* Amount */}
      <Text
        style={{
          marginHorizontal: 16,
          fontSize: 16,
          fontWeight: 'bold',
          color: '#111827',
          minWidth: 30,
          textAlign: 'center',
        }}>
        {amount}
      </Text>

      {/* Increment */}
      <TouchableOpacity
        onPress={increment}
        style={{
          backgroundColor: '#aaa',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 6,
        }}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuantitySelector;
