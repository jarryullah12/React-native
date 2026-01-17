import { MaterialIcons } from '@expo/vector-icons';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import BottomNav from '../components/BottomNav';
import { addToCart } from '../store/cartSlice';

const { width } = Dimensions.get('window');
const columnWidth = (width - 48) / 2; // Screen width minus padding divided by 2

const ProductCard = ({ item, onPress, onAddToCart }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.imageWrapper}>
      <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
      
      {item.badge && (
        <View style={[styles.badge, { backgroundColor: item.badge === 'HOT' ? '#ef4444' : '#135bec' }]}>
          <Text style={[styles.badgeText, { color: 'white' }]}>
            {item.badge}
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => onAddToCart(item)}>
        <MaterialIcons name="add" size={20} color="white" />
      </TouchableOpacity>
    </View>

    <View style={styles.infoWrapper}>
      <View style={styles.ratingRow}>
        <MaterialIcons name="star" size={14} color="#facc15" />
        <Text style={styles.ratingText}>{item.rating} ({item.reviews})</Text>
      </View>
      <Text style={styles.productTitle} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
    </View>
  </TouchableOpacity>
);

const ProductListingScreen = ({ onBack, onProductSelect, onCartPress, onHomePress, onShopPress, onProfilePress }) => {
  const dispatch = useDispatch();
  const { items } = useSelector(state => state.cart);
  const { products } = useSelector(state => state.data);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    }));
    Alert.alert("Success", `${product.name} added to cart!`);
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topBarBtn} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="#111318" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Products</Text>
        <TouchableOpacity style={styles.topBarBtn} onPress={onCartPress}>
          <MaterialIcons name="shopping-cart" size={24} color="#111318" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* 2. Filter Bar */}
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterBtn}>
          <MaterialIcons name="tune" size={20} color="#111318" />
          <Text style={styles.filterBtnText}>Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn}>
          <MaterialIcons name="sort" size={20} color="#111318" />
          <Text style={styles.filterBtnText}>Sort</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Product Grid */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onPress={() => onProductSelect(item)}
            onAddToCart={handleAddToCart}
          />
        )}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* 4. Bottom Nav */}
      <BottomNav 
        activeTab="shop"
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
    backgroundColor: 'white',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  topBarBtn: {
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
  cartBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#135bec',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  filterBar: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111318',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    width: columnWidth,
    marginBottom: 20,
    marginRight: 16,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 0.8,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 32,
    height: 32,
    backgroundColor: '#135bec',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  infoWrapper: {
    marginTop: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111318',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#135bec',
    marginTop: 4,
  },
});

export default ProductListingScreen;
