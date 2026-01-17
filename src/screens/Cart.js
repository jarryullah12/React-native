import { MaterialIcons } from '@expo/vector-icons';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import BottomNav from '../components/BottomNav';
import { removeFromCart, updateQuantity } from '../store/cartSlice';

const CartScreen = ({ onBack, onCheckout, onHomePress, onShopPress, onProfilePress, onCartPress }) => {
  const dispatch = useDispatch();
  const { items: cartItems, totalAmount: subtotal } = useSelector(state => state.cart);
  const shippingFee = cartItems.length > 0 ? 12.00 : 0;

  // Quantity Handle Functions
  const handleUpdateQuantity = (id, type) => {
    dispatch(updateQuantity({ id, type }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const total = subtotal + shippingFee;

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="#111318" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={{ width: 44 }} /> {/* Balance spacer */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="shopping-cart" size={80} color="#e2e8f0" />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>Looks like you haven&apos;t added anything to your cart yet.</Text>
            <TouchableOpacity style={styles.shopNowBtn} onPress={onBack}>
              <Text style={styles.shopNowText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* 2. Cart Items List */}
            <View style={styles.itemsList}>
              {cartItems.map((item) => (
                <View key={item.id} style={styles.cartCard}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                  
                  <View style={styles.itemDetails}>
                    <View style={styles.itemHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemDesc}>{item.description || 'Premium Product'}</Text>
                      </View>
                      <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                        <MaterialIcons name="delete-outline" size={22} color="#94a3b8" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.itemFooter}>
                      <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                      
                      {/* Stepper */}
                      <View style={styles.stepper}>
                        <TouchableOpacity 
                          style={styles.stepBtn} 
                          onPress={() => handleUpdateQuantity(item.id, 'dec')}
                        >
                          <MaterialIcons name="remove" size={16} color="#111318" />
                        </TouchableOpacity>
                        <Text style={styles.stepText}>{item.quantity}</Text>
                        <TouchableOpacity 
                          style={[styles.stepBtn, styles.addBtn]} 
                          onPress={() => handleUpdateQuantity(item.id, 'inc')}
                        >
                          <MaterialIcons name="add" size={16} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* 3. Order Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>ORDER SUMMARY</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>${shippingFee.toFixed(2)}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* 4. Fixed Footer Button */}
      <View style={[styles.footer, { paddingBottom: 100 }]}>
        <TouchableOpacity 
          style={[styles.checkoutBtn, cartItems.length === 0 && styles.disabledBtn]} 
          activeOpacity={0.8} 
          onPress={onCheckout}
          disabled={cartItems.length === 0}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          <MaterialIcons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>

      <BottomNav 
        activeTab="cart"
        onHomePress={onHomePress}
        onShopPress={onShopPress}
        onCartPress={onCartPress}
        onProfilePress={onProfilePress}
      />
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
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111318',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  itemsList: {
    gap: 16,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111318',
  },
  itemDesc: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  itemPrice: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111318',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 4,
    gap: 12,
  },
  stepBtn: {
    width: 28,
    height: 28,
    backgroundColor: 'white',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  addBtn: {
    backgroundColor: '#135bec',
  },
  stepText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111318',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111318',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111318',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#135bec',
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  checkoutBtn: {
    flexDirection: 'row', 
    backgroundColor: '#111318',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#94a3b8',
  },
  checkoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', 
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111318',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  shopNowBtn: {
    marginTop: 30,
    backgroundColor: '#111318',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  shopNowText: {
    color: 'white', 
    fontSize: 15,
    fontWeight: '600',
  },
});

export default CartScreen;