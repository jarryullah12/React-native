import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Dimensions,
} from "react-native";
import Logo from "../assets/logo.png";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { Feather, Ionicons, MaterialIcons, Entypo, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import ProductItem from "../components/ProductItem";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../UserContext";
import { supabase } from "../supabase";
import { COLORS, BORDER_RADIUS, SPACING } from "../constants/theme";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const list = [
    { id: "0", image: "https://m.media-amazon.com/images/I/41EcYoIZhIL._AC_SY400_.jpg", name: "Home" },
    { id: "1", image: "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/blockbuster.jpg", name: "Deals" },
    { id: "3", image: "https://images-eu.ssl-images-amazon.com/images/I/31dXEvtxidL._AC_SX368_.jpg", name: "Electronics" },
    { id: "4", image: "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/All_Icons_Template_1_icons_01.jpg", name: "Mobiles" },
    { id: "5", image: "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/music.jpg", name: "Music" },
    { id: "6", image: "https://m.media-amazon.com/images/I/51dZ19miAbL._AC_SY350_.jpg", name: "Fashion" },
  ];
  const images = [
    "https://img.etimg.com/thumb/msid-93051525,width-1070,height-580,imgsize-2243475,overlay-economictimes/photo.jpg",
    "https://images-eu.ssl-images-amazon.com/images/G/31/img22/Wireless/devjyoti/PD23/Launches/Updated_ingress1242x550_3.gif",
    "https://images-eu.ssl-images-amazon.com/images/G/31/img23/Books/BB/JULY/1242x550_Header-BB-Jul23.jpg",
  ];
  const deals = [
    {
      id: "20",
      title: "OnePlus Nord CE 3 Lite 5G (Pastel Lime, 8GB RAM, 128GB Storage)",
      oldPrice: 25000,
      price: 19000,
      image: "https://images-eu.ssl-images-amazon.com/images/G/31/wireless_products/ssserene/weblab_wf/xcm_banners_2022_in_bau_wireless_dec_580x800_once3l_v2_580x800_in-en.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/61QRgOgBx0L._SX679_.jpg",
        "https://m.media-amazon.com/images/I/61uaJPLIdML._SX679_.jpg",
        "https://m.media-amazon.com/images/I/510YZx4v3wL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/61J6s1tkwpL._SX679_.jpg",
      ],
      color: "Stellar Green",
      size: "6 GB RAM 128GB Storage",
    },
    {
      id: "30",
      title: "Samsung Galaxy S20 FE 5G (Cloud Navy, 8GB RAM, 128GB Storage)",
      oldPrice: 74000,
      price: 26000,
      image: "https://images-eu.ssl-images-amazon.com/images/G/31/img23/Wireless/Samsung/SamsungBAU/S20FE/GW/June23/BAU-27thJune/xcm_banners_2022_in_bau_wireless_dec_s20fe-rv51_580x800_in-en.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/81vDZyJQ-4L._SY879_.jpg",
        "https://m.media-amazon.com/images/I/61vN1isnThL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71yzyH-ohgL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/61vN1isnThL._SX679_.jpg",
      ],
      color: "Cloud Navy",
      size: "8 GB RAM 128GB Storage",
    },
  ];
  const offers = [
    {
      id: "0",
      title: "Oppo Enco Air3 Pro True Wireless Earbuds",
      offer: "72% off",
      oldPrice: 7500,
      price: 4500,
      image: "https://m.media-amazon.com/images/I/61a2y1FCAJL._AC_UL640_FMwebp_QL65_.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/61a2y1FCAJL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71DOcYgHWFL._SX679_.jpg",
      ],
    },
    {
      id: "1",
      title: "Fastrack Limitless FS1 Pro Smart Watch",
      offer: "40%",
      oldPrice: 7955,
      price: 3495,
      image: "https://m.media-amazon.com/images/I/41mQKmbkVWL._AC_SY400_.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/71h2K2OQSIL._SX679_.jpg",
      ],
    },
  ];

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [category, setCategory] = useState("");
  const { userId, setUserId } = useContext(UserType);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [items, setItems] = useState([
    { label: "All Categories", value: "" },
    { label: "Men's clothing", value: "men's clothing" },
    { label: "jewelery", value: "jewelery" },
    { label: "electronics", value: "electronics" },
    { label: "women's clothing", value: "women's clothing" },
  ]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.log("error message", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const onGenderOpen = useCallback(() => {
    setOpen(false);
  }, []);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId, modalVisible]);

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

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) setUserId(token);
    };
    fetchUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={Logo} style={styles.headerLogo} />
        <View style={styles.searchContainer}>
          <AntDesign name="search1" size={20} color={COLORS.gray} style={styles.searchIcon} />
          <TextInput
            placeholder="Search products..."
            placeholderTextColor={COLORS.gray}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Feather name="mic" size={24} color={COLORS.text} style={styles.micIcon} />
      </View>

      <Pressable onPress={() => setModalVisible(!modalVisible)} style={styles.addressBar}>
        <Ionicons name="location-outline" size={22} color={COLORS.text} />
        <View style={styles.addressTextContainer}>
          {selectedAddress ? (
            <Text style={styles.addressText} numberOfLines={1}>
              Deliver to {selectedAddress?.name} - {selectedAddress?.street}
            </Text>
          ) : (
            <Text style={styles.addressPlaceholder}>Select a delivery address</Text>
          )}
        </View>
        <MaterialIcons name="keyboard-arrow-down" size={24} color={COLORS.text} />
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {list.map((item, index) => (
            <Pressable key={index} style={styles.categoryItem}>
              <View style={styles.categoryImageContainer}>
                <Image style={styles.categoryImage} source={{ uri: item.image }} />
              </View>
              <Text style={styles.categoryName}>{item?.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Trending Deals */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Deals of the week</Text>
        </View>
        <View style={styles.dealsGrid}>
          {deals.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => navigation.navigate("Info", { item })}
              style={styles.dealCard}
            >
              <Image style={styles.dealImage} source={{ uri: item?.image }} />
            </Pressable>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Today's Deals */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Deals</Text>
          <Text style={styles.seeAllText}>See all</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.offersScroll}>
          {offers.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => navigation.navigate("Info", { item })}
              style={styles.offerCard}
            >
              <Image style={styles.offerImage} source={{ uri: item?.image }} />
              <View style={styles.offerTag}>
                <Text style={styles.offerTagText}>Upto {item?.offer}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.divider} />

        {/* Category Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <View style={styles.pickerContainer}>
            <DropDownPicker
              style={styles.picker}
              open={open}
              value={category}
              items={items}
              setOpen={setOpen}
              setValue={setCategory}
              setItems={setItems}
              placeholder="Choose category"
              onOpen={onGenderOpen}
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>
        </View>

        {/* Products List */}
        <View style={styles.productsGrid}>
          {filteredProducts
            ?.filter((item) => !category || item.category === category)
            .map((item, index) => (
              <ProductItem item={item} key={index} />
            ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose your Location</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <AntDesign name="close" size={24} color={COLORS.text} />
              </Pressable>
            </View>
            <Text style={styles.modalSubtitle}>
              Select a delivery location to see product availability and delivery options
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.addressList}>
              {addresses?.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => setSelectedAddress(item)}
                  style={[
                    styles.addressCard,
                    selectedAddress?._id === item._id && styles.selectedAddressCard,
                  ]}
                >
                  <View style={styles.addressCardHeader}>
                    <Text style={styles.addressName}>{item?.name}</Text>
                    <Entypo name="location-pin" size={20} color={COLORS.error} />
                  </View>
                  <Text numberOfLines={2} style={styles.addressDetail}>
                    {item?.houseNo}, {item?.street}, {item?.landmark}
                  </Text>
                  <Text style={styles.addressDetail}>{item?.city}, {item?.country}</Text>
                </Pressable>
              ))}

              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("Address");
                }}
                style={styles.addAddressCard}
              >
                <AntDesign name="plus" size={24} color={COLORS.blue} />
                <Text style={styles.addAddressText}>Add an Address</Text>
              </Pressable>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Pressable style={styles.footerAction}>
                <Entypo name="location-pin" size={22} color={COLORS.blue} />
                <Text style={styles.footerActionText}>Enter a Pakistani pincode</Text>
              </Pressable>
              <Pressable style={styles.footerAction}>
                <Ionicons name="locate-sharp" size={22} color={COLORS.blue} />
                <Text style={styles.footerActionText}>Use My Current location</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.secondary,
    padding: SPACING.m,
    paddingTop: Platform.OS === "ios" ? SPACING.xs : SPACING.m,
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    width: 80,
    height: 35,
    resizeMode: "contain",
    marginRight: SPACING.s,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.s,
    height: 40,
    flex: 1,
    paddingHorizontal: SPACING.m,
    marginRight: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  searchIcon: {
    marginRight: SPACING.s,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  micIcon: {
    marginLeft: SPACING.xs,
  },
  addressBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.s + 2,
    backgroundColor: COLORS.accent,
  },
  addressTextContainer: {
    flex: 1,
    marginHorizontal: SPACING.s,
  },
  addressText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "500",
  },
  addressPlaceholder: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "500",
  },
  categoryScroll: {
    paddingTop: 4,
    paddingBottom: 0,
    backgroundColor: COLORS.white,
  },
  categoryItem: {
    marginHorizontal: SPACING.s,
    alignItems: "center",
    width: 75,
  },
  categoryImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  categoryImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  categoryName: {
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.text,
    textAlign: "center",
  },
  bannerContainer: {
    marginTop: 0,
  },
  bannerImage: {
    width: width,
    height: 220,
    resizeMode: "cover",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.m,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  seeAllText: {
    color: COLORS.blue,
    fontWeight: "600",
  },
  dealsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: SPACING.s,
  },
  dealCard: {
    width: (width - SPACING.l * 2) / 2,
    height: 180,
    margin: SPACING.s,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.m,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  dealImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  divider: {
    height: 4,
    backgroundColor: COLORS.lightGray,
    marginVertical: 4,
  },
  offersScroll: {
    paddingHorizontal: SPACING.s,
    paddingBottom: SPACING.m,
  },
  offerCard: {
    width: 160,
    margin: SPACING.s,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.m,
    padding: SPACING.s,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  offerImage: {
    width: 140,
    height: 140,
    resizeMode: "contain",
  },
  offerTag: {
    backgroundColor: COLORS.error,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BORDER_RADIUS.s,
    marginTop: SPACING.s,
    width: "100%",
  },
  offerTagText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  filterSection: {
    paddingHorizontal: SPACING.m,
  },
  pickerContainer: {
    marginTop: SPACING.s,
    zIndex: 3000,
  },
  picker: {
    borderColor: COLORS.gray,
    height: 45,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: SPACING.s,
    justifyContent: "space-between",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.l,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.s,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  modalSubtitle: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: SPACING.l,
    lineHeight: 18,
  },
  addressList: {
    marginBottom: SPACING.l,
  },
  addressCard: {
    width: 150,
    height: 140,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: BORDER_RADIUS.m,
    padding: SPACING.m,
    marginRight: SPACING.m,
    backgroundColor: COLORS.white,
    justifyContent: "space-between",
  },
  selectedAddressCard: {
    borderColor: COLORS.primary,
    backgroundColor: "#FFFBF0",
    borderWidth: 2,
  },
  addressCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressName: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
  },
  addressDetail: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 16,
  },
  addAddressCard: {
    width: 150,
    height: 140,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderStyle: "dashed",
    borderRadius: BORDER_RADIUS.m,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.m,
    backgroundColor: COLORS.lightGray,
  },
  addAddressText: {
    marginTop: SPACING.s,
    color: COLORS.blue,
    fontWeight: "600",
    textAlign: "center",
    fontSize: 13,
  },
  modalFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: SPACING.m,
  },
  footerAction: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.m,
  },
  footerActionText: {
    marginLeft: SPACING.s,
    color: COLORS.blue,
    fontSize: 14,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  divider: {
    height: 6,
    backgroundColor: COLORS.lightGray,
    marginVertical: SPACING.s,
  },
});

