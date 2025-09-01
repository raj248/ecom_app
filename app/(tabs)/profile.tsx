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
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await OrderServices.getOrderCustomer({ page: 1, limit: 10 });
        setOrderData(res);
      } catch (err: any) {
        console.error(err);
        Alert.alert('Error', err?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'You have been logged out');
    router.push('/');
  };

  const menuItems = [
    { title: 'Dashboard', icon: Feather, iconName: 'grid' },
    { title: 'My Orders', icon: Feather, iconName: 'list' },
    { title: 'My Account', icon: Feather, iconName: 'user' },
    { title: 'Update Profile', icon: Feather, iconName: 'settings' },
    { title: 'Change Password', icon: Feather, iconName: 'file-text' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Sidebar / Menu */}
        <View style={styles.menu}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.title} style={styles.menuItem}>
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
        <View style={styles.recentOrders}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#10b981" />
          ) : orderData?.docs?.length ? (
            orderData.docs.map((order: any) => (
              <View key={order._id} style={styles.orderItem}>
                <Text>Order #{order._id}</Text>
                <Text>Status: {order.status}</Text>
              </View>
            ))
          ) : (
            <Text>No recent orders</Text>
          )}
        </View>
      </ScrollView>
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
