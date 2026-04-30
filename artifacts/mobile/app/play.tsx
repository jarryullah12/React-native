import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useGame } from '@/contexts/GameContext';
import { Header } from '@/components/Header';
import { Board } from '@/components/Board';
import { GameOver } from '@/components/GameOver';
import { LevelHeader } from '@/components/LevelHeader';
import { LevelComplete } from '@/components/LevelComplete';
import { LevelFailed } from '@/components/LevelFailed';

export default function PlayScreen() {
  const params = useLocalSearchParams<{ mode?: string; levelId?: string }>();
  const colors = useColors();
  const router = useRouter();
  const { mode, startLevel, startFreePlay, currentLevel } = useGame();
  const isWeb = Platform.OS === 'web';
  const initialized = useRef<string | null>(null);

  useEffect(() => {
    const key = params.mode === 'free' ? 'free' : (params.levelId ? `level:${params.levelId}` : null);
    if (!key) {
      router.replace('/');
      return;
    }
    if (initialized.current === key) return;
    initialized.current = key;
    if (params.mode === 'free') {
      startFreePlay();
    } else if (params.levelId) {
      const id = parseInt(params.levelId, 10);
      if (Number.isFinite(id)) {
        startLevel(id);
      } else {
        router.replace('/');
      }
    }
  }, [params.mode, params.levelId]);

  const isLevel = mode === 'level' && currentLevel !== null;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: isWeb ? 67 : 0, paddingBottom: isWeb ? 34 : 0 },
      ]}
    >
      {isLevel ? <LevelHeader /> : <Header />}
      <View style={styles.boardContainer}>
        <Board />
      </View>
      {isLevel ? (
        <>
          <LevelComplete />
          <LevelFailed />
        </>
      ) : (
        <GameOver />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
});
