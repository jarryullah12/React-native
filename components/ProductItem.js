import { StyleSheet, Text, View, Pressable, Image, Dimensions } from "react-native";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/CartReducer";
import { COLORS, BORDER_RADIUS, SPACING } from "../constants/theme";
import { AntDesign } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const ProductItem = ({ item }) => {
  const [addedToCart, setAddedToCart] = useState(false);
  const dispatch = useDispatch();

  const addItemToCart = (item) => {
    setAddedToCart(true);
    dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  return (
    <View style={styles.card}>
      <Pressable style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: item?.image }} />
      </Pressable>

      <View style={styles.infoContainer}>
        <Text numberOfLines={2} style={styles.title}>
          {item?.title}
        </Text>

        <View style={styles.ratingRow}>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((i) => (
              <AntDesign
                key={i}
                name="star"
                size={12}
                color={i <= Math.round(item?.rating?.rate || 0) ? COLORS.primary : COLORS.gray}
              />
            ))}
          </View>
          <Text style={styles.ratingText}>({item?.rating?.count || 0})</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>Rs. {item?.price}</Text>
        </View>

        <Pressable
          onPress={() => addItemToCart(item)}
          style={[styles.addButton, addedToCart && styles.addedButton]}
        >
          <Text style={styles.addButtonText}>
            {addedToCart ? "Added" : "Add to Cart"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  card: {
    width: (width - SPACING.l * 2 - SPACING.m) / 2,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.m,
    marginBottom: SPACING.m,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  imageContainer: {
    height: 150,
    padding: SPACING.m,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  infoContainer: {
    padding: SPACING.s,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    height: 40,
    lineHeight: 20,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  stars: {
    flexDirection: "row",
  },
  ratingText: {
    fontSize: 11,
    color: COLORS.gray,
  },
  priceRow: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.s,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  addedButton: {
    backgroundColor: "#4BB543",
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.text,
  },
});
