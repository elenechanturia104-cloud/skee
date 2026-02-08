
'use client';

import SuperAdminDashboard from '@/components/admin/super-admin-dashboard';
import withSuperAdminAuth from '@/components/admin/with-super-admin-auth';

const AuthenticatedSuperAdminDashboard = withSuperAdminAuth(SuperAdminDashboard);

export default function SuperAdminPage() {
  return (
    <div>
      <AuthenticatedSuperAdminDashboard />
    </div>
  );
}
