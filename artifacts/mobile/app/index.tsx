import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Header } from '@/components/Header';
import { Board } from '@/components/Board';
import { GameOver } from '@/components/GameOver';
import { useColors } from '@/hooks/useColors';

export default function GameScreen() {
  const colors = useColors();
  const isWeb = Platform.OS === 'web';
  const webInsets = isWeb ? { paddingTop: 67, paddingBottom: 34 } : {};

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, webInsets]}>
      <Header />
      <View style={styles.boardContainer}>
        <Board />
      </View>
      <GameOver />
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
  }
});