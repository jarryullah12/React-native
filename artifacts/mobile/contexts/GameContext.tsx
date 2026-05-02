import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  TileData, Direction, initializeGame, slide, spawnTile, spawnDangerTile,
  tickDangerTiles, isGameOver, highestTile,
} from '../lib/gameLogic';
import { LEVELS, Level } from '../lib/levels';
import * as Haptics from 'expo-haptics';
import { useTheme } from './ThemeContext';

interface HistorySnapshot {
  grid: TileData[];
  score: number;
  coins: number;
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
  coins: number;
  totalCoins: number;
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
  dangerWarning: boolean;
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
const TOTAL_COINS_KEY = 'totalCoins';
const DANGER_SPAWN_INTERVAL = 8;

export function GameProvider({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme();

  const [grid, setGrid] = useState<TileData[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [history, setHistory] = useState<HistorySnapshot[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const [mode, setMode] = useState<GameMode | null>(null);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [movesUsed, setMovesUsed] = useState(0);
  const [mergesCount, setMergesCount] = useState(0);
  const [levelStatus, setLevelStatus] = useState<LevelStatus>('playing');
  const [starsEarned, setStarsEarned] = useState<StarCount>(0);
  const [levelProgress, setLevelProgress] = useState<Record<number, LevelProgressEntry>>({});
  const [dangerWarning, setDangerWarning] = useState(false);

  useEffect(() => { loadPersistedData(); }, []);

  useEffect(() => {
    if (mode === 'free' && score > bestScore) {
      setBestScore(score);
      AsyncStorage.setItem('bestScore', score.toString()).catch(() => {});
    }
  }, [score, bestScore, mode]);

  const loadPersistedData = async () => {
    try {
      const [savedBest, savedProgress, savedCoins] = await Promise.all([
        AsyncStorage.getItem('bestScore'),
        AsyncStorage.getItem(PROGRESS_KEY),
        AsyncStorage.getItem(TOTAL_COINS_KEY),
      ]);
      if (savedBest) setBestScore(parseInt(savedBest, 10));
      if (savedProgress) setLevelProgress(JSON.parse(savedProgress));
      if (savedCoins) setTotalCoins(parseInt(savedCoins, 10));
    } catch (e) {
      // ignore
    }
  };

  const addCoins = useCallback((amount: number) => {
    setCoins(prev => prev + amount);
    setTotalCoins(prev => {
      const next = prev + amount;
      AsyncStorage.setItem(TOTAL_COINS_KEY, next.toString()).catch(() => {});
      return next;
    });
  }, []);

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
    setCoins(0);
    setHistory([]);
    setMovesUsed(0);
    setMergesCount(0);
    setLevelStatus('playing');
    setStarsEarned(0);
    setGameOver(false);
    setDangerWarning(false);
  }, []);

  const startFreePlay = useCallback(() => {
    setMode('free');
    setCurrentLevel(null);
    setGrid(initializeGame());
    setScore(0);
    setCoins(0);
    setHistory([]);
    setMovesUsed(0);
    setMergesCount(0);
    setLevelStatus('playing');
    setStarsEarned(0);
    setGameOver(false);
    setDangerWarning(false);
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

    const { newGrid, scoreGained, moved, mergesCount: newMerges, coinsGained } = slide(grid, direction);

    if (!moved) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

    setHistory(prev => {
      const snap: HistorySnapshot = { grid, score, coins, movesUsed, mergesCount };
      const newHistory = [...prev, snap];
      if (newHistory.length > 3) newHistory.shift();
      return newHistory;
    });

    const newMovesUsed = movesUsed + 1;
    const newMergesTotal = mergesCount + newMerges;
    const newScore = score + scoreGained;

    if (coinsGained > 0) addCoins(coinsGained);

    let spawnedGrid = spawnTile(newGrid);

    const shouldSpawnDanger =
      newMovesUsed >= 6 &&
      newMovesUsed % DANGER_SPAWN_INTERVAL === 0 &&
      (mode === 'free' ||
        (mode === 'level' && currentLevel && currentLevel.difficulty !== 'easy'));

    if (shouldSpawnDanger) {
      spawnedGrid = spawnDangerTile(spawnedGrid, 4);
    }

    const { grid: tickedGrid, exploded } = tickDangerTiles(spawnedGrid);

    if (exploded) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      setGrid(tickedGrid);
      setScore(newScore);
      setMovesUsed(newMovesUsed);
      setMergesCount(newMergesTotal);
      if (mode === 'free') {
        setGameOver(true);
      } else {
        setLevelStatus('failed');
      }
      return;
    }

    const dangerCount = tickedGrid.filter(t => t.isDanger).length;
    setDangerWarning(dangerCount >= 2);

    setGrid(tickedGrid);
    setScore(newScore);
    setMovesUsed(newMovesUsed);
    setMergesCount(newMergesTotal);

    if (mode === 'free') {
      if (isGameOver(tickedGrid)) setGameOver(true);
      return;
    }

    if (mode === 'level' && currentLevel) {
      const obj = currentLevel.objective;
      let metObjective = false;
      if (obj.type === 'reach-tile') metObjective = highestTile(tickedGrid) >= obj.target;
      else if (obj.type === 'score') metObjective = newScore >= obj.target;
      else if (obj.type === 'merges') metObjective = newMergesTotal >= obj.target;

      if (metObjective) {
        let stars: StarCount = 1;
        if (newMovesUsed <= currentLevel.starThresholds.three) stars = 3;
        else if (newMovesUsed <= currentLevel.starThresholds.two) stars = 2;
        setStarsEarned(stars);
        setLevelStatus('won');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        persistLevelProgress(currentLevel.id, stars, newMovesUsed);
      } else if (newMovesUsed >= currentLevel.moveLimit || isGameOver(tickedGrid)) {
        setLevelStatus('failed');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      }
    }
  }, [mode, grid, score, coins, movesUsed, mergesCount, gameOver, levelStatus, currentLevel,
      persistLevelProgress, addCoins]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    if (mode === 'level' && levelStatus !== 'playing') return;
    const prevState = history[history.length - 1];
    setGrid(prevState.grid);
    setScore(prevState.score);
    setCoins(prevState.coins);
    setMovesUsed(prevState.movesUsed);
    setMergesCount(prevState.mergesCount);
    setHistory(prev => prev.slice(0, -1));
    setGameOver(false);
    setDangerWarning(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  }, [history, mode, levelStatus]);

  const movesRemaining = currentLevel ? Math.max(0, currentLevel.moveLimit - movesUsed) : null;
  const totalStars = Object.values(levelProgress).reduce((sum, p) => sum + p.stars, 0);

  return (
    <GameContext.Provider value={{
      grid, score, bestScore, coins, totalCoins, theme,
      moveHistoryCount: history.length, mode, gameOver, currentLevel,
      movesRemaining, movesUsed, mergesCount, levelStatus, starsEarned,
      levelProgress, totalStars, dangerWarning,
      move, undo, newGame: startFreePlay, startLevel, startFreePlay,
      restartLevel, nextLevel, toggleTheme,
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
