import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

const { width } = Dimensions.get('window');

const ProductDetailsScreen = ({ onBack, product }) => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState('8');
  const [selectedColor, setSelectedColor] = useState('#2563eb'); // Blue

  if (!product) return null;

  const handleAddToCart = () => {
    dispatch(addToCart({
      ...product,
      size: selectedSize,
      color: selectedColor
    }));
    Alert.alert("Success", "Item added to cart!");
  };

  const sizes = ['7', '8', '9', '10', '11'];
  const colors = ['#2563eb', '#0f172a', '#ef4444', '#e2e8f0'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 1. Floating Top Navigation */}
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'transparent']}
        style={styles.headerGradient}
      >
        <SafeAreaView style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} onPress={onBack}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <MaterialIcons name="favorite-border" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <MaterialIcons name="share" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 2. Hero Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.heroImage}
          />
          {/* Pagination Indicators */}
          <View style={styles.indicatorContainer}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* 3. Content Body (Overlapping Card) */}
        <View style={styles.contentBody}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{product.name}</Text>
              <View style={styles.ratingRow}>
                <View style={styles.stars}>
                  {[1, 2, 3, 4].map((i) => (
                    <MaterialIcons key={i} name="star" size={18} color="#facc15" />
                  ))}
                  <MaterialIcons name="star-half" size={18} color="#facc15" />
                </View>
                <Text style={styles.ratingScore}>{product.rating}</Text>
                <Text style={styles.reviewCount}>({product.reviews} reviews)</Text>
              </View>
            </View>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}<Text style={styles.readMore}> Read more</Text></Text>
          </View>

          {/* Size Selector */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Select Size</Text>
              <TouchableOpacity><Text style={styles.guideText}>Size Guide</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
              {sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  style={[
                    styles.sizeBox,
                    selectedSize === size && styles.selectedSizeBox,
                    size === '11' && styles.disabledSizeBox
                  ]}
                  disabled={size === '11'}
                >
                  <Text style={[styles.sizeText, selectedSize === size && styles.selectedSizeText]}>{size}</Text>
                  {size === '11' && <View style={styles.disabledLine} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Color Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Color</Text>
            <View style={styles.colorRow}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => setSelectedColor(color)}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    selectedColor === color && { ringColor: color, ringWidth: 2, borderWidth: 2, borderColor: 'white' }
                  ]}
                >
                  {selectedColor === color && (
                    <MaterialIcons name="check" size={18} color={color === '#e2e8f0' ? 'black' : 'white'} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* 4. Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
          <MaterialIcons name="shopping-bag" size={20} color="#135bec" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowBtn}>
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  headerGradient: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, height: 120,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10,
  },
  headerRight: { flexDirection: 'row', gap: 12 },
  iconBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  scrollContent: { flexGrow: 1 },
  imageContainer: { width: width, aspectRatio: 0.8 },
  heroImage: { width: '100%', height: '100%' },
  indicatorContainer: {
    position: 'absolute', bottom: 30, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'center', gap: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.6)' },
  activeDot: { width: 24, backgroundColor: '#135bec' },
  
  contentBody: {
    backgroundColor: 'white', marginTop: -20, borderTopLeftRadius: 30,
    borderTopRightRadius: 30, padding: 24, shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 5,
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 24, fontWeight: '800', color: '#0f172a', flex: 1 },
  price: { fontSize: 24, fontWeight: '800', color: '#135bec' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 5 },
  stars: { flexDirection: 'row' },
  ratingScore: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  reviewCount: { fontSize: 14, color: '#64748b' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 20 },
  
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 10 },
  description: { fontSize: 14, color: '#475569', lineHeight: 22 },
  readMore: { color: '#135bec', fontWeight: '700' },
  guideText: { fontSize: 12, color: '#135bec', fontWeight: '600' },
  
  selectorScroll: { flexDirection: 'row' },
  sizeBox: {
    width: 50, height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  selectedSizeBox: { backgroundColor: '#135bec', borderColor: '#135bec' },
  sizeText: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  selectedSizeText: { color: 'white' },
  disabledSizeBox: { opacity: 0.4 },
  disabledLine: { position: 'absolute', width: '100%', height: 1, backgroundColor: '#94a3b8', transform: [{ rotate: '45deg' }] },

  colorRow: { flexDirection: 'row', gap: 15 },
  colorCircle: {
    width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
  },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white',
    flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, paddingBottom: 35,
    borderTopWidth: 1, borderTopColor: '#f1f5f9', gap: 12,
  },
  addToCartBtn: {
    flex: 1, height: 54, borderRadius: 12, borderWidth: 2, borderColor: '#135bec',
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  addToCartText: { fontSize: 16, fontWeight: '700', color: '#135bec' },
  buyNowBtn: {
    flex: 1, height: 54, borderRadius: 12, backgroundColor: '#135bec',
    justifyContent: 'center', alignItems: 'center', shadowColor: '#135bec',
    shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  buyNowText: { fontSize: 16, fontWeight: '700', color: 'white' },
});

export default ProductDetailsScreen;