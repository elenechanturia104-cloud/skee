'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AppSettings, BoardItem, ScheduleItem } from '@/lib/types';
import { initialBoardItems, initialSchedule } from '@/lib/data';
import { useRouter } from 'next/navigation';

const ADMIN_PIN = '1234';

const defaultSettings: AppSettings = {
  colors: {
    primary: '275 100% 25.3%',
    background: '240 67% 94.1%',
    accent: '276 100% 50%',
  },
  soundEnabled: true,
  bellSound: 'default',
};

interface ChronoBoardContextType {
  schedule: ScheduleItem[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;
  boardItems: BoardItem[];
  setBoardItems: React.Dispatch<React.SetStateAction<BoardItem[]>>;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  isAuthenticated: boolean;
  login: (pin: string) => boolean;
  logout: () => void;
  applyColorSettings: (colors: AppSettings['colors']) => void;
  resetColorSettings: () => void;
}

const ChronoBoardContext = createContext<ChronoBoardContextType | undefined>(undefined);

export const ChronoBoardProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    if (typeof window === 'undefined') return initialSchedule;
    const saved = localStorage.getItem('chrono-schedule');
    return saved ? JSON.parse(saved) : initialSchedule;
  });

  const [boardItems, setBoardItems] = useState<BoardItem[]>(() => {
    if (typeof window === 'undefined') return initialBoardItems;
    const saved = localStorage.getItem('chrono-board-items');
    return saved ? JSON.parse(saved) : initialBoardItems;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    if (typeof window === 'undefined') return defaultSettings;
    const saved = localStorage.getItem('chrono-settings');
    const savedSettings = saved ? JSON.parse(saved) : defaultSettings;
    // ensure defaults for new settings
    if (typeof savedSettings.soundEnabled === 'undefined') {
        savedSettings.soundEnabled = true;
    }
    if (typeof savedSettings.bellSound === 'undefined') {
        savedSettings.bellSound = 'default';
    }
    return savedSettings;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('chrono-schedule', JSON.stringify(schedule));
    }
  }, [schedule]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('chrono-board-items', JSON.stringify(boardItems));
    }
  }, [boardItems]);

  const applyColorSettings = useCallback((colors: AppSettings['colors']) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--accent', colors.accent);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('chrono-settings', JSON.stringify(settings));
        applyColorSettings(settings.colors);
    }
  }, [settings, applyColorSettings]);

  const resetColorSettings = useCallback(() => {
    setSettings(prev => ({...prev, colors: defaultSettings.colors}));
  }, []);


  const login = (pin: string) => {
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
      router.push('/admin');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    router.push('/');
  };

  const value = {
    schedule,
    setSchedule,
    boardItems,
    setBoardItems,
    settings,
    setSettings,
    isAuthenticated,
    login,
    logout,
    applyColorSettings,
    resetColorSettings
  };

  return (
    <ChronoBoardContext.Provider value={value}>
      {children}
    </ChronoBoardContext.Provider>
  );
};

export const useChronoBoard = () => {
  const context = useContext(ChronoBoardContext);
  if (context === undefined) {
    throw new Error('useChronoBoard must be used within a ChronoBoardProvider');
  }
  return context;
};
