'use client';
import { ChronoBoardProvider, useChronoBoard } from '@/hooks/use-chronoboard';
import { useEffect } from 'react';

function ThemeManager({ children }: { children: React.ReactNode }) {
  const { isBreakTime } = useChronoBoard();

  useEffect(() => {
    document.body.classList.toggle('break-mode', isBreakTime);
    return () => {
      document.body.classList.remove('break-mode');
    };
  }, [isBreakTime]);

  return <>{children}</>;
}

export function ChronoBoardProviders({ children }: { children: React.ReactNode }) {
  return (
    <ChronoBoardProvider>
      <ThemeManager>{children}</ThemeManager>
    </ChronoBoardProvider>
  );
}
