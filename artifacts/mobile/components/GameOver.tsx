import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useGame } from '../contexts/GameContext';
import { useColors } from '../hooks/useColors';

export function GameOver() {
  const { gameOver, newGame } = useGame();
  const colors = useColors();
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (gameOver) {
      opacity.value = withTiming(1, { duration: 500 });
    } else {
      opacity.value = 0;
    }
  }, [gameOver]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!gameOver) return null;

  return (
    <Animated.View style={[styles.overlay, style, { backgroundColor: colors.background + 'CC' }]}>
      <View style={[styles.modal, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Peace Achieved</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>No more moves available.</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary, borderRadius: colors.radius }]} onPress={newGame}>
          <Text style={[styles.buttonText, { color: colors.primaryForeground }]}>Play Again</Text>
        </TouchableOpacity>
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
  },
  modal: {
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  }
});