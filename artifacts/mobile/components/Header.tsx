import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGame } from '../contexts/GameContext';
import { useMusic } from '../contexts/MusicContext';
import { useColors } from '../hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function Header() {
  const { score, bestScore, moveHistoryCount, undo, newGame, theme, toggleTheme } = useGame();
  const { enabled: musicEnabled, toggleMusic } = useMusic();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      <View style={styles.topRow}>
        <Text style={[styles.title, { color: colors.foreground }]}>Zen Merge</Text>
        <View style={styles.controls}>
          <TouchableOpacity onPress={toggleMusic} style={[styles.iconButton, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
            <Feather name={musicEnabled ? 'volume-2' : 'volume-x'} size={20} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleTheme} style={[styles.iconButton, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
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
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.card, opacity: moveHistoryCount > 0 ? 1 : 0.5, borderRadius: colors.radius }]} 
          onPress={undo}
          disabled={moveHistoryCount === 0}
        >
          <Feather name="rotate-ccw" size={18} color={colors.foreground} />
          <Text style={[styles.actionText, { color: colors.foreground }]}>Undo {moveHistoryCount > 0 ? `(${moveHistoryCount})` : ''}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary, borderRadius: colors.radius }]} onPress={newGame}>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoresRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  scoreBox: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 20,
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
    fontSize: 16,
  }
});