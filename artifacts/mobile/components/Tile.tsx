import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { TileData, GRID_SIZE } from '../lib/gameLogic';
import { useColors } from '../hooks/useColors';

export const BOARD_PADDING = 16;
export const GAP = 8;

export function getTileSize(screenWidth: number, availableHeight?: number) {
  const maxBoardWidth = Math.min(screenWidth, 500);
  const fromWidth = (maxBoardWidth - BOARD_PADDING * 2 - GAP * (GRID_SIZE + 1)) / GRID_SIZE;
  if (availableHeight != null) {
    const fromHeight = (availableHeight - BOARD_PADDING * 2 - GAP * (GRID_SIZE + 1)) / GRID_SIZE;
    return Math.min(fromWidth, fromHeight);
  }
  return fromWidth;
}

function DangerTileInner({ value, tileSize, colors }: { value: number; tileSize: number; colors: any }) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (value <= 2) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 280 }),
          withTiming(0.92, { duration: 280 }),
        ),
        -1,
        true,
      );
    } else {
      pulse.value = 1;
    }
  }, [value]);

  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  const bg = value <= 1 ? '#FF0000' : value <= 2 ? '#E53E3E' : '#C53030';
  const borderCol = value <= 1 ? '#FF8888' : '#FF6B6B';

  return (
    <Animated.View
      style={[
        pulseStyle,
        {
          width: tileSize,
          height: tileSize,
          borderRadius: colors.radius,
          backgroundColor: bg,
          borderWidth: 2,
          borderColor: borderCol,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#FF0000',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.7,
          shadowRadius: 10,
          elevation: 8,
        },
      ]}
    >
      <Text style={{ fontSize: tileSize * 0.36, lineHeight: tileSize * 0.4 }}>💣</Text>
      <Text style={{ fontSize: tileSize * 0.24, fontFamily: 'Inter_700Bold', color: '#FFFFFF', marginTop: -2 }}>
        {value}
      </Text>
    </Animated.View>
  );
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
    if (x.value !== targetX) x.value = withSpring(targetX, { damping: 18, stiffness: 180 });
    if (y.value !== targetY) y.value = withSpring(targetY, { damping: 18, stiffness: 180 });
  }, [tile.row, tile.col, tileSize]);

  useEffect(() => {
    if (tile.isMerged) {
      scale.value = withSequence(
        withSpring(1.15, { damping: 15, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 200 }),
      );
    } else if (tile.isNew) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, { damping: 18, stiffness: 180 });
    }
  }, [tile.isMerged, tile.isNew]);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left: x.value,
    top: y.value,
    width: tileSize,
    height: tileSize,
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (tile.isDanger) {
    return (
      <Animated.View style={style}>
        <DangerTileInner value={tile.value} tileSize={tileSize} colors={colors} />
      </Animated.View>
    );
  }

  const valueStr = tile.value >= 2048 ? '2048' : tile.value.toString();
  const bgColor = colors[`tile${valueStr}`] || colors.tileSuper;
  const textColor = tile.value <= 4 ? colors.tileTextLight : colors.tileTextDark;
  const isGolden = tile.value >= 8;

  return (
    <Animated.View
      style={[
        styles.tile,
        style,
        {
          backgroundColor: bgColor,
          borderRadius: colors.radius,
          shadowColor: tile.value >= 64 ? '#F6C90E' : '#000',
          shadowOpacity: tile.value >= 64 ? 0.45 : 0.1,
        },
      ]}
    >
      {isGolden && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: colors.radius, backgroundColor: '#FFFFFF', opacity: 0.12 },
          ]}
        />
      )}
      <Text
        style={[
          styles.text,
          {
            color: textColor,
            fontSize:
              tile.value >= 1000
                ? tileSize * 0.28
                : tile.value >= 100
                ? tileSize * 0.33
                : tileSize * 0.42,
          },
        ]}
      >
        {tile.value}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  text: {
    fontWeight: 'bold',
    fontFamily: 'Inter_700Bold',
  },
});
