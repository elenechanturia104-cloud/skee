
'use client';

import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import the provider and the main dashboard component with SSR turned off
const ChronoBoardProvider = dynamic(
  () => import('@/hooks/use-chronoboard').then(mod => mod.ChronoBoardProvider),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-screen">Loading Provider...</div> }
);

const SchoolAdminDashboard = dynamic(
  () => import('@/components/admin/school-admin-dashboard'),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-screen">Loading Dashboard...</div> }
);

// ThemeManager needs to be inside the provider, so we can't import it at the top level here
// It will be rendered as a child of the provider, which is what we want
const ThemeManager = dynamic(
    () => import('@/components/theme-manager'),
    { ssr: false }
);


export default function AdminPage() {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get('schoolId');

  if (!schoolId) {
    return <div>School not found.</div>;
  }

  return (
    <ChronoBoardProvider schoolId={schoolId}>
      <ThemeManager>
        <SchoolAdminDashboard schoolId={schoolId} />
      </ThemeManager>
    </ChronoBoardProvider>
  );
}
