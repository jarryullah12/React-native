import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useGame } from '../contexts/GameContext';
import { GRID_SIZE } from '../lib/gameLogic';
import { Tile, getTileSize, BOARD_PADDING, GAP } from './Tile';
import { useColors } from '../hooks/useColors';

export function Board() {
  const { grid, move } = useGame();
  const { width } = useWindowDimensions();
  const colors = useColors();

  const tileSize = getTileSize(width);
  const boardSize = tileSize * GRID_SIZE + GAP * (GRID_SIZE + 1);
  const dotSize = Math.max(6, Math.round(tileSize * 0.12));

  const backgroundCells = useMemo(() => {
    const cells = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        cells.push(
          <View
            key={`${r}-${c}`}
            style={[
              styles.bgCell,
              {
                width: tileSize,
                height: tileSize,
                left: c * (tileSize + GAP) + GAP,
                top: r * (tileSize + GAP) + GAP,
                backgroundColor: colors.boardCell,
                borderRadius: colors.radius,
              },
            ]}
          >
            <View
              style={{
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                backgroundColor: colors.boardCellDot,
                opacity: 0.6,
              }}
            />
          </View>,
        );
      }
    }
    return cells;
  }, [tileSize, colors, dotSize]);

  const panGesture = Gesture.Pan()
    .onEnd((e) => {
      const { translationX, translationY } = e;
      const absX = Math.abs(translationX);
      const absY = Math.abs(translationY);

      if (Math.max(absX, absY) > 30) {
        if (absX > absY) {
          if (translationX > 0) move('RIGHT');
          else move('LEFT');
        } else {
          if (translationY > 0) move('DOWN');
          else move('UP');
        }
      }
    });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.container, { padding: BOARD_PADDING }]}>
        <View style={[styles.board, { width: boardSize, height: boardSize, backgroundColor: colors.boardBg, borderRadius: colors.radius + 4 }]}>
          {backgroundCells}
          {grid.map(tile => (
            <Tile key={tile.id} tile={tile} tileSize={tileSize} />
          ))}
        </View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    position: 'relative',
    overflow: 'hidden',
  },
  bgCell: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
