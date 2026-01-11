import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Dimensions,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useLayoutEffect, useEffect, useContext, useState } from "react";
import Logo from "../assets/logo.png";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, AntDesign, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../supabase";
import { COLORS, BORDER_RADIUS, SPACING } from "../constants/theme";

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [updating, setUpdating] = useState(false);
  const navigation = useNavigation();

  const scrollViewRef = React.useRef(null);
  const ordersSectionRef = React.useRef(null);
  const settingsSectionRef = React.useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerStyle: {
        backgroundColor: COLORS.secondary,
      },
      headerLeft: () => (
        <View style={{ marginLeft: SPACING.m }}>
          <Image source={Logo} style={styles.headerLogo} />
        </View>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 15, marginRight: SPACING.m }}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
          <AntDesign name="search1" size={22} color={COLORS.white} />
        </View>
      ),
    });
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setUser(data);
      setNewName(data.name);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (userId) fetchUserProfile();
  }, [userId]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(`*, order_items (*)`)
          .eq("user_id", userId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedOrders = data.map((order) => ({
          _id: order.id,
          products: order.order_items.map((item) => ({
            name: item.name,
            image: item.image,
          })),
          totalPrice: order.total_price,
          createdAt: order.created_at,
        }));

        setOrders(formattedOrders);
        setLoading(false);
      } catch (error) {
        console.log("error", error);
        setLoading(false);
      }
    };

    if (userId) fetchOrders();
  }, [userId]);

  const logout = async () => {
    await AsyncStorage.removeItem("authToken");
    navigation.replace("Login");
  };

  const handleUpdateProfile = async () => {
    if (!newName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    setUpdating(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({ name: newName })
        .eq("id", userId);

      if (error) throw error;

      setUser({ ...user, name: newName });
      setIsEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
      console.log(error);
    } finally {
      setUpdating(false);
    }
  };

  const menuItems = [
    {
      title: "Your Orders", icon: "package-variant-closed", action: () => ordersSectionRef.current?.measure((x, y, w, h, px, py) => {
        scrollViewRef.current?.scrollTo({ y: py + 100, animated: true });
      })
    },
    {
      title: "Your Account", icon: "account-outline", action: () => settingsSectionRef.current?.measure((x, y, w, h, px, py) => {
        scrollViewRef.current?.scrollTo({ y: py + 100, animated: true });
      })
    },
    { title: "Manage Addresses", icon: "map-marker-outline", action: () => navigation.navigate("Address") },
    { title: "Logout", icon: "logout", action: logout, color: COLORS.error },
  ];

  const handlePrivacyPolicy = () => {
    Alert.alert("Privacy Policy", "Our privacy policy ensures your data is safe and secure with WeCart.");
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || "U"}</Text>
            </View>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>{user?.name || "User"}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <Pressable key={index} onPress={item.action} style={styles.menuCard}>
              <MaterialCommunityIcons
                name={item.icon}
                size={28}
                color={item.color || COLORS.primary}
              />
              <Text numberOfLines={1} style={[styles.menuText, item.color && { color: item.color }]}>
                {item.title}
              </Text>
            </Pressable>
          ))}
        </View>

        <View ref={ordersSectionRef} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <Pressable onPress={() => navigation.navigate("Order")}>
            <Text style={styles.seeAllText}>See all</Text>
          </Pressable>
        </View>

        <View style={styles.ordersSection}>
          {loading ? (
            <Text style={styles.emptyText}>Loading...</Text>
          ) : orders.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ordersScroll}>
              {orders.map((order) => (
                <Pressable key={order._id} style={styles.orderCard}>
                  <Image
                    source={{ uri: order.products[0]?.image }}
                    style={styles.orderImage}
                  />
                  <View style={styles.orderOverlay}>
                    <Text style={styles.orderCount}>
                      {order.products.length} {order.products.length > 1 ? "Items" : "Item"}
                    </Text>
                    <Text style={styles.orderPrice}>Rs. {order.totalPrice}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="package-variant" size={60} color={COLORS.gray} />
              <Text style={styles.emptyText}>No orders yet</Text>
              <Pressable onPress={() => navigation.navigate("Home")} style={styles.shopNowButton}>
                <Text style={styles.shopNowText}>Shop Now</Text>
              </Pressable>
            </View>
          )}
        </View>

        <View ref={settingsSectionRef} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
        </View>
        <View style={styles.accountSettings}>
          <Pressable onPress={() => setIsEditModalVisible(true)} style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: "#E3F2FD" }]}>
                <AntDesign name="user" size={18} color="#1976D2" />
              </View>
              <View>
                <Text style={styles.settingText}>Edit Profile</Text>
                <Text style={styles.settingSubtext}>Change your name and info</Text>
              </View>
            </View>
            <AntDesign name="right" size={16} color={COLORS.gray} />
          </Pressable>
          <View style={styles.line} />

          <Pressable onPress={() => navigation.navigate("Address")} style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: "#F1F8E9" }]}>
                <Ionicons name="location-outline" size={18} color="#388E3C" />
              </View>
              <View>
                <Text style={styles.settingText}>Manage Addresses</Text>
                <Text style={styles.settingSubtext}>Add or remove shipping addresses</Text>
              </View>
            </View>
            <AntDesign name="right" size={16} color={COLORS.gray} />
          </Pressable>
          <View style={styles.line} />

          <Pressable onPress={() => Alert.alert("Security", "Security settings will be available soon.")} style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: "#FFF3E0" }]}>
                <Feather name="lock" size={18} color="#F57C00" />
              </View>
              <View>
                <Text style={styles.settingText}>Security</Text>
                <Text style={styles.settingSubtext}>Password and account safety</Text>
              </View>
            </View>
            <AntDesign name="right" size={16} color={COLORS.gray} />
          </Pressable>
          <View style={styles.line} />

          <Pressable onPress={handlePrivacyPolicy} style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: "#F3E5F5" }]}>
                <MaterialCommunityIcons name="shield-check-outline" size={18} color="#7B1FA2" />
              </View>
              <View>
                <Text style={styles.settingText}>Privacy Policy</Text>
                <Text style={styles.settingSubtext}>How we handle your data</Text>
              </View>
            </View>
            <AntDesign name="right" size={16} color={COLORS.gray} />
          </Pressable>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <Pressable onPress={() => setIsEditModalVisible(false)}>
                <AntDesign name="close" size={24} color={COLORS.text} />
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                value={newName}
                onChangeText={setNewName}
                placeholder="Enter your name"
                placeholderTextColor={COLORS.gray}
              />

              <Pressable
                onPress={handleUpdateProfile}
                style={[styles.saveButton, updating && { opacity: 0.7 }]}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerSection: {
    padding: SPACING.l,
    backgroundColor: COLORS.secondary,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    paddingBottom: SPACING.xl + 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 12,
  },
  headerLogo: {
    width: 80,
    height: 35,
    resizeMode: "contain",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.l,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  avatarText: {
    fontSize: 34,
    fontWeight: "bold",
    color: COLORS.secondary,
  },
  welcomeText: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 2,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  userEmail: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.7,
    marginTop: 2,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: SPACING.m,
    marginTop: -50,
    justifyContent: "space-between",
  },
  menuCard: {
    width: (width - SPACING.m * 3) / 2,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: SPACING.l,
    marginBottom: SPACING.m,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
  menuText: {
    marginTop: SPACING.s,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.l,
    marginTop: SPACING.l,
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  seeAllText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  ordersSection: {
    paddingLeft: SPACING.l,
    marginBottom: SPACING.l,
  },
  ordersScroll: {
    paddingRight: SPACING.l,
  },
  orderCard: {
    width: 160,
    height: 180,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    marginRight: SPACING.m,
    overflow: "hidden",
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  orderImage: {
    width: "100%",
    height: "65%",
    resizeMode: "contain",
    marginTop: 10,
  },
  orderOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  orderCount: {
    color: COLORS.gray,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  orderPrice: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: "center",
    padding: SPACING.xl,
    marginRight: SPACING.l,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 25,
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderColor: COLORS.gray,
  },
  emptyText: {
    marginTop: SPACING.s,
    color: COLORS.gray,
    fontSize: 16,
    fontWeight: "600",
  },
  shopNowButton: {
    marginTop: SPACING.m,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 15,
  },
  shopNowText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  accountSettings: {
    marginHorizontal: SPACING.l,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.l,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "700",
  },
  settingSubtext: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  line: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginHorizontal: SPACING.l,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: SPACING.l,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
  },
  modalBody: {
    gap: SPACING.m,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.gray,
    marginBottom: -8,
  },
  textInput: {
    height: 55,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 15,
    paddingHorizontal: SPACING.m,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: "#F9F9F9",
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.m,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
