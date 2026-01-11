import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
} from "react-native";
import React, { useEffect, useContext, useState, useCallback } from "react";
import { Feather, AntDesign, MaterialIcons, Entypo, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";
import { supabase } from "../supabase";
import { COLORS, BORDER_RADIUS, SPACING } from "../constants/theme";

const AddAddressScreen = () => {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const { userId, setUserId } = useContext(UserType);

  const fetchAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      const formattedAddresses = data.map((addr) => ({
        _id: addr.id,
        name: addr.name,
        mobileNo: addr.mobile_no,
        houseNo: addr.house_no,
        street: addr.street,
        landmark: addr.landmark,
        city: addr.city,
        country: addr.country,
        postalCode: addr.postal_code,
      }));

      setAddresses(formattedAddresses);
    } catch (error) {
      console.log("error", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (userId) fetchAddresses();
    }, [userId])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color={COLORS.text} />
        </Pressable>
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
        <View style={styles.sectionHeader}>
          <Text style={styles.title}>Your Addresses</Text>
        </View>

        <Pressable
          onPress={() => navigation.navigate("Add")}
          style={styles.addAddressButton}
        >
          <Text style={styles.addAddressText}>Add a new Address</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color={COLORS.gray} />
        </Pressable>

        <View style={styles.addressList}>
          {addresses?.map((item, index) => (
            <View key={index} style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <Text style={styles.addressName}>{item?.name}</Text>
                <Entypo name="location-pin" size={22} color={COLORS.error} />
              </View>

                <View style={styles.addressBody}>
                  <Text style={styles.addressText}>{item?.houseNo}, {item?.landmark}</Text>
                  <Text style={styles.addressText}>{item?.street}</Text>
                  <Text style={styles.addressText}>{item?.city}, {item?.country || "Pakistan"}</Text>
                  <Text style={styles.contactText}>Phone: {item?.mobileNo}</Text>
                  <Text style={styles.contactText}>Pincode: {item?.postalCode}</Text>
                </View>

              <View style={styles.addressActions}>
                <Pressable style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Edit</Text>
                </Pressable>
                <Pressable style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Remove</Text>
                </Pressable>
                <Pressable style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Set as Default</Text>
                </Pressable>
              </View>
            </View>
          ))}
          {addresses.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="location-outline" size={60} color={COLORS.gray} />
              <Text style={styles.emptyText}>No addresses added yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AddAddressScreen;

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
    padding: SPACING.m,
  },
  sectionHeader: {
    marginBottom: SPACING.m,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
  },
  addAddressButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: BORDER_RADIUS.m,
    marginBottom: SPACING.l,
    backgroundColor: COLORS.lightGray,
  },
  addAddressText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  addressList: {
    gap: SPACING.m,
  },
  addressCard: {
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: BORDER_RADIUS.m,
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.s,
  },
  addressName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  addressBody: {
    marginBottom: SPACING.m,
  },
  addressText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 2,
  },
  contactText: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  addressActions: {
    flexDirection: "row",
    gap: SPACING.s,
    marginTop: SPACING.s,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.s,
    backgroundColor: COLORS.lightGray,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: SPACING.m,
  },
});
