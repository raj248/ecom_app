import { router } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '~/contexts/SessionContext';

export default function MyAccount() {
  const { session, logout } = useSession();

  return (
    <View className="flex-1 bg-gray-100">
      <View className="p-4">
        {/* Header */}
        <Text className="mb-4 text-2xl font-bold text-gray-900">My Account</Text>

        {/* Profile Card */}
        <View className="items-center rounded-2xl bg-white p-6 shadow">
          {session?.image ? (
            <Image source={{ uri: session.image }} className="h-20 w-20 rounded-full" />
          ) : (
            <View className="h-20 w-20 items-center justify-center rounded-full bg-gray-300">
              <Text className="text-xl font-bold text-gray-700">
                {session?.name?.charAt(0).toUpperCase() ?? 'U'}
              </Text>
            </View>
          )}
          <Text className="mt-3 text-lg font-semibold text-gray-900">{session?.name}</Text>
          <Text className="text-gray-500">{session?.email}</Text>
          {session?.phone ? <Text className="text-gray-500">{session.phone}</Text> : null}
        </View>

        {/* Actions */}
        <View className="mt-6 space-y-3">
          <TouchableOpacity
            className="rounded-xl bg-white p-4 shadow"
            onPress={() => router.push('/my-account')}>
            <Text className="text-base text-gray-800">Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="rounded-xl bg-white p-4 shadow"
            onPress={() => router.push('/my-order')}>
            <Text className="text-base text-gray-800">My Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="rounded-xl bg-white p-4 shadow"
            onPress={() => {
              logout();
              router.push('/profile');
            }}>
            <Text className="text-base font-semibold text-red-600">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
