'use client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CheckIn from '@/views/CheckIn';
export default function Page() { return <ProtectedRoute><CheckIn /></ProtectedRoute>; }
