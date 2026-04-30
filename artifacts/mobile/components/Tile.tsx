import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import { TileData, GRID_SIZE } from '../lib/gameLogic';
import { useColors } from '../hooks/useColors';

export const BOARD_PADDING = 16;
export const GAP = 8;

export function getTileSize(screenWidth: number) {
  const maxBoardWidth = Math.min(screenWidth, 500);
  return (maxBoardWidth - BOARD_PADDING * 2 - GAP * (GRID_SIZE + 1)) / GRID_SIZE;
}

export function Tile({ tile, tileSize }: { tile: TileData; tileSize: number }) {
  const colors = useColors() as any; 
  const x = useSharedValue(tile.col * (tileSize + GAP) + GAP);
  const y = useSharedValue(tile.row * (tileSize + GAP) + GAP);
  const scale = useSharedValue(tile.isNew ? 0.3 : 1);
  const opacity = useSharedValue(tile.isNew ? 0 : 1);

  useEffect(() => {
    const targetX = tile.col * (tileSize + GAP) + GAP;
    const targetY = tile.row * (tileSize + GAP) + GAP;
    
    if (x.value !== targetX) {
      x.value = withSpring(targetX, { damping: 18, stiffness: 180 });
    }
    if (y.value !== targetY) {
      y.value = withSpring(targetY, { damping: 18, stiffness: 180 });
    }
  }, [tile.row, tile.col, tileSize]);

  useEffect(() => {
    if (tile.isMerged) {
      scale.value = withSequence(
        withSpring(1.15, { damping: 15, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 200 })
      );
    } else if (tile.isNew) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, { damping: 18, stiffness: 180 });
    }
  }, [tile.isMerged, tile.isNew]);

  const style = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: x.value,
      top: y.value,
      width: tileSize,
      height: tileSize,
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const valueStr = tile.value >= 2048 ? '2048' : tile.value.toString();
  const bgColor = colors[`tile${valueStr}`] || colors.tileSuper;
  const textColor = tile.value <= 4 ? colors.tileTextLight : colors.tileTextDark;

  return (
    <Animated.View style={[styles.tile, style, { backgroundColor: bgColor, borderRadius: colors.radius }]}>
      <Text style={[styles.text, { color: textColor, fontSize: tileSize * 0.4 }]}>{tile.value}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontWeight: 'bold',
    fontFamily: 'Inter_700Bold',
  }
});