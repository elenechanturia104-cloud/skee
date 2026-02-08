
'use client';

import SchoolAdminDashboard from '@/components/admin/school-admin-dashboard';
import { useSearchParams } from 'next/navigation';

export default function AdminPage() {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get('schoolId');

  if (!schoolId) {
    return <div>School not found.</div>;
  }

  return (
    <div>
      <SchoolAdminDashboard schoolId={schoolId} />
    </div>
  );
}
