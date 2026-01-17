import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import BottomNav from '../components/BottomNav';
import { addToCart } from '../store/cartSlice';

const { width } = Dimensions.get('window');

const HomeScreen = ({ onSeeAll, onProductSelect, onCartPress, onProfilePress, onShopPress, onHomePress }) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleVoiceSearch = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      const mockResults = ["Pizza", "Burger", "Nike Shoes", "Electronics"];
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setSearchQuery(randomResult);
      Alert.alert("Voice Search", `Aapne kaha: "${randomResult}"`);
    }, 2000);
  };
  const { items } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const { banners, categories, products, loading } = useSelector(state => state.data);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    }));
    Alert.alert("Success", `${product.name} added to cart!`);
  };

  if (loading || banners.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const mainBanner = banners[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Bar */}
      <View style={styles.appBar}>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={onProfilePress}>
            <Image
              source={{ uri: user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <View>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.userName}>{user?.name || 'Alex Johnson'}</Text>
          </View>
        </View>
        <View style={styles.appBarIcons}>
          <TouchableOpacity style={styles.iconBtn} onPress={onCartPress}>
            <MaterialIcons name="shopping-cart" size={24} color="#111318" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* 2. Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={22} color="#616f89" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for products..."
              placeholderTextColor="#616f89"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialIcons name="close" size={22} color="#616f89" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleVoiceSearch} disabled={isListening}>
                <MaterialIcons 
                  name={isListening ? "graphic-eq" : "mic"} 
                  size={22} 
                  color={isListening ? "#ef4444" : "#135bec"} 
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 3. Hero Banner */}
        <View style={styles.bannerContainer}>
          <LinearGradient colors={['#135bec', '#4f8aff']} style={styles.banner}>
            <View style={styles.bannerContent}>
              <View style={styles.saleTag}>
                <Text style={styles.saleTagText}>{mainBanner.title}</Text>
              </View>
              <Text style={styles.bannerTitle}>{mainBanner.discount} Off</Text>
              <Text style={styles.bannerSubtitle}>{mainBanner.subtitle}</Text>
              <TouchableOpacity style={styles.shopNowBtn} onPress={onSeeAll}>
                <Text style={styles.shopNowText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
            <Image source={{ uri: mainBanner.image }} style={styles.bannerImage} />
          </LinearGradient>
        </View>

        {/* 4. Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={onSeeAll}><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          data={categories}
          keyExtractor={(cat) => cat.id.toString()}
          renderItem={({ item: cat }) => (
            <TouchableOpacity style={styles.categoryItem} onPress={onSeeAll}>
              <View style={[styles.categoryIconCircle, { backgroundColor: cat.bg, borderColor: cat.bg }]}>
                <MaterialIcons name={cat.icon} size={28} color={cat.color} />
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          )}
        />

        {/* 5. Featured Products Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? `Search Results (${filteredProducts.length})` : 'Featured Products'}
          </Text>
          {!searchQuery && (
            <TouchableOpacity onPress={onSeeAll}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.productGrid}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => (
              <TouchableOpacity key={item.id} style={styles.productCard} onPress={() => onProductSelect(item)}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item.image }} style={styles.productImage} />
                  <TouchableOpacity style={styles.wishlistBtn}>
                    <MaterialIcons name="favorite-border" size={18} color="#64748b" />
                  </TouchableOpacity>
                  {item.badge && (
                    <View style={styles.discountTag}>
                      <Text style={styles.discountText}>{item.badge}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.productDetails}>
                  <Text style={styles.productTitle} numberOfLines={2}>{item.name}</Text>
                  <View style={styles.priceRow}>
                    <View>
                      {item.oldPrice && <Text style={styles.oldPrice}>${item.oldPrice.toFixed(2)}</Text>}
                      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.addBtn} 
                      onPress={() => handleAddToCart(item)}
                    >
                      <MaterialIcons name="add" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noResults}>
              <MaterialIcons name="search-off" size={48} color="#cbd5e1" />
              <Text style={styles.noResultsText}>No products found matching &quot;{searchQuery}&quot;</Text>
            </View>
          )}
        </View>

      </ScrollView>

      {/* 6. Bottom Navigation Bar */}
      <BottomNav 
        activeTab="home"
        onHomePress={onHomePress}
        onShopPress={onShopPress}
        onCartPress={onCartPress}
        onProfilePress={onProfilePress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white' },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  welcomeText: { fontSize: 12, color: '#64748b' },
  userName: { fontSize: 16, fontWeight: '700', color: '#111318' },
  appBarIcons: { flexDirection: 'row', gap: 12 },
  iconBtn: {
    width: 40, height: 40, backgroundColor: '#f8fafc', 
    borderRadius: 20, justifyContent: 'center', alignItems: 'center'
  },
  dotBadge: {
    position: 'absolute', top: 10, right: 10, width: 8, height: 8, 
    backgroundColor: '#ef4444', borderRadius: 4, borderWidth: 1.5, borderColor: 'white'
  },
  cartBadge: {
    position: 'absolute', top: -5, right: -5, width: 18, height: 18, 
    backgroundColor: '#135bec', borderRadius: 9, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'white'
  },
  badgeText: { color: 'white', fontSize: 10, fontWeight: '800' },
  
  searchSection: { padding: 20 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9',
    borderRadius: 12, paddingHorizontal: 15, height: 50, gap: 10
  },
  searchInput: { flex: 1, fontSize: 15, color: '#111318' },

  bannerContainer: { paddingHorizontal: 20, marginBottom: 20 },
  banner: { borderRadius: 20, height: 180, padding: 20, overflow: 'hidden' },
  saleTag: { 
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, 
    paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' 
  },
  saleTagText: { color: 'white', fontSize: 12, fontWeight: '600' },
  bannerTitle: { color: 'white', fontSize: 28, fontWeight: '800', marginTop: 10 },
  bannerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 5 },
  bannerImage: {
    position: 'absolute',
    right: -20,
    bottom: -10,
    width: 150,
    height: 150,
    resizeMode: 'contain',
    opacity: 0.9,
  },
  shopNowBtn: { backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, marginTop: 15, alignSelf: 'flex-start' },
  shopNowText: { color: '#135bec', fontWeight: '700', fontSize: 14 },
  bannerIcon: { position: 'absolute', right: -10, bottom: -10 },

  sectionHeader: { 
    flexDirection: 'row', justifyContent: 'space-between', 
    alignItems: 'center', paddingHorizontal: 20, marginVertical: 15 
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111318' },
  seeAll: { color: '#135bec', fontWeight: '600', fontSize: 14 },

  categoryList: { paddingLeft: 20, gap: 20 },
  categoryItem: { alignItems: 'center', gap: 8 },
  categoryIconCircle: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  categoryName: { fontSize: 12, fontWeight: '600', color: '#475569' },

  productGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15 },
  productCard: { width: (width - 50) / 2, margin: 5, backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#f1f5f9', overflow: 'hidden' },
  imageContainer: { width: '100%', aspectRatio: 0.8, backgroundColor: '#f8fafc' },
  productImage: { width: '100%', height: '100%' },
  wishlistBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.8)', padding: 6, borderRadius: 20 },
  discountTag: { position: 'absolute', top: 10, left: 10, backgroundColor: '#ef4444', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  discountText: { color: 'white', fontSize: 10, fontWeight: '800' },
  productDetails: { padding: 12, flex: 1 },
  productTitle: { fontSize: 13, fontWeight: '600', color: '#1e293b', height: 36 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 },
  oldPrice: { fontSize: 10, color: '#94a3b8', textDecorationLine: 'line-through' },
  price: { fontSize: 16, fontWeight: '700', color: '#111318' },
  addBtn: { width: 32, height: 32, backgroundColor: '#135bec', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },

  navText: { fontSize: 10, fontWeight: '600', color: '#94a3b8' },
  noResults: {
    width: '100%',
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  noResultsText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default HomeScreen;
