import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  ImageBackground,
    Dimensions,
    Image,
    Platform,
} from "react-native";
import React, { useState } from "react";
import { AntDesign, Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/CartReducer";
import { COLORS, BORDER_RADIUS, SPACING } from "../constants/theme";

const { width } = Dimensions.get("window");

const ProductInfoScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [addedToCart, setAddedToCart] = useState(false);
  const dispatch = useDispatch();

  const item = route.params.item || route.params;
  const carouselImages = item.carouselImages || [item.image];

  const addItemToCart = (item) => {
    setAddedToCart(true);
    dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color={COLORS.text} />
        </Pressable>
        <View style={styles.searchContainer}>
          <AntDesign name="search1" size={20} color={COLORS.gray} style={styles.searchIcon} />
          <TextInput
            placeholder="Search Amazon.in"
            placeholderTextColor={COLORS.gray}
            style={styles.searchInput}
          />
        </View>
        <Feather name="mic" size={24} color={COLORS.text} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.carouselContainer}
        >
          {carouselImages.map((img, index) => (
            <ImageBackground
              key={index}
              style={{ width, height: width, resizeMode: "contain" }}
              source={{ uri: img }}
            >
              <View style={styles.carouselHeader}>
                <View style={styles.offBadge}>
                  <Text style={styles.offText}>20% off</Text>
                </View>
                <Pressable style={styles.iconButton}>
                  <MaterialCommunityIcons name="share-variant" size={22} color={COLORS.text} />
                </Pressable>
              </View>
              <View style={styles.carouselFooter}>
                <Pressable style={styles.iconButton}>
                  <AntDesign name="hearto" size={22} color={COLORS.text} />
                </Pressable>
              </View>
            </ImageBackground>
          ))}
        </ScrollView>

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item?.title}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>Rs. {item?.price}</Text>
            {item?.oldPrice && <Text style={styles.oldPrice}>Rs. {item?.oldPrice}</Text>}
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsSection}>
            <Text style={styles.detailText}>Color: {item?.color || "Default"}</Text>
            <Text style={styles.detailText}>Size: {item?.size || "Default"}</Text>
            <View style={styles.divider} />
            <Text style={styles.totalPrice}>Total: Rs. {item?.price}</Text>
            <Text style={styles.deliveryText}>
              FREE delivery <Text style={{ fontWeight: "bold" }}>Tomorrow by 3 PM</Text>. Order within 10hrs 30 mins
            </Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={20} color={COLORS.text} />
              <Text style={styles.locationText}>Deliver to Sujan - Bangalore 560019</Text>
            </View>
            <Text style={styles.stockText}>In Stock</Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={() => addItemToCart(item)}
              style={[styles.button, styles.addToCartButton, addedToCart && styles.addedButton]}
            >
              <Text style={styles.buttonText}>
                {addedToCart ? "Added to Cart" : "Add to Cart"}
              </Text>
            </Pressable>

            <Pressable style={[styles.button, styles.buyNowButton]}>
              <Text style={styles.buttonText}>Buy Now</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.secondary,
    padding: SPACING.m,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 40 : SPACING.m,
  },
  backButton: {
    marginRight: SPACING.s,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.m,
    height: 40,
    flex: 1,
    paddingHorizontal: SPACING.m,
    marginRight: SPACING.m,
  },
  searchIcon: {
    marginRight: SPACING.s,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  carouselContainer: {
    backgroundColor: COLORS.white,
  },
  carouselHeader: {
    padding: SPACING.m,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  offBadge: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: COLORS.error,
    justifyContent: "center",
    alignItems: "center",
  },
  offText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(240, 240, 240, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  carouselFooter: {
    marginTop: "auto",
    padding: SPACING.m,
  },
  infoContainer: {
    padding: SPACING.m,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    lineHeight: 22,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: SPACING.s,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
  oldPrice: {
    fontSize: 16,
    color: COLORS.gray,
    textDecorationLine: "line-through",
    marginLeft: SPACING.s,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SPACING.m,
  },
  attributeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  attributeLabel: {
    fontSize: 15,
    color: COLORS.gray,
  },
  attributeValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.text,
  },
  deliveryInfo: {
    marginTop: SPACING.s,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: SPACING.xs,
  },
  deliveryText: {
    fontSize: 14,
    color: COLORS.secondary,
    lineHeight: 20,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.s,
    gap: 5,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  stockText: {
    color: "green",
    fontWeight: "bold",
    marginTop: SPACING.s,
    fontSize: 15,
  },
  actions: {
    marginTop: SPACING.l,
    gap: SPACING.m,
  },
  button: {
    height: 50,
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
  },
  addedButton: {
    backgroundColor: "#4BB543",
  },
  buyNowButton: {
    backgroundColor: "#FFAC1C",
  },
});
