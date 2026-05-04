import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../hooks/useColors';
import { useGame } from '../contexts/GameContext';
import { useMusic } from '../contexts/MusicContext';
import { LEVELS, Level, Difficulty } from '../lib/levels';

const DIFFICULTIES: { key: Difficulty; label: string }[] = [
  { key: 'easy', label: 'Easy' },
  { key: 'medium', label: 'Medium' },
  { key: 'hard', label: 'Hard' },
  { key: 'expert', label: 'Expert' },
  { key: 'master', label: 'Master' },
];

function objectiveLabel(level: Level): string {
  const o = level.objective;
  if (o.type === 'reach-tile') return `Reach ${o.target}`;
  if (o.type === 'score') return `Score ${o.target}`;
  return `${o.target} merges`;
}

function StarRow({ count, size = 10, color, inactive }: { count: number; size?: number; color: string; inactive: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2, marginTop: 4 }}>
      {[1, 2, 3].map(i => (
        <Feather
          key={i}
          name="star"
          size={size}
          color={i <= count ? color : inactive}
          style={i <= count ? { opacity: 1 } : { opacity: 0.5 }}
        />
      ))}
    </View>
  );
}

export default function LevelSelectScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { levelProgress, totalStars, theme, toggleTheme } = useGame();
  const { enabled: musicEnabled, toggleMusic } = useMusic();
  const isWeb = Platform.OS === 'web';

  const grouped = useMemo(() => {
    const groups: Record<Difficulty, Level[]> = { easy: [], medium: [], hard: [], expert: [], master: [] };
    LEVELS.forEach(l => groups[l.difficulty].push(l));
    return groups;
  }, []);

  const isUnlocked = (id: number) => id === 1 || (levelProgress[id - 1]?.stars ?? 0) > 0;
  const completedCount = (diff: Difficulty) =>
    grouped[diff].filter(l => (levelProgress[l.id]?.stars ?? 0) > 0).length;

  const c = colors as any;
  const diffColor = (d: Difficulty) =>
    d === 'easy' ? c.easy : d === 'medium' ? c.medium : d === 'hard' ? c.hard
    : d === 'expert' ? c.expert : c.master;
  const diffBg = (d: Difficulty) =>
    d === 'easy' ? c.easyBg : d === 'medium' ? c.mediumBg : d === 'hard' ? c.hardBg
    : d === 'expert' ? c.expertBg : c.masterBg;

  const allComplete = totalStars >= 600;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: isWeb ? 67 : 0, paddingBottom: isWeb ? 34 : 0 }]}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <View style={styles.topRow}>
          <View style={styles.brandRow}>
            <Image source={require('../assets/images/icon.png')} style={styles.logoImg} />
            <View>
              <Text style={[styles.title, { color: colors.foreground }]}>Zen Merge</Text>
              <View style={styles.starsRow}>
                <Feather name={allComplete ? 'award' : 'star'} size={14} color={colors.star} />
                <Text style={[styles.starsText, { color: colors.mutedForeground }]}>
                  {totalStars} / 600
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.headerControls}>
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
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) + 24 }]}>
        <TouchableOpacity
          style={[styles.freePlayCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}
          onPress={() => router.push('/play?mode=free')}
          activeOpacity={0.85}
        >
          <View style={styles.freePlayLeft}>
            <View style={[styles.freePlayIcon, { backgroundColor: colors.primary, borderRadius: colors.radius }]}>
              <Feather name="wind" size={20} color={colors.primaryForeground} />
            </View>
            <View>
              <Text style={[styles.freePlayTitle, { color: colors.foreground }]}>Free Play</Text>
              <Text style={[styles.freePlaySub, { color: colors.mutedForeground }]}>
                Endless · No limits · Just merge
              </Text>
            </View>
          </View>
          <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
        </TouchableOpacity>

        {DIFFICULTIES.map(({ key, label }) => {
          const completed = completedCount(key);
          const total = grouped[key].length;
          const progress = total ? completed / total : 0;
          return (
            <View key={key} style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionHeaderLeft}>
                  <View style={[styles.diffPill, { backgroundColor: diffBg(key) }]}>
                    <Text style={[styles.diffPillText, { color: diffColor(key) }]}>{label}</Text>
                  </View>
                  <Text style={[styles.sectionCount, { color: colors.mutedForeground }]}>
                    {completed}/{total} completed
                  </Text>
                </View>
              </View>
              <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
                <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: diffColor(key) }]} />
              </View>
              <View style={styles.grid}>
                {grouped[key].map(level => {
                  const prog = levelProgress[level.id];
                  const stars = prog?.stars ?? 0;
                  const unlocked = isUnlocked(level.id);
                  return (
                    <TouchableOpacity
                      key={level.id}
                      style={[
                        styles.levelCard,
                        {
                          backgroundColor: unlocked ? colors.card : colors.muted,
                          borderRadius: colors.radius,
                          opacity: unlocked ? 1 : 0.55,
                          borderColor: stars > 0 ? diffColor(key) : 'transparent',
                          borderWidth: stars > 0 ? 1 : 0,
                        }
                      ]}
                      onPress={() => unlocked && router.push(`/play?levelId=${level.id}`)}
                      activeOpacity={unlocked ? 0.8 : 1}
                      disabled={!unlocked}
                    >
                      {unlocked ? (
                        <>
                          <Text style={[styles.levelNum, { color: colors.foreground }]}>{level.id}</Text>
                          <StarRow count={stars} color={colors.star} inactive={colors.starInactive} />
                        </>
                      ) : (
                        <Feather name="lock" size={16} color={colors.mutedForeground} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
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
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoImg: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  starsText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerControls: {
    flexDirection: 'row',
    gap: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  freePlayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 28,
  },
  freePlayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  freePlayIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  freePlayTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  freePlaySub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  diffPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  diffPillText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
  },
  sectionCount: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  progressTrack: {
    height: 4,
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  levelCard: {
    width: '18.4%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
  },
  levelNum: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
});
