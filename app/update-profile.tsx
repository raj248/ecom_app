import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { useSession } from '~/contexts/SessionContext';

type FormData = {
  name: string;
  address: string;
  phone: string;
  email: string;
};

export default function EditProfile({ navigation }: any) {
  const { session } = useSession();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormData>();

  // Pre-fill form with session data
  useEffect(() => {
    if (session) {
      setValue('name', session.name || '');
      setValue('email', session.email || '');
      setValue('address', session.address || '');
      setValue('phone', session.phone || '');
    }
  }, [session]);

  const onSubmit = async (data: FormData) => {
    // In real app, call API here
    Alert.alert('Profile Update', 'This feature is disabled for demo!');
    console.log('Submitted:', data);
    // navigation.goBack(); // Optional: go back after save
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 p-5">
        <Text className="mb-6 text-2xl font-bold text-gray-900">Edit Profile</Text>

        {/* Name */}
        <Text className="mb-1 text-sm font-medium text-gray-700">Full Name</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="mb-4 rounded-lg border border-gray-300 bg-white p-3"
              placeholder="Enter full name"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        {/* Address */}
        <Text className="mb-1 text-sm font-medium text-gray-700">Address</Text>
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="mb-4 rounded-lg border border-gray-300 bg-white p-3"
              placeholder="Enter address"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        {/* Phone */}
        <Text className="mb-1 text-sm font-medium text-gray-700">Phone</Text>
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="mb-4 rounded-lg border border-gray-300 bg-white p-3"
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        {/* Email (read-only) */}
        <Text className="mb-1 text-sm font-medium text-gray-700">Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { value } }) => (
            <TextInput
              className="mb-6 rounded-lg border border-gray-200 bg-gray-100 p-3 text-gray-500"
              editable={false}
              value={value}
            />
          )}
        />

        {/* Submit Button */}
        <TouchableOpacity
          className="h-12 w-full items-center justify-center rounded-lg bg-emerald-500"
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}>
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-semibold text-white">Update Profile</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
