'use client';

import { useChronoBoard } from '@/hooks/use-chronoboard';
import { useEffect } from 'react';

export default function ThemeManager({ children }: { children: React.ReactNode }) {
  const { isBreakTime } = useChronoBoard();

  useEffect(() => {
    document.body.classList.toggle('dark', isBreakTime);
    return () => {
      document.body.classList.remove('dark');
    };
  }, [isBreakTime]);

  return <>{children}</>;
}
