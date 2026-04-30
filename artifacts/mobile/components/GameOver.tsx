import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useGame } from '../contexts/GameContext';
import { useColors } from '../hooks/useColors';
import { Feather } from '@expo/vector-icons';

export function GameOver() {
  const { gameOver, score, bestScore, newGame } = useGame();
  const colors = useColors();
  const opacity = useSharedValue(0);
  const modalScale = useSharedValue(0.9);
  const modalOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.95);

  useEffect(() => {
    if (gameOver) {
      opacity.value = withTiming(1, { duration: 400 });
      modalOpacity.value = withDelay(120, withTiming(1, { duration: 380 }));
      modalScale.value = withDelay(120, withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) }));
      logoScale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1100, easing: Easing.inOut(Easing.quad) }),
          withTiming(0.95, { duration: 1100, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        false
      );
    } else {
      opacity.value = 0;
      modalOpacity.value = 0;
      modalScale.value = 0.9;
    }
  }, [gameOver]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const modalStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
    transform: [{ scale: modalScale.value }],
  }));
  const logoStyle = useAnimatedStyle(() => ({ transform: [{ scale: logoScale.value }] }));

  if (!gameOver) return null;

  const isNewBest = score > 0 && score >= bestScore;

  return (
    <Animated.View style={[styles.overlay, overlayStyle, { backgroundColor: colors.background + 'E6' }]}>
      <Animated.View
        style={[
          styles.modal,
          modalStyle,
          { backgroundColor: colors.card, borderRadius: colors.radius + 8, borderColor: colors.border },
        ]}
      >
        <Animated.View style={logoStyle}>
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.logo}
            resizeMode="cover"
          />
        </Animated.View>

        <Text style={[styles.title, { color: colors.foreground }]}>Game Over</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          The board is still. No more moves.
        </Text>

        <View style={[styles.statsRow, { borderColor: colors.border }]}>
          <View style={styles.statBlock}>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>SCORE</Text>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{score}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statBlock}>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>BEST</Text>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{bestScore}</Text>
          </View>
        </View>

        {isNewBest && (
          <View style={[styles.newBestBadge, { backgroundColor: colors.primary + '22' }]}>
            <Feather name="award" size={14} color={colors.primary} />
            <Text style={[styles.newBestText, { color: colors.primary }]}>New best score</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
          onPress={newGame}
          activeOpacity={0.85}
        >
          <Feather name="refresh-cw" size={16} color={colors.primaryForeground} />
          <Text style={[styles.buttonText, { color: colors.primaryForeground }]}>Begin Again</Text>
        </TouchableOpacity>
      </Animated.View>
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
    maxWidth: 340,
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginBottom: 22,
    textAlign: 'center',
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 18,
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 32,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
  },
  newBestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 18,
    gap: 6,
  },
  newBestText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 14,
    width: '100%',
    gap: 8,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.3,
  },
});
