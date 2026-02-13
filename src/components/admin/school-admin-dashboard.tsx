'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { School, BellSettings } from '@/lib/types';
import { AppearanceManager } from './appearance-manager';
import { ContentManager } from './content-manager';
import { ScheduleManager } from './schedule-manager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const defaultBellSettings: BellSettings = {
  volume: 50,
  sound: 'school'
};

interface SchoolAdminDashboardProps {
  schoolId: string;
}

export default function SchoolAdminDashboard({ schoolId }: SchoolAdminDashboardProps) {
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      return;
    }
    const schoolRef = doc(db, 'schools', schoolId);
    const unsubscribe = onSnapshot(schoolRef, (doc) => {
      if (doc.exists()) {
        const schoolData = { id: doc.id, ...doc.data() } as School;
        setSchool(schoolData);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [schoolId]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">იტვირთება...</div>;
  }

  if (!school) {
    return <div className="flex items-center justify-center h-screen">სკოლა ვერ მოიძებნა.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <h1 className="text-3xl font-bold font-headline mb-4">მართვის პანელი: {school.name}</h1>
        <p className="text-muted-foreground mb-8">ამ გვერდზე შეგიძლიათ მართოთ თქვენი სკოლის საინფორმაციო დაფის ყველა ასპექტი.</p>

        <Tabs defaultValue="content">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6">
                <TabsTrigger value="content">შიგთავსი</TabsTrigger>
                <TabsTrigger value="schedule">განრიგი</TabsTrigger>
                <TabsTrigger value="appearance">გარეგნობა</TabsTrigger>
            </TabsList>
            <TabsContent value="content">
                <ContentManager infoBoard={school.infoBoard ?? { content: '' }} schoolId={school.id} />
            </TabsContent>
            <TabsContent value="schedule">
                <ScheduleManager schedule={school.schedule ?? []} schoolId={school.id} />
            </TabsContent>
            <TabsContent value="appearance">
                <AppearanceManager 
                    design={school.design ?? { primaryColor: '222.2 47.4% 11.2%', backgroundColor: '0 0% 100%', accentColor: '210 40% 96.1%' }}
                    bellSettings={school.bellSettings ?? defaultBellSettings}
                    schoolId={school.id} 
                />
            </TabsContent>
        </Tabs>
    </div>
  );
}
