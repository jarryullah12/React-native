import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { useGame } from '../contexts/GameContext';
import { useColors } from '../hooks/useColors';
import { LEVELS } from '../lib/levels';

export function LevelComplete() {
  const { levelStatus, starsEarned, currentLevel, score, movesUsed, restartLevel, nextLevel } = useGame();
  const colors = useColors();
  const router = useRouter();

  const overlayOpacity = useSharedValue(0);
  const star1 = useSharedValue(0);
  const star2 = useSharedValue(0);
  const star3 = useSharedValue(0);

  useEffect(() => {
    if (levelStatus === 'won') {
      overlayOpacity.value = withTiming(1, { duration: 350 });
      star1.value = 0;
      star2.value = 0;
      star3.value = 0;
      if (starsEarned >= 1) star1.value = withDelay(200, withSpring(1, { damping: 10, stiffness: 140 }));
      if (starsEarned >= 2) star2.value = withDelay(400, withSpring(1, { damping: 10, stiffness: 140 }));
      if (starsEarned >= 3) star3.value = withDelay(600, withSpring(1, { damping: 10, stiffness: 140 }));
    } else {
      overlayOpacity.value = 0;
      star1.value = 0;
      star2.value = 0;
      star3.value = 0;
    }
  }, [levelStatus, starsEarned]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.value }));
  const star1Style = useAnimatedStyle(() => ({ transform: [{ scale: star1.value }], opacity: star1.value }));
  const star2Style = useAnimatedStyle(() => ({ transform: [{ scale: star2.value }], opacity: star2.value }));
  const star3Style = useAnimatedStyle(() => ({ transform: [{ scale: star3.value }], opacity: star3.value }));

  if (levelStatus !== 'won' || !currentLevel) return null;

  const hasNext = LEVELS.some(l => l.id === currentLevel.id + 1);

  return (
    <Animated.View style={[styles.overlay, overlayStyle, { backgroundColor: colors.background + 'EE' }]}>
      <View style={[styles.modal, { backgroundColor: colors.card, borderRadius: colors.radius + 4 }]}>
        <Text style={[styles.kicker, { color: colors.mutedForeground }]}>LEVEL {currentLevel.id} COMPLETE</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>Beautifully done</Text>

        <View style={styles.starsRow}>
          <Animated.View style={star1Style}>
            <Feather name="star" size={44} color={starsEarned >= 1 ? colors.star : colors.starInactive} />
          </Animated.View>
          <Animated.View style={[star2Style, { marginHorizontal: 8 }]}>
            <Feather name="star" size={56} color={starsEarned >= 2 ? colors.star : colors.starInactive} />
          </Animated.View>
          <Animated.View style={star3Style}>
            <Feather name="star" size={44} color={starsEarned >= 3 ? colors.star : colors.starInactive} />
          </Animated.View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>SCORE</Text>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{score}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>MOVES</Text>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{movesUsed}</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.secondaryBtn, { backgroundColor: colors.muted, borderRadius: colors.radius }]}
            onPress={() => router.push('/')}
          >
            <Text style={[styles.secondaryBtnText, { color: colors.foreground }]}>Levels</Text>
          </TouchableOpacity>
          {hasNext ? (
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
              onPress={nextLevel}
            >
              <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>Next Level</Text>
              <Feather name="arrow-right" size={16} color={colors.primaryForeground} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
              onPress={restartLevel}
            >
              <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>Replay</Text>
            </TouchableOpacity>
          )}
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
    maxWidth: 380,
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
    marginBottom: 18,
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    height: 60,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  stat: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
  },
  divider: {
    width: 1,
    height: 32,
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
