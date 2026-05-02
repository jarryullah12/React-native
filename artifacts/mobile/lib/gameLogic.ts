export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface TileData {
  id: string;
  row: number;
  col: number;
  value: number;
  isMerged?: boolean;
  isNew?: boolean;
  isDanger?: boolean;
}

export const GRID_SIZE = 5;

export function createEmptyGrid(): TileData[] {
  return [];
}

export function generateId() {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}

export function spawnTile(grid: TileData[]): TileData[] {
  const emptyCells: { row: number; col: number }[] = [];
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
    { id: generateId(), row: cell.row, col: cell.col, value, isNew: true },
  ];
}

export function spawnDangerTile(grid: TileData[], countdown = 4): TileData[] {
  const emptyCells: { row: number; col: number }[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!grid.find(t => t.row === r && t.col === c)) {
        emptyCells.push({ row: r, col: c });
      }
    }
  }
  if (emptyCells.length === 0) return grid;
  const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  return [
    ...grid,
    { id: generateId(), row: cell.row, col: cell.col, value: countdown, isNew: true, isDanger: true },
  ];
}

export function initializeGame(): TileData[] {
  let grid = createEmptyGrid();
  grid = spawnTile(grid);
  grid = spawnTile(grid);
  return grid;
}

export function tickDangerTiles(grid: TileData[]): { grid: TileData[]; exploded: boolean } {
  let exploded = false;
  const newGrid = grid.map(t => {
    if (!t.isDanger) return t;
    const newVal = t.value - 1;
    if (newVal <= 0) exploded = true;
    return { ...t, value: newVal };
  });
  return { grid: newGrid.filter(t => !t.isDanger || t.value > 0), exploded };
}

export function slide(
  grid: TileData[],
  direction: Direction,
): { newGrid: TileData[]; scoreGained: number; moved: boolean; mergesCount: number; coinsGained: number } {
  let scoreGained = 0;
  let moved = false;
  let mergesCount = 0;
  let coinsGained = 0;

  let currentGrid = [...grid].map(t => ({ ...t, isMerged: false, isNew: false }));
  const nextGrid: TileData[] = [];

  const isVertical = direction === 'UP' || direction === 'DOWN';
  const isForward = direction === 'RIGHT' || direction === 'DOWN';

  for (let i = 0; i < GRID_SIZE; i++) {
    const line = currentGrid.filter(t => (isVertical ? t.col === i : t.row === i));
    line.sort((a, b) => {
      const posA = isVertical ? a.row : a.col;
      const posB = isVertical ? b.row : b.col;
      return isForward ? posB - posA : posA - posB;
    });

    const newLine: TileData[] = [];
    for (let j = 0; j < line.length; j++) {
      const tile = line[j];
      const prevTile = newLine[newLine.length - 1];

      const canMerge =
        prevTile &&
        prevTile.value === tile.value &&
        !prevTile.isMerged &&
        !prevTile.isDanger &&
        !tile.isDanger;

      if (canMerge) {
        prevTile.value *= 2;
        prevTile.isMerged = true;
        scoreGained += prevTile.value;
        coinsGained += Math.floor(prevTile.value / 2);
        moved = true;
        mergesCount++;
      } else {
        newLine.push({ ...tile });
      }
    }

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

  return { newGrid: nextGrid, scoreGained, moved, mergesCount, coinsGained };
}

export function isGameOver(grid: TileData[]): boolean {
  if (grid.length < GRID_SIZE * GRID_SIZE) return false;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const tile = grid.find(t => t.row === r && t.col === c);
      if (!tile) return false;
      if (tile.isDanger) continue;

      if (c < GRID_SIZE - 1) {
        const right = grid.find(t => t.row === r && t.col === c + 1);
        if (right && !right.isDanger && right.value === tile.value) return false;
      }
      if (r < GRID_SIZE - 1) {
        const down = grid.find(t => t.row === r + 1 && t.col === c);
        if (down && !down.isDanger && down.value === tile.value) return false;
      }
    }
  }

  return true;
}

export function highestTile(grid: TileData[]): number {
  const normal = grid.filter(t => !t.isDanger);
  if (normal.length === 0) return 0;
  return Math.max(...normal.map(t => t.value));
}
