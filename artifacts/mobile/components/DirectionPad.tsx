import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '../contexts/GameContext';
import { useColors } from '../hooks/useColors';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export function DirectionPad() {
  const { move } = useGame();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const btn = (dir: Direction, icon: string) => (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: colors.card, borderRadius: colors.radius }]}
      onPress={() => move(dir)}
      activeOpacity={0.65}
    >
      <Feather name={icon as any} size={22} color={colors.foreground} />
    </TouchableOpacity>
  );

  const bottomPad = Math.max(insets.bottom, Platform.OS === 'web' ? 8 : 12);

  return (
    <View style={[styles.pad, { paddingBottom: bottomPad }]}>
      <View style={styles.row}>
        {btn('UP', 'arrow-up')}
      </View>
      <View style={styles.row}>
        {btn('LEFT', 'arrow-left')}
        {btn('DOWN', 'arrow-down')}
        {btn('RIGHT', 'arrow-right')}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: {
    alignItems: 'center',
    gap: 6,
    paddingTop: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  btn: {
    width: 54,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
});
