
'use client';

import { SchoolView } from '@/components/board/school-view';

export default function SchoolPage({ params }: { params: { schoolId: string } }) {
  return <SchoolView schoolId={params.schoolId} />;
}
