'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AppSettings, ScheduleItem, AdminLog, School } from '@/lib/types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  applyColorSettings: (colors: AppSettings['colors']) => void;
  resetColorSettings: () => void;
  isBreakTime: boolean;
  setIsBreakTime: React.Dispatch<React.SetStateAction<boolean>>;
  logs: AdminLog[];
  addLog: (action: string, details: string) => void;
  clearLogs: () => void;
  school: School | null;
}

const ChronoBoardContext = createContext<ChronoBoardContextType | undefined>(undefined);

export const ChronoBoardProvider = ({ children, schoolId }: { children: ReactNode, schoolId: string }) => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [isClientHydrated, setIsClientHydrated] = useState(false);
  const [school, setSchool] = useState<School | null>(null);

  useEffect(() => {
    const getSchool = async () => {
      const schoolRef = doc(db, "schools", schoolId);
      const schoolSnap = await getDoc(schoolRef);

      if (schoolSnap.exists()) {
        setSchool({ id: schoolSnap.id, ...schoolSnap.data() } as School);
      }
    };

    if (schoolId) {
      getSchool();
    }
  }, [schoolId]);


  useEffect(() => {
    if (school) {
      setSchedule(school.schedule);
      setSettings({
        colors: {
          primary: school.design.primaryColor,
          background: school.design.backgroundColor,
          accent: school.design.accentColor,
        },
        soundEnabled: school.bellSettings.volume > 0,
        bellSound: school.bellSettings.sound,
      });
    }
  }, [school]);

  useEffect(() => {
    const savedLogs = localStorage.getItem(`chrono-logs-${schoolId}`);
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }

    setIsClientHydrated(true);
  }, [schoolId]);

  useEffect(() => {
    if (isClientHydrated) {
      localStorage.setItem(`chrono-logs-${schoolId}`, JSON.stringify(logs));
    }
  }, [logs, isClientHydrated, schoolId]);

  const applyColorSettings = useCallback((colors: AppSettings['colors']) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--accent', colors.accent);
  }, []);

  useEffect(() => {
    if (isClientHydrated) {
      applyColorSettings(settings.colors);
    }
  }, [settings.colors, applyColorSettings, isClientHydrated]);

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

  const value = {
    schedule,
    setSchedule,
    settings,
    setSettings,
    applyColorSettings,
    resetColorSettings,
    isBreakTime,
    setIsBreakTime,
    logs,
    addLog,
    clearLogs,
    school
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
