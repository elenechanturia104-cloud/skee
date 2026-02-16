'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import LoadingScreen from '@/components/loader/loading-screen';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth(); // Get isLoading state
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and user is not authenticated, then redirect.
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // While loading, show the loading screen.
  if (isLoading) {
    return <LoadingScreen />;
  }

  // If authenticated, render the children.
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If not authenticated and not loading, render null while redirecting.
  return null;
};

export default ProtectedRoute;
