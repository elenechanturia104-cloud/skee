'use client';
import { ArrowLeft, Power } from 'lucide-react';
import Link from 'next/link';
import { useChronoBoard } from '@/hooks/use-chronoboard';
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/components/admin/protected-route';
import { ChronoBoardLogo } from '@/components/icons';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useChronoBoard();
  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-muted/40">
        <div className="flex flex-col">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2">
                <div className="flex items-center gap-2">
                    <ChronoBoardLogo className="h-8 w-8 text-primary"/>
                    <h1 className="text-xl font-headline font-semibold">ადმინისტრირების პანელი</h1>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            დაფაზე დაბრუნება
                        </Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={logout}>
                        <Power className="h-4 w-4 mr-2" />
                        გასვლა
                    </Button>
                </div>
            </header>
            <main className="p-4 sm:px-6 sm:py-0">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
