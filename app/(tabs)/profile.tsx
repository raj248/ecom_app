import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import OrderServices from '~/services/OrderServices';
import useGetSetting from '~/hooks/useGetSetting';
import LoginPage from '../login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSession } from '~/contexts/SessionContext';
import { GetOrderCustomerResponse, Order } from '~/models/Order';
import { FlatList } from 'react-native';

// const FeatheredIconName = keyof typeof Feather['name'];

type CardProps = {
  title: string;
  quantity: number | undefined;
  Icon: any;
  color?: string;
  bgColor?: string;
};

const StatCard = ({ title, quantity, Icon, color, bgColor }: CardProps) => (
  <View style={[styles.card, { backgroundColor: bgColor || '#f3f4f6' }]}>
    <Icon size={24} color={color || '#111827'} />
    <Text style={[styles.cardTitle, { color: color || '#111827' }]}>{title}</Text>
    <Text style={styles.cardQuantity}>{quantity ?? 0}</Text>
  </View>
);

const ProfilePage = () => {
  const { session, logout, loading: loadingSession } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { storeCustomizationSetting } = useGetSetting();
  const [orderData, setOrderData] = useState<GetOrderCustomerResponse | null>(null);

  useEffect(() => {
    if (!session) {
      setOrderData(null);
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        if (!session.token) return;
        console.log('Requesting with token for ', session.name);
        const res = await OrderServices.getOrderCustomer();
        setOrderData(res);
      } catch (err: any) {
        console.error(err);
        Alert.alert('Error', err?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session]); // 👈 refetch when session changes

  const handleLogout = () => {
    logout();
    setOrderData(null);
    // Alert.alert('Logout', 'You have been logged out');
    // router.push('/');
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: Feather,
      onclick: () => router.push('/profile'),
      iconName: 'grid',
    },
    {
      title: 'My Orders',
      icon: Feather,
      onclick: () => router.push('/my-order'),
      iconName: 'list',
    },
    {
      title: 'My Account',
      icon: Feather,
      onclick: () => router.push('/my-account'),
      iconName: 'user',
    },
    {
      title: 'Update Profile',
      icon: Feather,
      onclick: () => router.push('/update-profile'),
      iconName: 'settings',
    },
    {
      title: 'Change Password',
      icon: Feather,
      onclick: () => router.push('/change-password'),
      iconName: 'file-text',
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      {!session ? (
        <LoginPage />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Sidebar / Menu */}
          <View style={styles.menu}>
            {menuItems.map((item) => (
              <TouchableOpacity key={item.title} style={styles.menuItem} onPress={item.onclick}>
                <item.icon name={item.iconName as any} size={20} color="#10b981" />
                <Text style={styles.menuText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
              <MaterialCommunityIcons name="logout" size={20} color="#ef4444" />
              <Text style={[styles.menuText, { color: '#ef4444' }]}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* Dashboard / Stats */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Dashboard</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#10b981" />
            ) : (
              <View style={styles.cardsContainer}>
                <StatCard
                  title="Total Orders"
                  quantity={orderData?.totalDoc}
                  Icon={Feather}
                  color="#dc2626"
                  bgColor="#fecaca"
                />
                <StatCard
                  title="Pending Orders"
                  quantity={orderData?.pending}
                  Icon={Feather}
                  color="#f97316"
                  bgColor="#fed7aa"
                />
                <StatCard
                  title="Processing Orders"
                  quantity={orderData?.processing}
                  Icon={Feather}
                  color="#4f46e5"
                  bgColor="#c7d2fe"
                />
                <StatCard
                  title="Completed Orders"
                  quantity={orderData?.delivered}
                  Icon={Feather}
                  color="#059669"
                  bgColor="#d1fae5"
                />
              </View>
            )}
          </View>

          {/* Recent Orders */}

          <View className="mt-5">
            <Text className="mb-3 text-lg font-semibold text-gray-900">Recent Orders</Text>

            {loading ? (
              <ActivityIndicator size="large" color="#10b981" />
            ) : orderData?.orders?.length ? (
              <FlatList
                data={orderData.orders.slice(0, 4)} // only top 4 orders
                scrollEnabled={false}
                keyExtractor={(order) => order._id}
                renderItem={({ item: order }) => (
                  <View className="mb-3 rounded-xl bg-white p-4 shadow-sm">
                    {/* Header */}
                    <View className="flex-row items-center justify-between">
                      <Text className="text-base font-medium text-gray-700">
                        Order #{order.invoice || order._id}
                      </Text>
                      <Text
                        className={`text-sm font-semibold ${
                          order.status === 'pending'
                            ? 'text-amber-500'
                            : order.status === 'processing'
                              ? 'text-blue-500'
                              : order.status === 'delivered'
                                ? 'text-green-600'
                                : 'text-red-500'
                        }`}>
                        {order.status.toUpperCase()}
                      </Text>
                    </View>

                    {/* Date */}
                    <Text className="mt-1 text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Text>

                    {/* Cart preview */}
                    {order.cart?.length > 0 && (
                      <View className="mt-2">
                        {order.cart.slice(0, 2).map((item, idx) => (
                          <Text key={idx} className="text-sm text-gray-700">
                            •{' '}
                            {typeof item.title === 'string'
                              ? item.title
                              : item.title?.en || 'Product'}{' '}
                            x {item.quantity || 1}
                          </Text>
                        ))}
                        {order.cart.length > 2 && (
                          <Text className="mt-1 text-xs text-gray-500">
                            + {order.cart.length - 2} more items
                          </Text>
                        )}
                      </View>
                    )}

                    {/* Total */}
                    <Text className="mt-3 text-base font-semibold text-gray-900">
                      Total: ${order.total.toFixed(2)}
                    </Text>
                  </View>
                )}
                ListEmptyComponent={<Text className="text-gray-600">No recent orders</Text>}
              />
            ) : (
              <Text className="text-gray-600">No recent orders</Text>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scrollContainer: { padding: 16 },
  menu: { marginBottom: 24 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuText: { marginLeft: 8, fontSize: 16, fontWeight: '500', color: '#111827' },
  statsSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12, color: '#111827' },
  cardsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  cardTitle: { marginTop: 8, fontSize: 14, fontWeight: '600' },
  cardQuantity: { fontSize: 18, fontWeight: '700', marginTop: 4 },
  recentOrders: { marginBottom: 24 },
  orderItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
});
