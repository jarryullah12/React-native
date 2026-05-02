import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGame } from '../contexts/GameContext';
import { useMusic } from '../contexts/MusicContext';
import { useColors } from '../hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function CoinBadge({ value, colors }: { value: number; colors: any }) {
  return (
    <View style={[styles.coinBadge, { backgroundColor: colors.coin + '22' }]}>
      <View style={[styles.coinCircle, { backgroundColor: colors.coin }]} />
      <Text style={[styles.coinText, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

export function Header() {
  const { score, bestScore, coins, moveHistoryCount, undo, newGame, theme, toggleTheme, dangerWarning } = useGame();
  const { enabled: musicEnabled, toggleMusic } = useMusic();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <Text style={[styles.title, { color: colors.foreground }]}>Zen Merge</Text>
          <CoinBadge value={coins} colors={colors} />
        </View>
        <View style={styles.controls}>
          {dangerWarning && (
            <View style={[styles.dangerBadge, { backgroundColor: '#FF000022' }]}>
              <Text style={styles.dangerEmoji}>💣</Text>
              <Text style={[styles.dangerText, { color: '#E53E3E' }]}>Danger!</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={toggleMusic}
            style={[styles.iconButton, { backgroundColor: colors.card, borderRadius: colors.radius }]}
          >
            <Feather name={musicEnabled ? 'volume-2' : 'volume-x'} size={20} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.iconButton, { backgroundColor: colors.card, borderRadius: colors.radius }]}
          >
            <Feather name={theme === 'dark' ? 'sun' : 'moon'} size={20} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.scoresRow}>
        <View style={[styles.scoreBox, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>SCORE</Text>
          <Text style={[styles.scoreValue, { color: colors.foreground }]}>{score}</Text>
        </View>
        <View style={[styles.scoreBox, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>BEST</Text>
          <Text style={[styles.scoreValue, { color: colors.foreground }]}>{bestScore}</Text>
        </View>
        <View style={[styles.scoreBox, { backgroundColor: colors.coin + '18', borderRadius: colors.radius }]}>
          <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>COINS</Text>
          <Text style={[styles.scoreValue, { color: colors.coin }]}>{coins}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: colors.card, opacity: moveHistoryCount > 0 ? 1 : 0.5, borderRadius: colors.radius },
          ]}
          onPress={undo}
          disabled={moveHistoryCount === 0}
        >
          <Feather name="rotate-ccw" size={18} color={colors.foreground} />
          <Text style={[styles.actionText, { color: colors.foreground }]}>
            Undo {moveHistoryCount > 0 ? `(${moveHistoryCount})` : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
          onPress={newGame}
        >
          <Feather name="play" size={18} color={colors.primaryForeground} />
          <Text style={[styles.actionText, { color: colors.primaryForeground }]}>New Game</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 5,
  },
  coinCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  coinText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  controls: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dangerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
  },
  dangerEmoji: {
    fontSize: 13,
  },
  dangerText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoresRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  scoreBox: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  scoreValue: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 8,
  },
  actionText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
});
