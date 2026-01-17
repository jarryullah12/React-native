import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { useSelector } from 'react-redux';

const CheckoutScreen = ({ onBack, onPayment, onEditAddress }) => {
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const { items: cartItems, totalAmount: subtotal } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);

  const shippingFee = cartItems.length > 0 ? 12.00 : 0;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shippingFee + tax;

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="#111318" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 2. Shipping Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <View style={styles.addressCard}>
            {/* Map Preview Background */}
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400&auto=format&fit=crop' }}
              style={styles.mapPreview}
            >
              <View style={styles.mapOverlay} />
              <View style={styles.homeTag}>
                <Text style={styles.homeTagText}>Home</Text>
              </View>
            </ImageBackground>
            
            <View style={styles.addressInfo}>
              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <MaterialIcons name="location-on" size={18} color="#135bec" />
                  <Text style={styles.userName}>{user?.name || 'Jane Doe'}</Text>
                </View>
                <Text style={styles.addressText}>{user?.address || '123 Innovation Dr, Tech City\nCA 94043, United States'}</Text>
                <Text style={styles.phoneText}>{user?.phone || '+1 (555) 123-4567'}</Text>
              </View>
              <TouchableOpacity style={styles.editBtn} onPress={onEditAddress}>
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 3. Order Summary Accordion */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.accordionHeader} 
            onPress={() => setIsSummaryOpen(!isSummaryOpen)}
            activeOpacity={0.7}
          >
            <View style={styles.accordionLeft}>
              <MaterialIcons name="shopping-bag" size={20} color="#135bec" />
              <Text style={styles.accordionTitle}>Order Summary</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{cartCount} items</Text>
              </View>
            </View>
            <MaterialIcons 
              name={isSummaryOpen ? "expand-less" : "expand-more"} 
              size={24} 
              color="#111318" 
            />
          </TouchableOpacity>

          {isSummaryOpen && (
            <View style={styles.summaryList}>
              {cartItems.map((item) => (
                <View key={item.id} style={styles.summaryItem}>
                  <Image source={{ uri: item.image }} style={styles.itemThumb} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemSub}>{item.quantity} x ${item.price.toFixed(2)}</Text>
                  </View>
                  <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 5. Cost Breakdown */}
        <View style={styles.breakdown}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Subtotal</Text>
            <Text style={styles.breakdownValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Shipping</Text>
            <Text style={styles.breakdownValue}>${shippingFee.toFixed(2)}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Tax (10%)</Text>
            <Text style={styles.breakdownValue}>${tax.toFixed(2)}</Text>
          </View>
        </View>

      </ScrollView>

      {/* 6. Sticky Bottom Bar */}
      <View style={styles.footer}>
        <View style={styles.totalInfo}>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalPrice}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.payBtn} onPress={onPayment}>
          <Text style={styles.payBtnText}>Continue to Payment</Text>
          <MaterialIcons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f8' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: 'white',
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111318' },
  scrollContent: { padding: 16, paddingBottom: 120 },
  
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111318', marginBottom: 12 },
  
  addressCard: {
    backgroundColor: 'white', borderRadius: 16, overflow: 'hidden', elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8,
  },
  mapPreview: { height: 100, width: '100%', justifyContent: 'flex-end', padding: 12 },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
  homeTag: { backgroundColor: 'white', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  homeTagText: { fontSize: 10, fontWeight: '700', color: '#111318' },
  addressInfo: { padding: 16, flexDirection: 'row', alignItems: 'flex-end' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  userName: { fontSize: 16, fontWeight: '700', color: '#111318' },
  addressText: { fontSize: 14, color: '#616f89', marginLeft: 24, lineHeight: 20 },
  phoneText: { fontSize: 14, color: '#616f89', marginLeft: 24, marginTop: 4 },
  editBtn: { backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  editBtnText: { color: '#135bec', fontSize: 12, fontWeight: '700' },

  accordionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: 'white', padding: 16, borderRadius: 16,
  },
  accordionLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  accordionTitle: { fontSize: 16, fontWeight: '700', color: '#111318' },
  countBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  countText: { fontSize: 10, fontWeight: '600', color: '#64748b' },
  summaryList: { paddingHorizontal: 16, paddingBottom: 16, backgroundColor: 'white', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  summaryItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 },
  itemThumb: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#f1f5f9' },
  itemName: { fontSize: 14, fontWeight: '600', color: '#111318' },
  itemSub: { fontSize: 12, color: '#616f89' },
  itemPrice: { fontSize: 14, fontWeight: '700', color: '#111318' },

  promoRow: { flexDirection: 'row', gap: 12 },
  promoInputContainer: { 
    flex: 1, flexDirection: 'row', alignItems: 'center', 
    backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' 
  },
  promoInput: { flex: 1, height: 48, paddingHorizontal: 10, fontSize: 14 },
  applyBtn: { borderWidth: 1, borderColor: '#135bec', paddingHorizontal: 20, justifyContent: 'center', borderRadius: 12 },
  applyBtnText: { color: '#135bec', fontWeight: '700', fontSize: 14 },

  breakdown: { marginTop: 8, borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 16 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  breakdownLabel: { fontSize: 14, color: '#616f89' },
  breakdownValue: { fontSize: 14, fontWeight: '600', color: '#111318' },

  footer: {
    position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'white',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 30, borderTopWidth: 1, borderTopColor: '#f1f5f9',
    flexDirection: 'row', alignItems: 'center', gap: 16,
  },
  totalInfo: { flexShrink: 0 },
  totalLabel: { fontSize: 12, color: '#616f89', fontWeight: '500' },
  totalPrice: { fontSize: 20, fontWeight: '800', color: '#111318' },
  payBtn: {
    flex: 1, height: 52, backgroundColor: '#135bec', borderRadius: 12,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    shadowColor: '#135bec', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  payBtnText: { color: 'white', fontWeight: '700', fontSize: 16 },
});

export default CheckoutScreen;