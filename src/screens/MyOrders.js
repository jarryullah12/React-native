import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyOrdersScreen = ({ onBack, onTrackOrder }) => {
  const [activeTab, setActiveTab] = useState('Active');

  const [orders] = useState([
    {
      id: '#ORD-7892',
      date: '15 Jan 2026',
      status: 'On Delivery',
      total: 132.00,
      items: 2,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop',
      statusColor: '#135bec'
    },
    {
      id: '#ORD-4521',
      date: '10 Jan 2026',
      status: 'Delivered',
      total: 299.00,
      items: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&auto=format&fit=crop',
      statusColor: '#16a34a'
    },
    {
      id: '#ORD-3310',
      date: '05 Jan 2026',
      status: 'Cancelled',
      total: 60.00,
      items: 1,
      image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?q=80&w=500&auto=format&fit=crop',
      statusColor: '#ef4444'
    }
  ]);

  const filteredOrders = activeTab === 'Active' 
    ? orders.filter(o => o.status === 'On Delivery')
    : activeTab === 'Completed'
    ? orders.filter(o => o.status === 'Delivered')
    : orders.filter(o => o.status === 'Cancelled');

  const handleViewDetails = (id) => {
    Alert.alert("Order Details", `Showing details for order ${id}`);
  };

  const handleReorder = (id) => {
    Alert.alert("Reorder", `Order ${id} has been added to your cart again!`);
  };

  const handleTrackOrderClick = (order) => {
    // Enrich order data for tracking screen
    const trackingData = {
      ...order,
      eta: '10 - 15 min',
      timeline: [
        { title: 'Order Picked Up', time: '11:05 AM', desc: 'Hamza ne aapka order pick kar liya hai.', status: 'completed' },
        { title: 'Out for Delivery', time: '11:10 AM', desc: 'Delivery partner aapki location ki taraf aa raha hai.', status: 'current' },
        { title: 'Arriving Soon', time: 'Expected 11:25 AM', desc: 'Taiyaar rahein, order jald hi pahunch jayega.', status: 'pending' },
      ],
      partner: {
        name: 'Hamza Ahmad',
        role: 'Shoply Delivery Partner',
        phone: '+923356471303',
        rating: '4.9',
        image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop'
      }
    };
    onTrackOrder(order.id, trackingData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="#111318" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.tabBar}>
        {['Active', 'Completed', 'Cancelled'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <TouchableOpacity 
              key={order.id} 
              style={styles.orderCard}
              onPress={() => handleViewDetails(order.id)}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{order.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: `${order.statusColor}15` }]}>
                  <Text style={[styles.statusText, { color: order.statusColor }]}>{order.status}</Text>
                </View>
              </View>

              <View style={styles.orderBody}>
                <Image source={{ uri: order.image }} style={styles.orderImage} />
                <View style={styles.orderDetails}>
                  <Text style={styles.orderDate}>{order.date}</Text>
                  <Text style={styles.orderInfo}>{order.items} Items • ${order.total.toFixed(2)}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
              </View>

              <View style={styles.orderFooter}>
                {order.status === 'On Delivery' ? (
                  <TouchableOpacity style={styles.trackBtn} onPress={() => handleTrackOrderClick(order)}>
                    <Text style={styles.trackBtnText}>Track Order</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.reorderBtn} onPress={() => handleViewDetails(order.id)}>
                    <Text style={styles.reorderBtnText}>View Details</Text>
                  </TouchableOpacity>
                )}
                {order.status === 'Delivered' && (
                  <TouchableOpacity style={styles.trackBtn} onPress={() => handleReorder(order.id)}>
                    <Text style={styles.trackBtnText}>Reorder</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="inventory" size={80} color="#e2e8f0" />
            <Text style={styles.emptyText}>No {activeTab.toLowerCase()} orders found</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111318',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tab: {
    paddingVertical: 14,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#135bec',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  activeTabText: {
    color: '#135bec',
  },
  scrollContent: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111318',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  orderBody: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  orderImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  orderDetails: {
    flex: 1,
    marginLeft: 16,
  },
  orderDate: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  orderInfo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111318',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  reorderBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 10,
  },
  reorderBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  trackBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#135bec',
  },
  trackBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '500',
  },
});

export default MyOrdersScreen;
