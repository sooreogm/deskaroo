'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CommunitySpace from '@/views/CommunitySpace';

export default function Page() {
  return (
    <ProtectedRoute>
      <CommunitySpace />
    </ProtectedRoute>
  );
}
