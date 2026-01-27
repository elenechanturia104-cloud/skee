'use client';

import { BellSchedule } from '@/components/board/bell-schedule';
import { InformationBoard } from '@/components/board/information-board';
import { AdminLoginDialog } from '@/components/admin/admin-login-dialog';
import { Cog } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  return (
    <main className="relative flex flex-col md:flex-row md:h-screen w-full bg-background text-foreground md:overflow-hidden">
      <div className="w-full md:w-[35%] lg:w-[30%] md:h-full flex flex-col border-b md:border-b-0 md:border-r border-border/50">
        <BellSchedule />
      </div>
      <div className="w-full md:flex-1 md:h-full">
        <InformationBoard />
      </div>

      <div className="fixed bottom-4 right-4 z-50">
        <AdminLoginDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
          <Button variant="ghost" size="icon" onClick={() => setIsLoginDialogOpen(true)} className="rounded-full bg-primary/10 hover:bg-primary/20 backdrop-blur-sm">
            <Cog className="h-6 w-6 text-primary" />
          </Button>
        </AdminLoginDialog>
      </div>
    </main>
  );
}
