'use client';
import { Suspense } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CheckIn from '@/views/CheckIn';
export default function Page() {
  return (
    <ProtectedRoute>
      <Suspense>
        <CheckIn />
      </Suspense>
    </ProtectedRoute>
  );
}
