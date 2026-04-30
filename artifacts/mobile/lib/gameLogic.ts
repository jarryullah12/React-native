export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface TileData {
  id: string;
  row: number;
  col: number;
  value: number;
  isMerged?: boolean;
  isNew?: boolean;
}

export const GRID_SIZE = 5;

export function createEmptyGrid(): TileData[] {
  return [];
}

export function generateId() {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}

export function spawnTile(grid: TileData[]): TileData[] {
  const emptyCells = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!grid.find(t => t.row === r && t.col === c)) {
        emptyCells.push({ row: r, col: c });
      }
    }
  }

  if (emptyCells.length === 0) return grid;

  const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const value = Math.random() < 0.9 ? 2 : 4;

  return [
    ...grid.map(t => ({ ...t, isMerged: false, isNew: false })),
    { id: generateId(), row: cell.row, col: cell.col, value, isNew: true }
  ];
}

export function initializeGame(): TileData[] {
  let grid = createEmptyGrid();
  grid = spawnTile(grid);
  grid = spawnTile(grid);
  return grid;
}

export function slide(grid: TileData[], direction: Direction): { newGrid: TileData[], scoreGained: number, moved: boolean } {
  let scoreGained = 0;
  let moved = false;
  
  // Clone grid to work with
  let currentGrid = [...grid].map(t => ({ ...t, isMerged: false, isNew: false }));
  const nextGrid: TileData[] = [];

  const isVertical = direction === 'UP' || direction === 'DOWN';
  const isForward = direction === 'RIGHT' || direction === 'DOWN';

  for (let i = 0; i < GRID_SIZE; i++) {
    // Get tiles in the current row/col
    const line = currentGrid.filter(t => isVertical ? t.col === i : t.row === i);
    // Sort based on direction
    line.sort((a, b) => {
      const posA = isVertical ? a.row : a.col;
      const posB = isVertical ? b.row : b.col;
      return isForward ? posB - posA : posA - posB;
    });

    const newLine: TileData[] = [];
    for (let j = 0; j < line.length; j++) {
      const tile = line[j];
      const prevTile = newLine[newLine.length - 1];

      if (prevTile && prevTile.value === tile.value && !prevTile.isMerged) {
        // Merge
        prevTile.value *= 2;
        prevTile.isMerged = true;
        // Keep the prevTile id, update score
        scoreGained += prevTile.value;
        moved = true;
      } else {
        newLine.push({ ...tile });
      }
    }

    // Update positions
    for (let j = 0; j < newLine.length; j++) {
      const pos = isForward ? GRID_SIZE - 1 - j : j;
      const targetRow = isVertical ? pos : i;
      const targetCol = isVertical ? i : pos;
      
      if (newLine[j].row !== targetRow || newLine[j].col !== targetCol) {
        moved = true;
        newLine[j].row = targetRow;
        newLine[j].col = targetCol;
      }
      nextGrid.push(newLine[j]);
    }
  }

  return { newGrid: nextGrid, scoreGained, moved };
}

export function isGameOver(grid: TileData[]): boolean {
  if (grid.length < GRID_SIZE * GRID_SIZE) return false;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const tile = grid.find(t => t.row === r && t.col === c);
      if (!tile) return false;

      // Check right
      if (c < GRID_SIZE - 1) {
        const right = grid.find(t => t.row === r && t.col === c + 1);
        if (right && right.value === tile.value) return false;
      }
      // Check down
      if (r < GRID_SIZE - 1) {
        const down = grid.find(t => t.row === r + 1 && t.col === c);
        if (down && down.value === tile.value) return false;
      }
    }
  }

  return true;
}