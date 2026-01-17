import { MaterialIcons } from '@expo/vector-icons';
import {
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

const OrderSuccessScreen = ({ onContinue, onTrack }) => {
  const { totalAmount: subtotal } = useSelector(state => state.cart);
  const tax = subtotal * 0.1;
  const shippingFee = subtotal > 0 ? 12.0 : 0;
  const total = subtotal + tax + shippingFee;

  const handleTrackOrder = () => {
    const orderData = {
      id: '#SHP12345',
      status: 'Processing',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      eta: 'Calculating...',
      timeline: [
        { title: 'Order Mil Gaya', time: 'Just Now', desc: 'Aapka order receive ho chuka hai aur process ho raha hai.', status: 'current' },
        { title: 'Saman Pack Hoga', time: 'Waiting', desc: 'Jald hi seller aapka saman pack karega.', status: 'pending' },
        { title: 'Raste Mein Hoga', time: 'Waiting', desc: '', status: 'pending' },
        { title: 'Delivery', time: 'Estimated Oct 24', desc: '', status: 'pending' },
      ],
      partner: {
        name: 'Hamza Ahmad',
        role: 'Shoply CEO',
        phone: '+923356471303',
        rating: '5.0 (VVIP)',
        image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop'
      }
    };
    onTrack("#SHP12345", orderData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        {/* 1. Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.successCircle}>
            <View style={styles.innerCircle}>
              <MaterialIcons name="check" size={64} color="#22c55e" />
            </View>
          </View>
        </View>

        {/* 2. Text Content */}
        <View style={styles.textSection}>
          <Text style={styles.title}>Order Successful!</Text>
          <Text style={styles.subtitle}>Thank you for your purchase. We have received your order and are processing it now.</Text>
        </View>

        {/* 3. Order Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.cardHeader}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderIdLabel}>Order ID</Text>
              <Text style={styles.orderIdText}>#SHP12345</Text>
              <View style={styles.deliveryRow}>
                <MaterialIcons name="local-shipping" size={18} color="#22c55e" />
                <Text style={styles.deliveryText}>Est. Delivery: <Text style={styles.deliveryDate}>Oct 24</Text></Text>
              </View>
            </View>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1549463595-b4434224a6bd?q=80&w=200&auto=format&fit=crop' }} 
              style={styles.packageImage} 
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Amount Paid</Text>
            <Text style={styles.amountValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* 4. Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8} onPress={onContinue}>
          <Text style={styles.primaryBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.7} onPress={handleTrackOrder}>
          <Text style={styles.secondaryBtnText}>Track Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f8',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginTop: 60,
    marginBottom: 30,
  },
  successCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#dcfce7', // green-100
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111318',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#616f89',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderInfo: {
    flex: 1,
  },
  orderIdLabel: {
    fontSize: 12,
    color: '#616f89',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  orderIdText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111318',
    marginTop: 4,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  deliveryText: {
    fontSize: 14,
    color: '#616f89',
  },
  deliveryDate: {
    fontWeight: '700',
    color: '#111318',
  },
  packageImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    color: '#616f89',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111318',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: '#135bec',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#135bec',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  secondaryBtnText: {
    color: '#111318',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default OrderSuccessScreen;