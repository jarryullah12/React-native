import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect } from "react";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS, SPACING } from "../constants/theme";

const OrderScreen = () => {
  const navigation = useNavigation();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Main");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <LottieView
          source={require("../assets/thumbs.json")}
          style={styles.animation}
          autoPlay
          loop={false}
          speed={0.7}
        />
        <Text style={styles.successText}>Order Placed Successfully!</Text>
        <Text style={styles.subText}>Thank you for shopping with us.</Text>
        
        <LottieView
          source={require("../assets/sparkle.json")}
          style={styles.sparkle}
          autoPlay
          loop={false}
          speed={0.7}
        />
      </View>
    </SafeAreaView>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.l,
  },
  animation: {
    height: 200,
    width: 200,
  },
  successText: {
    marginTop: SPACING.l,
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
  },
  subText: {
    marginTop: SPACING.s,
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
  },
  sparkle: {
    height: 300,
    width: 300,
    position: "absolute",
  },
});
