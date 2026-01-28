'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AppSettings, BoardItem, ScheduleItem, AdminLog } from '@/lib/types';
import { initialBoardItems, initialSchedule } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { bellSounds } from '@/lib/sounds';

const ADMIN_PIN = '1234';

const defaultSettings: AppSettings = {
  colors: {
    primary: '275 100% 25.3%',
    background: '240 67% 94.1%',
    accent: '276 100% 50%',
  },
  soundEnabled: true,
  bellSound: 'school',
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
  isBreakTime: boolean;
  setIsBreakTime: React.Dispatch<React.SetStateAction<boolean>>;
  logs: AdminLog[];
  addLog: (action: string, details: string) => void;
  clearLogs: () => void;
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
    const saved = localStorage.getItem('chrono-board-items-v2');
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
    if (typeof savedSettings.bellSound === 'undefined' || !Object.keys(bellSounds).includes(savedSettings.bellSound)) {
        savedSettings.bellSound = 'school';
    }
    return savedSettings;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [logs, setLogs] = useState<AdminLog[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('chrono-logs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('chrono-schedule', JSON.stringify(schedule));
    }
  }, [schedule]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('chrono-board-items-v2', JSON.stringify(boardItems));
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('chrono-logs', JSON.stringify(logs));
    }
  }, [logs]);

  const addLog = (action: string, details: string) => {
    const newLog: AdminLog = {
      id: new Date().getTime().toString(),
      timestamp: new Date().toISOString(),
      action,
      details,
    };
    setLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  const clearLogs = () => {
    const newLog: AdminLog = {
        id: new Date().getTime().toString(),
        timestamp: new Date().toISOString(),
        action: 'ისტორია',
        details: 'ცვლილებების ისტორია გასუფთავდა.',
      };
      setLogs([newLog]);
  };

  const resetColorSettings = useCallback(() => {
    setSettings(prev => ({...prev, colors: defaultSettings.colors}));
  }, []);


  const login = (pin: string) => {
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
      addLog('ავტორიზაცია', 'ადმინისტრატორი შემოვიდა.');
      router.push('/admin');
      return true;
    }
    return false;
  };

  const logout = () => {
    addLog('ავტორიზაცია', 'ადმინისტრატორი გავიდა.');
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
    resetColorSettings,
    isBreakTime,
    setIsBreakTime,
    logs,
    addLog,
    clearLogs
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
