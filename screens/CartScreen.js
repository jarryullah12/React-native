import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import React from "react";
import { Feather, AntDesign, Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementQuantity,
  incementQuantity,
  removeFromCart,
} from "../redux/CartReducer";
import { useNavigation } from "@react-navigation/native";
import { COLORS, BORDER_RADIUS, SPACING } from "../constants/theme";

const { width } = Dimensions.get("window");

const CartScreen = () => {
  const cart = useSelector((state) => state.cart.cart);
  const total = cart
    ?.map((item) => item.price * item.quantity)
    .reduce((curr, prev) => curr + prev, 0);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const increaseQuantity = (item) => dispatch(incementQuantity(item));
  const decreaseQuantity = (item) => dispatch(decrementQuantity(item));
  const deleteItem = (item) => dispatch(removeFromCart(item));

  return (
    <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <AntDesign name="search1" size={20} color={COLORS.gray} style={styles.searchIcon} />
            <TextInput
              placeholder="Search products..."
              placeholderTextColor={COLORS.gray}
              style={styles.searchInput}
            />
          </View>
          <Feather name="mic" size={24} color={COLORS.text} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.subtotalLabel}>Subtotal</Text>
              <Text style={styles.subtotalValue}>Rs. {total.toFixed(2)}</Text>
            </View>
          <Text style={styles.emiText}>EMI details Available</Text>

          <Pressable
            onPress={() => navigation.navigate("Confirm")}
            style={styles.checkoutButton}
          >
            <Text style={styles.checkoutButtonText}>
              Proceed to Buy ({cart.length} items)
            </Text>
          </Pressable>
        </View>

        <View style={styles.divider} />

        <View style={styles.cartList}>
          {cart?.map((item, index) => (
            <View key={index} style={styles.cartItem}>
              <View style={styles.itemInfo}>
                <Image style={styles.itemImage} source={{ uri: item?.image }} />
                <View style={styles.itemDetails}>
                  <Text numberOfLines={2} style={styles.itemTitle}>
                    {item?.title}
                  </Text>
                    <Text style={styles.itemPrice}>Rs. {item?.price}</Text>
                  <Text style={styles.stockText}>In Stock</Text>
                </View>
              </View>

              <View style={styles.itemActions}>
                <View style={styles.quantityContainer}>
                  <Pressable
                    onPress={() => (item.quantity > 1 ? decreaseQuantity(item) : deleteItem(item))}
                    style={styles.quantityButton}
                  >
                    {item.quantity > 1 ? (
                      <AntDesign name="minus" size={20} color={COLORS.text} />
                    ) : (
                      <AntDesign name="delete" size={20} color={COLORS.text} />
                    )}
                  </Pressable>

                  <View style={styles.quantityDisplay}>
                    <Text style={styles.quantityText}>{item?.quantity}</Text>
                  </View>

                  <Pressable
                    onPress={() => increaseQuantity(item)}
                    style={styles.quantityButton}
                  >
                    <Feather name="plus" size={20} color={COLORS.text} />
                  </Pressable>
                </View>

                <Pressable onPress={() => deleteItem(item)} style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Delete</Text>
                </Pressable>

                <Pressable style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Save for later</Text>
                </Pressable>
              </View>
            </View>
          ))}
          {cart.length === 0 && (
            <View style={styles.emptyCart}>
              <Ionicons name="cart-outline" size={80} color={COLORS.gray} />
              <Text style={styles.emptyText}>Your cart is empty</Text>
              <Pressable onPress={() => navigation.navigate("Home")} style={styles.shopNowButton}>
                <Text style={styles.shopNowText}>Shop Now</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default CartScreen;

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
  summaryContainer: {
    padding: SPACING.m,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  subtotalLabel: {
    fontSize: 18,
    color: COLORS.text,
  },
  subtotalValue: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: SPACING.s,
  },
  emiText: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: SPACING.m,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: BORDER_RADIUS.m,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  divider: {
    height: 8,
    backgroundColor: COLORS.lightGray,
  },
  cartList: {
    padding: SPACING.m,
  },
  cartItem: {
    backgroundColor: COLORS.white,
    marginBottom: SPACING.l,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    paddingBottom: SPACING.m,
  },
  itemInfo: {
    flexDirection: "row",
  },
  itemImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  itemDetails: {
    flex: 1,
    marginLeft: SPACING.m,
  },
  itemTitle: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 20,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: SPACING.xs,
  },
  stockText: {
    color: "green",
    fontSize: 13,
    marginTop: 2,
  },
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.m,
    gap: SPACING.s,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: BORDER_RADIUS.s,
    overflow: "hidden",
  },
  quantityButton: {
    padding: 8,
    backgroundColor: COLORS.lightGray,
  },
  quantityDisplay: {
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "500",
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.s,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  actionButtonText: {
    fontSize: 13,
    color: COLORS.text,
  },
  emptyCart: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.gray,
    marginTop: SPACING.m,
    marginBottom: SPACING.l,
  },
  shopNowButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.xl,
  },
  shopNowText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});
