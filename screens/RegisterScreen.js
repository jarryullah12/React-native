import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import Logo from "../assets/logo.png";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useContext } from "react";
import { MaterialIcons, AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../supabase";
import { COLORS, BORDER_RADIUS, SPACING } from "../constants/theme";
import { UserType } from "../UserContext";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigation = useNavigation();
  const { setUserId } = useContext(UserType);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email.toLowerCase().trim())
        .single();

      if (existingUser) {
        Alert.alert("Registration Error", "Email already registered");
        return;
      }

      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([{ name, email: email.toLowerCase().trim(), password, verified: true }])
        .select()
        .single();

      if (insertError) throw insertError;

      await AsyncStorage.setItem("authToken", newUser.id);
      setUserId(newUser.id);

      Alert.alert("Registration successful", "You have been registered Successfully");
      navigation.replace("Main");
    } catch (error) {
      Alert.alert("Registration Error", "An error occurred while registering");
      console.log("registration failed", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={Logo}
          />
        </View>

        <KeyboardAvoidingView>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Fill in your details to get started</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={24} color={COLORS.gray} style={styles.inputIcon} />
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholder="Enter your Name"
                placeholderTextColor={COLORS.gray}
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={24} color={COLORS.gray} style={styles.inputIcon} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholder="Enter your Email"
                placeholderTextColor={COLORS.gray}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <AntDesign name="lock" size={24} color={COLORS.gray} style={styles.inputIcon} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                style={styles.input}
                placeholder="Enter your Password"
                placeholderTextColor={COLORS.gray}
              />
            </View>

            <Pressable onPress={handleRegister} style={styles.registerButton}>
              <Text style={styles.registerButtonText}>Register</Text>
            </Pressable>

            <Pressable onPress={() => navigation.goBack()} style={styles.signInButton}>
              <Text style={styles.signInText}>
                Already have an account? <Text style={styles.signInHighlight}>Sign In</Text>
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.xl,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  logo: {
    width: 150,
    height: 100,
    resizeMode: "contain",
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: SPACING.xs,
  },
  form: {
    marginTop: SPACING.m,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.m,
    paddingHorizontal: SPACING.m,
    marginBottom: SPACING.m,
    height: 55,
  },
  inputIcon: {
    marginRight: SPACING.s,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.m,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.xl,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  registerButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  signInButton: {
    marginTop: SPACING.l,
  },
  signInText: {
    textAlign: "center",
    fontSize: 15,
    color: COLORS.gray,
  },
  signInHighlight: {
    color: COLORS.blue,
    fontWeight: "bold",
  },
});
