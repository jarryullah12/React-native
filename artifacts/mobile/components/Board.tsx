import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { useGame } from '../contexts/GameContext';
import { GRID_SIZE } from '../lib/gameLogic';
import { Tile, getTileSize, BOARD_PADDING, GAP } from './Tile';
import { useColors } from '../hooks/useColors';

// Approximate pixels consumed by LevelHeader + DirectionPad + padding
const CHROME_HEIGHT = 390;

export function Board() {
  const { grid } = useGame();
  const { width, height } = useWindowDimensions();
  const colors = useColors();

  const availableHeight = Math.max(height - CHROME_HEIGHT, 200);
  const tileSize = getTileSize(width, availableHeight);
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

  return (
    <View style={[styles.container, { padding: BOARD_PADDING }]}>
      <View style={[styles.board, { width: boardSize, height: boardSize, backgroundColor: colors.boardBg, borderRadius: colors.radius + 4 }]}>
        {backgroundCells}
        {grid.map(tile => (
          <Tile key={tile.id} tile={tile} tileSize={tileSize} />
        ))}
      </View>
    </View>
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
