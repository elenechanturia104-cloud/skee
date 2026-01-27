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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">
            <LayoutDashboard className="mr-2 h-4 w-4" /> დაფის შიგთავსი
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <CalendarClock className="mr-2 h-4 w-4" /> განრიგი
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="mr-2 h-4 w-4" /> გარეგნობა
          </TabsTrigger>
          <TabsTrigger value="logs">
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
