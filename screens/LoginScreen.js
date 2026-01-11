import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import Logo from "../assets/logo.png";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useContext } from "react";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../supabase";
import { COLORS, BORDER_RADIUS, SPACING } from "../constants/theme";
import { UserType } from "../UserContext";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const { setUserId } = useContext(UserType);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          setUserId(token);
          navigation.replace("Main");
        }
      } catch (err) {
        console.log("error message", err);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email.toLowerCase().trim())
        .single();

      if (userError || !user) {
        Alert.alert("Login Error", "Invalid email or password");
        return;
      }

      if (user.password !== password) {
        Alert.alert("Login Error", "Invalid email or password");
        return;
      }

      await AsyncStorage.setItem("authToken", user.id);
      setUserId(user.id);
      navigation.replace("Main");
    } catch (error) {
      Alert.alert("Login Error", "An error occurred during login");
      console.log(error);
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to your account</Text>
          </View>

          <View style={styles.form}>
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

            <View style={styles.row}>
              <View style={styles.rememberMe}>
                <View style={styles.checkbox} />
                <Text style={styles.rememberText}>Keep me logged in</Text>
              </View>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </View>

            <Pressable onPress={handleLogin} style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>

            <Pressable onPress={() => navigation.navigate("Register")} style={styles.signUpButton}>
              <Text style={styles.signUpText}>
                Don't have an account? <Text style={styles.signUpHighlight}>Sign Up</Text>
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

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
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: SPACING.s,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 4,
    marginRight: SPACING.s,
  },
  rememberText: {
    fontSize: 14,
    color: COLORS.text,
  },
  forgotPassword: {
    fontSize: 14,
    color: COLORS.blue,
    fontWeight: "600",
  },
  loginButton: {
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
  loginButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpButton: {
    marginTop: SPACING.l,
  },
  signUpText: {
    textAlign: "center",
    fontSize: 15,
    color: COLORS.gray,
  },
  signUpHighlight: {
    color: COLORS.blue,
    fontWeight: "bold",
  },
});
