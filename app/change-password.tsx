import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { useSession } from '~/contexts/SessionContext';
import CustomerServices from '~/services/CustomerServices';
import { router } from 'expo-router';

type FormData = {
  email: string;
  currentPassword: string;
  newPassword: string;
};

export default function ChangePassword() {
  const { session } = useSession();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      email: session?.email || '',
      currentPassword: '',
      newPassword: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await CustomerServices.changePassword({
        email: data.email,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      Alert.alert('Success', res.message || 'Password updated successfully!');
      router.push('/profile');
      router.dismissAll();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || err.message || 'Something went wrong');
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 p-5">
        <Text className="mb-6 text-2xl font-bold text-gray-900">Change Password</Text>

        {/* Email (readonly) */}
        <Text className="mb-1 text-sm font-medium text-gray-700">Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { value } }) => (
            <TextInput
              className="mb-4 rounded-lg border border-gray-300 p-3 text-gray-500"
              value={value}
              editable={false}
            />
          )}
        />

        {/* Current Password */}
        <Text className="mb-1 text-sm font-medium text-gray-700">Current Password</Text>
        <Controller
          control={control}
          name="currentPassword"
          rules={{ required: 'Current password is required' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="mb-2 rounded-lg border border-gray-300 bg-white p-3"
              placeholder="Enter current password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.currentPassword && (
          <Text className="mb-2 text-xs text-red-500">{errors.currentPassword.message}</Text>
        )}

        {/* New Password */}
        <Text className="mb-1 text-sm font-medium text-gray-700">New Password</Text>
        <Controller
          control={control}
          name="newPassword"
          rules={{
            required: 'New password is required',
            // pattern: {
            //   value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
            //   message: 'Must be 8+ chars, include uppercase, lowercase, number & special char',
            // },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="mb-2 rounded-lg border border-gray-300 bg-white p-3"
              placeholder="Enter new password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.newPassword && (
          <Text className="mb-2 text-xs text-red-500">{errors.newPassword.message}</Text>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          className="mt-4 h-12 w-full items-center justify-center rounded-lg bg-emerald-500"
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}>
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-semibold text-white">Change Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
