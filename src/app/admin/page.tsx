'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScheduleManager } from '@/components/admin/schedule-manager';
import { ContentManager } from '@/components/admin/content-manager';
import { AppearanceManager } from '@/components/admin/appearance-manager';
import { LogViewer } from '@/components/admin/log-viewer';
import { CalendarClock, LayoutDashboard, Palette, History } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="content">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 h-auto">
          <TabsTrigger value="content" className="py-2 sm:py-1.5">
            <LayoutDashboard className="mr-2 h-4 w-4" /> დაფის შიგთავსი
          </TabsTrigger>
          <TabsTrigger value="schedule" className="py-2 sm:py-1.5">
            <CalendarClock className="mr-2 h-4 w-4" /> განრიგი
          </TabsTrigger>
          <TabsTrigger value="appearance" className="py-2 sm:py-1.5">
            <Palette className="mr-2 h-4 w-4" /> გარეგნობა
          </TabsTrigger>
          <TabsTrigger value="logs" className="py-2 sm:py-1.5">
            <History className="mr-2 h-4 w-4" /> ცვლილებების ისტორია
          </TabsTrigger>
        </TabsList>
        <TabsContent value="content">
          <ContentManager />
        </TabsContent>
        <TabsContent value="schedule">
          <ScheduleManager />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceManager />
        </TabsContent>
        <TabsContent value="logs">
          <LogViewer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
