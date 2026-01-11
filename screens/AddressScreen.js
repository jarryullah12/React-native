import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../supabase";
import { AntDesign } from "@expo/vector-icons";
import { COLORS, BORDER_RADIUS, SPACING } from "../constants/theme";

const AddressScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [houseNo, setHouseNo] = useState("");
    const [street, setStreet] = useState("");
    const [landmark, setLandmark] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const { userId, setUserId } = useContext(UserType);
  
    useEffect(() => {
      const fetchUser = async () => {
        const token = await AsyncStorage.getItem("authToken");
        if (token) setUserId(token);
      };
      fetchUser();
    }, []);
  
    const handleAddAddress = async () => {
      if (!name || !mobileNo || !houseNo || !street || !postalCode || !city) {
        Alert.alert("Error", "Please fill in all required fields");
        return;
      }
      try {
        const { error } = await supabase.from("addresses").insert([
          {
            user_id: userId,
            name,
            mobile_no: mobileNo,
            house_no: houseNo,
            street,
            landmark,
            city,
            postal_code: postalCode,
            country: "Pakistan",
          },
        ]);

      if (error) throw error;

      Alert.alert("Success", "Address added successfully");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to add address");
      console.log("error", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color={COLORS.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Add a new Address</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Country/Region</Text>
                <TextInput
                  placeholder="Pakistan"
                  placeholderTextColor={COLORS.gray}
                  editable={false}
                  style={[styles.input, styles.disabledInput]}
                />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full name (First and last name)</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={COLORS.gray}
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile number</Text>
              <TextInput
                value={mobileNo}
                onChangeText={setMobileNo}
                placeholder="Mobile No"
                placeholderTextColor={COLORS.gray}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Flat, House No, Building, Company</Text>
              <TextInput
                value={houseNo}
                onChangeText={setHouseNo}
                placeholderTextColor={COLORS.gray}
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Area, Street, Sector, Village</Text>
              <TextInput
                value={street}
                onChangeText={setStreet}
                placeholderTextColor={COLORS.gray}
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Landmark</Text>
                <TextInput
                  value={landmark}
                  onChangeText={setLandmark}
                  placeholder="e.g. near Apollo hospital"
                  placeholderTextColor={COLORS.gray}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  value={city}
                  onChangeText={setCity}
                  placeholder="Enter City"
                  placeholderTextColor={COLORS.gray}
                  style={styles.input}
                />
              </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pincode</Text>
              <TextInput
                value={postalCode}
                onChangeText={setPostalCode}
                placeholder="Enter Pincode"
                placeholderTextColor={COLORS.gray}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>

            <Pressable onPress={handleAddAddress} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Add Address</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddressScreen;

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
  },
  backButton: {
    marginRight: SPACING.m,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  scrollContent: {
    padding: SPACING.m,
  },
  form: {
    marginTop: SPACING.s,
  },
  inputGroup: {
    marginBottom: SPACING.m,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: BORDER_RADIUS.m,
    paddingHorizontal: SPACING.m,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  disabledInput: {
    backgroundColor: COLORS.lightGray,
    color: COLORS.gray,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    height: 55,
    borderRadius: BORDER_RADIUS.m,
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.m,
    marginBottom: SPACING.xl,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
});
