import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TileData, Direction, initializeGame, slide, spawnTile, isGameOver, highestTile } from '../lib/gameLogic';
import { LEVELS, Level } from '../lib/levels';
import * as Haptics from 'expo-haptics';

interface HistorySnapshot {
  grid: TileData[];
  score: number;
  movesUsed: number;
  mergesCount: number;
}

export type GameMode = 'level' | 'free';
export type LevelStatus = 'playing' | 'won' | 'failed';
export type StarCount = 0 | 1 | 2 | 3;

export interface LevelProgressEntry {
  stars: StarCount;
  bestMoves: number;
}

interface GameContextValue {
  grid: TileData[];
  score: number;
  bestScore: number;
  theme: 'light' | 'dark';
  moveHistoryCount: number;
  mode: GameMode | null;
  gameOver: boolean;
  currentLevel: Level | null;
  movesRemaining: number | null;
  movesUsed: number;
  mergesCount: number;
  levelStatus: LevelStatus;
  starsEarned: StarCount;
  levelProgress: Record<number, LevelProgressEntry>;
  totalStars: number;
  move: (direction: Direction) => void;
  undo: () => void;
  newGame: () => void;
  startLevel: (levelId: number) => void;
  startFreePlay: () => void;
  restartLevel: () => void;
  nextLevel: () => void;
  toggleTheme: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

const PROGRESS_KEY = 'levelProgress';

export function GameProvider({ children }: { children: ReactNode }) {
  const [grid, setGrid] = useState<TileData[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [history, setHistory] = useState<HistorySnapshot[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [mode, setMode] = useState<GameMode | null>(null);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [movesUsed, setMovesUsed] = useState(0);
  const [mergesCount, setMergesCount] = useState(0);
  const [levelStatus, setLevelStatus] = useState<LevelStatus>('playing');
  const [starsEarned, setStarsEarned] = useState<StarCount>(0);
  const [levelProgress, setLevelProgress] = useState<Record<number, LevelProgressEntry>>({});

  useEffect(() => {
    loadPersistedData();
  }, []);

  useEffect(() => {
    if (mode === 'free' && score > bestScore) {
      setBestScore(score);
      AsyncStorage.setItem('bestScore', score.toString());
    }
  }, [score, bestScore, mode]);

  const loadPersistedData = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme);
      }
      const savedBest = await AsyncStorage.getItem('bestScore');
      if (savedBest) {
        setBestScore(parseInt(savedBest, 10));
      }
      const savedProgress = await AsyncStorage.getItem(PROGRESS_KEY);
      if (savedProgress) {
        setLevelProgress(JSON.parse(savedProgress));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const persistLevelProgress = useCallback((levelId: number, stars: StarCount, movesAtWin: number) => {
    setLevelProgress(prev => {
      const existing = prev[levelId];
      let next: LevelProgressEntry;
      if (!existing) {
        next = { stars, bestMoves: movesAtWin };
      } else if (stars > existing.stars) {
        next = { stars, bestMoves: movesAtWin };
      } else if (stars === existing.stars && movesAtWin < existing.bestMoves) {
        next = { stars, bestMoves: movesAtWin };
      } else {
        return prev;
      }
      const updated = { ...prev, [levelId]: next };
      AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const startLevel = useCallback((levelId: number) => {
    const level = LEVELS.find(l => l.id === levelId);
    if (!level) return;
    setMode('level');
    setCurrentLevel(level);
    setGrid(initializeGame());
    setScore(0);
    setHistory([]);
    setMovesUsed(0);
    setMergesCount(0);
    setLevelStatus('playing');
    setStarsEarned(0);
    setGameOver(false);
  }, []);

  const startFreePlay = useCallback(() => {
    setMode('free');
    setCurrentLevel(null);
    setGrid(initializeGame());
    setScore(0);
    setHistory([]);
    setMovesUsed(0);
    setMergesCount(0);
    setLevelStatus('playing');
    setStarsEarned(0);
    setGameOver(false);
  }, []);

  const restartLevel = useCallback(() => {
    if (currentLevel) startLevel(currentLevel.id);
  }, [currentLevel, startLevel]);

  const nextLevel = useCallback(() => {
    if (!currentLevel) return;
    const next = LEVELS.find(l => l.id === currentLevel.id + 1);
    if (next) startLevel(next.id);
  }, [currentLevel, startLevel]);

  const move = useCallback((direction: Direction) => {
    if (!mode) return;
    if (mode === 'free' && gameOver) return;
    if (mode === 'level' && levelStatus !== 'playing') return;

    const { newGrid, scoreGained, moved, mergesCount: newMerges } = slide(grid, direction);

    if (!moved) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

    setHistory(prev => {
      const snap: HistorySnapshot = { grid, score, movesUsed, mergesCount };
      const newHistory = [...prev, snap];
      if (newHistory.length > 3) newHistory.shift();
      return newHistory;
    });

    const spawnedGrid = spawnTile(newGrid);
    setGrid(spawnedGrid);
    const newScore = score + scoreGained;
    setScore(newScore);
    const newMovesUsed = movesUsed + 1;
    const newMergesTotal = mergesCount + newMerges;
    setMovesUsed(newMovesUsed);
    setMergesCount(newMergesTotal);

    if (mode === 'free') {
      if (isGameOver(spawnedGrid)) {
        setGameOver(true);
      }
      return;
    }

    if (mode === 'level' && currentLevel) {
      const obj = currentLevel.objective;
      let metObjective = false;
      if (obj.type === 'reach-tile') {
        metObjective = highestTile(spawnedGrid) >= obj.target;
      } else if (obj.type === 'score') {
        metObjective = newScore >= obj.target;
      } else if (obj.type === 'merges') {
        metObjective = newMergesTotal >= obj.target;
      }

      if (metObjective) {
        let stars: StarCount = 1;
        if (newMovesUsed <= currentLevel.starThresholds.three) stars = 3;
        else if (newMovesUsed <= currentLevel.starThresholds.two) stars = 2;
        else stars = 1;
        setStarsEarned(stars);
        setLevelStatus('won');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        persistLevelProgress(currentLevel.id, stars, newMovesUsed);
      } else if (newMovesUsed >= currentLevel.moveLimit || isGameOver(spawnedGrid)) {
        setLevelStatus('failed');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      }
    }
  }, [mode, grid, score, movesUsed, mergesCount, gameOver, levelStatus, currentLevel, persistLevelProgress]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    if (mode === 'level' && levelStatus !== 'playing') return;
    const prevState = history[history.length - 1];
    setGrid(prevState.grid);
    setScore(prevState.score);
    setMovesUsed(prevState.movesUsed);
    setMergesCount(prevState.mergesCount);
    setHistory(prev => prev.slice(0, -1));
    setGameOver(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  }, [history, mode, levelStatus]);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    AsyncStorage.setItem('theme', nextTheme).catch(() => {});
  }, [theme]);

  const movesRemaining = currentLevel ? Math.max(0, currentLevel.moveLimit - movesUsed) : null;
  const totalStars = Object.values(levelProgress).reduce((sum, p) => sum + p.stars, 0);

  return (
    <GameContext.Provider value={{
      grid,
      score,
      bestScore,
      gameOver,
      theme,
      moveHistoryCount: history.length,
      mode,
      currentLevel,
      movesRemaining,
      movesUsed,
      mergesCount,
      levelStatus,
      starsEarned,
      levelProgress,
      totalStars,
      move,
      undo,
      newGame: startFreePlay,
      startLevel,
      startFreePlay,
      restartLevel,
      nextLevel,
      toggleTheme,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
