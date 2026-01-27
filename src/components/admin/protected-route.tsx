'use client';

import { useChronoBoard } from '@/hooks/use-chronoboard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useChronoBoard();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    // Or a loading spinner
    return null;
  }

  return <>{children}</>;
}
