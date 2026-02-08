
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SuperAdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (password === '4321') {
      // On successful login, you might want to set a session cookie or token
      // For this example, we'll just redirect.
      router.push('/super-admin');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Super Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button onClick={handleLogin} className="w-full">Login</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
