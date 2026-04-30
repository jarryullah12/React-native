import React, { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudioPlayer } from 'expo-audio';

const STORAGE_KEY = 'musicEnabled';

interface MusicContextValue {
  enabled: boolean;
  isReady: boolean;
  toggleMusic: () => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

const trackSource = require('../assets/audio/zen.mp3');

export function MusicProvider({ children }: { children: ReactNode }) {
  const player = useAudioPlayer(trackSource);
  const [enabled, setEnabled] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const enabledRef = useRef(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          const next = saved === 'true';
          enabledRef.current = next;
          setEnabled(next);
        }
      } catch {
        // ignore
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isReady) return;
    try {
      player.loop = true;
      player.volume = 0.4;
      if (enabled) {
        player.play();
      } else {
        player.pause();
      }
    } catch {
      // ignore — audio may not be ready on first render
    }
  }, [enabled, isReady, player]);

  const toggleMusic = useCallback(() => {
    setEnabled(prev => {
      const next = !prev;
      enabledRef.current = next;
      AsyncStorage.setItem(STORAGE_KEY, String(next)).catch(() => {});
      return next;
    });
  }, []);

  return (
    <MusicContext.Provider value={{ enabled, isReady, toggleMusic }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within MusicProvider');
  return ctx;
}
