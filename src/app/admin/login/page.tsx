
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!password) {
      setError('Please enter a password.');
      return;
    }

    try {
      const schoolsRef = collection(db, 'schools');
      const q = query(schoolsRef, where('adminPassword', '==', password));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Incorrect password. Please try again.');
      } else {
        // Assuming one school per password
        const schoolDoc = querySnapshot.docs[0];
        const schoolId = schoolDoc.id;
        // On successful login, redirect to the admin panel with the school's ID
        router.push(`/admin?schoolId=${schoolId}`);
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>School Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter school password"
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
