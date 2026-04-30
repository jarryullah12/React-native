import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TileData, Direction, initializeGame, slide, spawnTile, isGameOver } from '../lib/gameLogic';
import * as Haptics from 'expo-haptics';

interface GameState {
  grid: TileData[];
  score: number;
}

interface GameContextValue {
  grid: TileData[];
  score: number;
  bestScore: number;
  gameOver: boolean;
  theme: 'light' | 'dark';
  moveHistoryCount: number;
  move: (direction: Direction) => void;
  undo: () => void;
  newGame: () => void;
  toggleTheme: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [grid, setGrid] = useState<TileData[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [history, setHistory] = useState<GameState[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    loadPersistedData();
    startNewGame();
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      AsyncStorage.setItem('bestScore', score.toString());
    }
  }, [score, bestScore]);

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
    } catch (e) {
      console.error(e);
    }
  };

  const startNewGame = useCallback(() => {
    setGrid(initializeGame());
    setScore(0);
    setHistory([]);
    setGameOver(false);
  }, []);

  const move = useCallback((direction: Direction) => {
    if (gameOver) return;

    const { newGrid, scoreGained, moved } = slide(grid, direction);
    
    if (moved) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      setHistory(prev => {
        const newHistory = [...prev, { grid, score }];
        if (newHistory.length > 3) {
          newHistory.shift();
        }
        return newHistory;
      });

      const spawnedGrid = spawnTile(newGrid);
      setGrid(spawnedGrid);
      setScore(s => s + scoreGained);
      
      if (isGameOver(spawnedGrid)) {
        setGameOver(true);
      }
    }
  }, [grid, score, gameOver]);

  const undo = useCallback(() => {
    if (history.length > 0) {
      const prevState = history[history.length - 1];
      setGrid(prevState.grid);
      setScore(prevState.score);
      setHistory(prev => prev.slice(0, -1));
      setGameOver(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [history]);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    AsyncStorage.setItem('theme', nextTheme);
  }, [theme]);

  return (
    <GameContext.Provider value={{
      grid,
      score,
      bestScore,
      gameOver,
      theme,
      moveHistoryCount: history.length,
      move,
      undo,
      newGame: startNewGame,
      toggleTheme
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