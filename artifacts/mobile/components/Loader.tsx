import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useColors } from '../hooks/useColors';

export function Loader() {
  const colors = useColors();
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1100, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.95, { duration: 1100, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.6, { duration: 1100, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={logoStyle}>
        <Image
          source={require('../assets/images/icon.png')}
          style={[styles.logo, { borderRadius: 24 }]}
          resizeMode="cover"
        />
      </Animated.View>
      <Text style={[styles.title, { color: colors.foreground }]}>Zen Merge</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>finding stillness…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 96,
    height: 96,
  },
  title: {
    marginTop: 24,
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    letterSpacing: 0.3,
  },
});
