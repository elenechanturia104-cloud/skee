
'use client';

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function withSuperAdminAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const WithSuperAdminAuth: React.FC<P> = (props) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const auth = getAuth();
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          // In a real application, you would also check if the user is a super admin here.
          // For example, by checking a custom claim or a field in their user document.
          setIsAuthenticated(true);
        } else {
          router.push('/super-admin/login');
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }, [auth, router]);

    if (loading) {
      return <div>Loading...</div>; // Or a proper loading spinner
    }

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return WithSuperAdminAuth;
}
