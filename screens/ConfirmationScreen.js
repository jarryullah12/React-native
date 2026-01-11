import { StyleSheet, Text, View, ScrollView, Pressable, Alert, Dimensions, Platform } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { UserType } from "../UserContext";
import { Entypo, FontAwesome5, MaterialIcons, AntDesign, Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { cleanCart } from "../redux/CartReducer";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../supabase";
import { COLORS, BORDER_RADIUS, SPACING } from "../constants/theme";

const { width } = Dimensions.get("window");

const ConfirmationScreen = () => {
  const steps = [
    { title: "Address", icon: "location-pin" },
    { title: "Delivery", icon: "truck" },
    { title: "Payment", icon: "credit-card" },
    { title: "Place Order", icon: "check-circle" },
  ];
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const { userId } = useContext(UserType);
  const cart = useSelector((state) => state.cart.cart);
  const total = cart
    ?.map((item) => item.price * item.quantity)
    .reduce((curr, prev) => curr + prev, 0);

  useEffect(() => {
    if (userId) fetchAddresses();
  }, [userId]);

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

    const dispatch = useDispatch();
      const [selectedAddress, setSelectedAddress] = useState("");
      const [deliveryOption, setDeliveryOption] = useState("standard");
      const [paymentMethod, setPaymentMethod] = useState("");
  
    const handlePlaceOrder = async () => {
      if (!selectedAddress || !deliveryOption || !paymentMethod) {
        Alert.alert("Error", "Please complete all steps");
        return;
      }
      try {
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert([
            {
              user_id: userId,
              total_price: total,
              payment_method: paymentMethod,
              shipping_address: selectedAddress,
            },
          ])
          .select()
          .single();
  
        if (orderError) throw orderError;
  
        const orderItems = cart.map((item) => ({
          order_id: order.id,
          name: item?.title,
          quantity: item.quantity,
          price: item.price,
          image: item?.image,
        }));
  
        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems);
  
        if (itemsError) throw itemsError;
  
        dispatch(cleanCart());
        navigation.navigate("Order");
      } catch (error) {
        Alert.alert("Error", "Failed to place order");
        console.log("error", error);
      }
    };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color={COLORS.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <View style={styles.stepperContainer}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepItem}>
            <View
              style={[
                styles.stepCircle,
                index <= currentStep && styles.activeStepCircle,
                index < currentStep && styles.completedStepCircle,
              ]}
            >
              {index < currentStep ? (
                <Ionicons name="checkmark" size={18} color={COLORS.white} />
              ) : (
                <Text style={[styles.stepNumber, index <= currentStep && styles.activeStepNumber]}>
                  {index + 1}
                </Text>
              )}
            </View>
            <Text style={[styles.stepLabel, index <= currentStep && styles.activeStepLabel]}>
              {step.title}
            </Text>
            {index < steps.length - 1 && (
              <View style={[styles.stepLine, index < currentStep && styles.activeStepLine]} />
            )}
          </View>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {currentStep === 0 && (
          <View style={styles.stepContent}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Select Delivery Address</Text>
              <Pressable onPress={() => navigation.navigate("Address")}>
                <Text style={{ color: COLORS.blue, fontWeight: "600" }}>Manage</Text>
              </Pressable>
            </View>

            <View style={styles.addressList}>
              {addresses?.map((item, index) => (
                  <Pressable
                    key={index}
                    onPress={() => setSelectedAddress(item)}
                    style={[
                      styles.addressCard,
                      selectedAddress?._id === item?._id && styles.selectedAddressCard,
                    ]}
                  >
                  <View style={styles.radioContainer}>
                    {selectedAddress?._id === item?._id ? (
                      <FontAwesome5 name="dot-circle" size={20} color={COLORS.blue} />
                    ) : (
                      <Entypo name="circle" size={20} color={COLORS.gray} />
                    )}
                  </View>
                  <View style={styles.addressInfo}>
                    <Text style={styles.addressName}>{item?.name}</Text>
                    <Text style={styles.addressDetail}>{item?.houseNo}, {item?.street}</Text>
                    <Text style={styles.addressDetail}>{item?.landmark}, {item?.city}</Text>
                    <Text style={styles.addressDetail}>Phone: {item?.mobileNo}</Text>
                  </View>
                </Pressable>
              ))}

              <Pressable
                onPress={() => navigation.navigate("Add")}
                style={styles.addNewAddressButton}
              >
                <AntDesign name="plus" size={20} color={COLORS.blue} />
                <Text style={styles.addNewAddressText}>Add a new address</Text>
              </Pressable>
            </View>

            {selectedAddress ? (
              <Pressable onPress={() => setCurrentStep(1)} style={styles.nextButton}>
                <Text style={styles.nextButtonText}>Deliver to this Address</Text>
              </Pressable>
            ) : (
              <Text style={styles.helperText}>Please select or add an address to continue</Text>
            )}
          </View>
        )}

        {currentStep === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Delivery Options</Text>
            <Pressable
              onPress={() => setDeliveryOption("standard")}
              style={[styles.optionCard, deliveryOption === "standard" && styles.selectedOptionCard]}
            >
              <FontAwesome5
                name={deliveryOption === "standard" ? "dot-circle" : "circle"}
                size={20}
                color={deliveryOption === "standard" ? COLORS.blue : COLORS.gray}
              />
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Standard Delivery</Text>
                <Text style={styles.optionDesc}>
                  <Text style={{ color: "green", fontWeight: "bold" }}>Tomorrow by 10 PM</Text> - FREE with Prime
                </Text>
              </View>
            </Pressable>

            <View style={styles.buttonRow}>
              <Pressable onPress={() => setCurrentStep(0)} style={[styles.nextButton, styles.prevButton]}>
                <Text style={styles.prevButtonText}>Back</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  if (deliveryOption) setCurrentStep(2);
                  else Alert.alert("Error", "Please select a delivery option");
                }}
                style={[styles.nextButton, { flex: 2 }]}
              >
                <Text style={styles.nextButtonText}>Continue</Text>
              </Pressable>
            </View>
          </View>
        )}

        {currentStep === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.optionsList}>
              <Pressable
                onPress={() => setPaymentMethod("cash")}
                style={[styles.optionCard, paymentMethod === "cash" && styles.selectedOptionCard]}
              >
                <FontAwesome5
                  name={paymentMethod === "cash" ? "dot-circle" : "circle"}
                  size={20}
                  color={paymentMethod === "cash" ? COLORS.blue : COLORS.gray}
                />
                <Text style={styles.optionTitle}>Cash on Delivery</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setPaymentMethod("card");
                  Alert.alert("Payment", "Online payment is currently simulated.");
                }}
                style={[styles.optionCard, paymentMethod === "card" && styles.selectedOptionCard]}
              >
                <FontAwesome5
                  name={paymentMethod === "card" ? "dot-circle" : "circle"}
                  size={20}
                  color={paymentMethod === "card" ? COLORS.blue : COLORS.gray}
                />
                <Text style={styles.optionTitle}>Credit / Debit Card / UPI</Text>
              </Pressable>
            </View>

            <View style={styles.buttonRow}>
              <Pressable onPress={() => setCurrentStep(1)} style={[styles.nextButton, styles.prevButton]}>
                <Text style={styles.prevButtonText}>Back</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  if (paymentMethod) setCurrentStep(3);
                  else Alert.alert("Error", "Please select a payment method");
                }}
                style={[styles.nextButton, { flex: 2 }]}
              >
                <Text style={styles.nextButtonText}>Continue</Text>
              </Pressable>
            </View>
          </View>
        )}

        {currentStep === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Order Summary</Text>

            <View style={styles.itemsSummary}>
              <Text style={styles.subTitle}>Items ({cart.length})</Text>
              {cart.map((item, index) => (
                <View key={index} style={styles.summaryItemRow}>
                  <Text numberOfLines={1} style={styles.itemName}>{item.title}</Text>
                  <Text style={styles.itemPriceText}>Rs. {item.price} x {item.quantity}</Text>
                </View>
              ))}
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Items Total:</Text>
                <Text style={styles.summaryValue}>Rs. {total.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee:</Text>
                <Text style={[styles.summaryValue, { color: "green" }]}>FREE</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Order Total:</Text>
                <Text style={styles.totalValue}>Rs. {total.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Shipping to:</Text>
              <Text style={styles.infoText}>{selectedAddress?.name}</Text>
              <Text style={styles.infoText}>
                {selectedAddress?.houseNo}, {selectedAddress?.street}, {selectedAddress?.city}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Payment Method:</Text>
              <Text style={styles.infoText}>
                {paymentMethod === "cash" ? "Cash on Delivery" : "Online Payment"}
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <Pressable onPress={() => setCurrentStep(2)} style={[styles.nextButton, styles.prevButton, { marginTop: SPACING.l }]}>
                <Text style={styles.prevButtonText}>Back</Text>
              </Pressable>
              <Pressable onPress={handlePlaceOrder} style={[styles.placeOrderButton, { flex: 2 }]}>
                <Text style={styles.placeOrderText}>Place Order</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ConfirmationScreen;

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
    marginRight: SPACING.m,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  stepperContainer: {
    flexDirection: "row",
    padding: SPACING.m,
    backgroundColor: COLORS.lightGray,
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepItem: {
    alignItems: "center",
    flex: 1,
    position: "relative",
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.gray,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  activeStepCircle: {
    backgroundColor: COLORS.blue,
  },
  completedStepCircle: {
    backgroundColor: "green",
  },
  stepNumber: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  stepLabel: {
    fontSize: 10,
    color: COLORS.gray,
    marginTop: 4,
    fontWeight: "600",
  },
  activeStepLabel: {
    color: COLORS.text,
  },
  stepLine: {
    position: "absolute",
    height: 2,
    backgroundColor: COLORS.gray,
    width: "100%",
    top: 15,
    left: "50%",
    zIndex: 1,
  },
  activeStepLine: {
    backgroundColor: "green",
  },
  scrollContent: {
    padding: SPACING.m,
  },
  stepContent: {
    gap: SPACING.m,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.s,
  },
  addNewAddressButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.blue,
    borderRadius: BORDER_RADIUS.m,
    borderStyle: "dashed",
    gap: SPACING.s,
  },
  addNewAddressText: {
    fontSize: 16,
    color: COLORS.blue,
    fontWeight: "600",
  },
  helperText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    marginTop: SPACING.m,
  },
  buttonRow: {
    flexDirection: "row",
    gap: SPACING.m,
    marginTop: SPACING.m,
  },
  prevButton: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  prevButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  itemsSummary: {
    padding: SPACING.m,
    backgroundColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.m,
    marginBottom: SPACING.m,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  summaryItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.xs,
  },
  itemName: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.m,
  },
  itemPriceText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  addressList: {
    gap: SPACING.m,
  },
  addressCard: {
    flexDirection: "row",
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: BORDER_RADIUS.m,
    backgroundColor: COLORS.white,
  },
  selectedAddressCard: {
    borderColor: COLORS.blue,
    backgroundColor: "#E6F2FF",
  },
  radioContainer: {
    marginRight: SPACING.m,
    justifyContent: "center",
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  addressDetail: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.8,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: BORDER_RADIUS.m,
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.m,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: BORDER_RADIUS.m,
    gap: SPACING.m,
  },
  selectedOptionCard: {
    borderColor: COLORS.blue,
    backgroundColor: "#E6F2FF",
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  optionDesc: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  summaryCard: {
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: BORDER_RADIUS.m,
    backgroundColor: COLORS.white,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.s,
  },
  summaryLabel: {
    fontSize: 15,
    color: COLORS.gray,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.error,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SPACING.s,
  },
  infoCard: {
    padding: SPACING.m,
    backgroundColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.m,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.gray,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 15,
    color: COLORS.text,
  },
  placeOrderButton: {
    backgroundColor: COLORS.primary,
    height: 55,
    borderRadius: BORDER_RADIUS.m,
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.l,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  placeOrderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
});
