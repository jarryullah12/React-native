import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useGame } from '../contexts/GameContext';
import { useColors } from '../hooks/useColors';

export function LevelFailed() {
  const { levelStatus, currentLevel, restartLevel } = useGame();
  const colors = useColors();
  const router = useRouter();
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (levelStatus === 'failed') {
      opacity.value = withTiming(1, { duration: 400 });
    } else {
      opacity.value = 0;
    }
  }, [levelStatus]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  if (levelStatus !== 'failed' || !currentLevel) return null;

  return (
    <Animated.View style={[styles.overlay, style, { backgroundColor: colors.background + 'EE' }]}>
      <View style={[styles.modal, { backgroundColor: colors.card, borderRadius: colors.radius + 4 }]}>
        <Text style={[styles.kicker, { color: colors.mutedForeground }]}>LEVEL {currentLevel.id}</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>Almost there</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Take a breath. The stones are patient.
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.secondaryBtn, { backgroundColor: colors.muted, borderRadius: colors.radius }]}
            onPress={() => router.push('/')}
          >
            <Text style={[styles.secondaryBtnText, { color: colors.foreground }]}>Levels</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
            onPress={restartLevel}
          >
            <Feather name="rotate-ccw" size={16} color={colors.primaryForeground} />
            <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    paddingHorizontal: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 360,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  kicker: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1.4,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  primaryBtn: {
    flex: 1.4,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primaryBtnText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
  },
});
