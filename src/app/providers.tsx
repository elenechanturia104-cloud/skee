'use client';
import { ChronoBoardProvider } from '@/hooks/use-chronoboard';

export function ChronoBoardProviders({ children }: { children: React.ReactNode }) {
  return <ChronoBoardProvider>{children}</ChronoBoardProvider>;
}
