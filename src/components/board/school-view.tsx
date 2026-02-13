
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { SchoolSchema } from '@/lib/schema';
import { z } from 'zod';
import { BellSchedule } from '@/components/board/bell-schedule';
import { InformationBoard } from '@/components/board/information-board';
import { Button } from '@/components/ui/button';
import { Cog } from 'lucide-react';
import { useRouter } from 'next/navigation';

type School = z.infer<typeof SchoolSchema>;

const defaultSchool: School = {
  name: "School not configured",
  logo: "",
  design: { primaryColor: '#000000', backgroundColor: '#FFFFFF', accentColor: '#CCCCCC' },
  schedule: [],
  bellSettings: { sound: '', volume: 50 },
  infoBoard: { content: 'Welcome! The information board is not yet configured.' },
  refreshInterval: '10',
  adminPassword: ''
};

export function SchoolView({ schoolId }: { schoolId: string }) {
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!schoolId) {
        setLoading(false);
        return;
    }

    const schoolRef = doc(db, 'schools', schoolId);
    const unsubscribe = onSnapshot(schoolRef, (doc) => {
      if (doc.exists()) {
        const result = SchoolSchema.safeParse(doc.data());
        if (result.success) {
            const schoolData = { ...defaultSchool, ...result.data };
            setSchool(schoolData);

            // Apply theme colors safely
            if (schoolData.design) {
              document.documentElement.style.setProperty('--primary', schoolData.design.primaryColor);
              document.documentElement.style.setProperty('--background', schoolData.design.backgroundColor);
              document.documentElement.style.setProperty('--accent', schoolData.design.accentColor);
            }

        } else {
            console.error("Invalid school data:", result.error);
            setSchool(defaultSchool); // Show default view on parse error
        }
      } else {
        console.error('School not found!');
        setSchool(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [schoolId]);

  const handleAdminLogin = () => {
      router.push('/admin/login');
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!school) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">School Not Found</h1>
            <p>The school ID in the URL may be incorrect, or the school has not been set up.</p>
            <Button onClick={() => router.push('/')} className="mt-4">Go Home</Button>
        </div>
    );
  }

  // Use optional chaining and nullish coalescing to safely access properties
  return (
    <main className="relative flex flex-col md:flex-row md:h-screen w-full bg-background text-foreground md:overflow-hidden">
      <div className="w-full md:w-[35%] lg:w-[30%] md:h-full flex flex-col border-b md:border-b-0 md:border-r border-border/50">
        <BellSchedule 
          schedule={school.schedule ?? []}
          logo={school.logo ?? undefined}
          schoolName={school.name}
          bellSoundUrl={school.bellSettings?.sound ?? undefined}
          bellVolume={school.bellSettings?.volume ?? 50}
        />
      </div>
      <div className="w-full md:flex-1 md:h-full">
        <InformationBoard content={school.infoBoard?.content ?? ''} />
      </div>
      <div className="fixed bottom-4 right-4 z-50">
          <Button variant="ghost" size="icon" onClick={handleAdminLogin} className="rounded-full bg-primary/10 hover:bg-primary/20 backdrop-blur-sm">
            <Cog className="h-6 w-6 text-primary" />
          </Button>
      </div>
    </main>
  );
}
