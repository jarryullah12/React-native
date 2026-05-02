import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '../contexts/GameContext';
import { useMusic } from '../contexts/MusicContext';
import { useColors } from '../hooks/useColors';

function objectiveText(level: NonNullable<ReturnType<typeof useGame>['currentLevel']>): string {
  const o = level.objective;
  if (o.type === 'reach-tile') return `Reach the ${o.target} tile`;
  if (o.type === 'score') return `Score ${o.target} points`;
  return `Make ${o.target} merges`;
}

export function LevelHeader() {
  const {
    currentLevel, score, coins, movesRemaining, movesUsed, mergesCount,
    moveHistoryCount, undo, restartLevel, theme, toggleTheme, dangerWarning,
  } = useGame();
  const { enabled: musicEnabled, toggleMusic } = useMusic();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  if (!currentLevel) return null;

  const c = colors as any;
  const diffColor =
    currentLevel.difficulty === 'easy' ? c.easy
    : currentLevel.difficulty === 'medium' ? c.medium
    : currentLevel.difficulty === 'hard' ? c.hard
    : currentLevel.difficulty === 'expert' ? c.expert
    : c.master;
  const diffBg =
    currentLevel.difficulty === 'easy' ? c.easyBg
    : currentLevel.difficulty === 'medium' ? c.mediumBg
    : currentLevel.difficulty === 'hard' ? c.hardBg
    : currentLevel.difficulty === 'expert' ? c.expertBg
    : c.masterBg;
  const diffLabel = currentLevel.difficulty.charAt(0).toUpperCase() + currentLevel.difficulty.slice(1);

  const obj = currentLevel.objective;
  const objProgress =
    obj.type === 'score' ? `${score} / ${obj.target}`
    : obj.type === 'merges' ? `${mergesCount} / ${obj.target}`
    : `${movesUsed} moves`;

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={() => router.push('/')}
          style={[styles.iconButton, { backgroundColor: colors.card, borderRadius: colors.radius }]}
        >
          <Feather name="chevron-left" size={20} color={colors.foreground} />
        </TouchableOpacity>

        <View style={styles.centerCol}>
          <Text style={[styles.levelLabel, { color: colors.mutedForeground }]}>LEVEL {currentLevel.id}</Text>
          <View style={[styles.diffPill, { backgroundColor: diffBg, marginTop: 2 }]}>
            <Text style={[styles.diffPillText, { color: diffColor }]}>{diffLabel}</Text>
          </View>
        </View>

        <View style={styles.rightControls}>
          {dangerWarning && (
            <View style={[styles.dangerPill, { backgroundColor: '#FF000018' }]}>
              <Text style={{ fontSize: 12 }}>💣</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={toggleMusic}
            style={[styles.iconButton, { backgroundColor: colors.card, borderRadius: colors.radius }]}
          >
            <Feather name={musicEnabled ? 'volume-2' : 'volume-x'} size={18} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.iconButton, { backgroundColor: colors.card, borderRadius: colors.radius }]}
          >
            <Feather name={theme === 'dark' ? 'sun' : 'moon'} size={20} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.objectiveBox, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
        <View style={styles.objectiveRow}>
          <Feather name="target" size={14} color={diffColor} />
          <Text style={[styles.objectiveLabel, { color: colors.mutedForeground }]}>OBJECTIVE</Text>
        </View>
        <Text style={[styles.objectiveText, { color: colors.foreground }]}>{objectiveText(currentLevel)}</Text>
        <Text style={[styles.objectiveProgress, { color: colors.mutedForeground }]}>{objProgress}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>MOVES LEFT</Text>
          <Text style={[styles.statValue, { color: colors.foreground }]}>{movesRemaining ?? '—'}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>SCORE</Text>
          <Text style={[styles.statValue, { color: colors.foreground }]}>{score}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: (colors as any).coin + '18', borderRadius: colors.radius }]}>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>COINS</Text>
          <Text style={[styles.statValue, { color: (colors as any).coin }]}>{coins}</Text>
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
          <Feather name="rotate-ccw" size={16} color={colors.foreground} />
          <Text style={[styles.actionText, { color: colors.foreground }]}>
            Undo {moveHistoryCount > 0 ? `(${moveHistoryCount})` : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.card, borderRadius: colors.radius }]}
          onPress={restartLevel}
        >
          <Feather name="refresh-cw" size={16} color={colors.foreground} />
          <Text style={[styles.actionText, { color: colors.foreground }]}>Restart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightControls: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dangerPill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerCol: {
    alignItems: 'center',
  },
  levelLabel: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1.2,
  },
  diffPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  diffPillText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
  },
  objectiveBox: {
    padding: 11,
    marginBottom: 8,
  },
  objectiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  objectiveLabel: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  objectiveText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    marginBottom: 1,
  },
  objectiveProgress: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  statBox: {
    flex: 1,
    padding: 9,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    gap: 6,
  },
  actionText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
});
