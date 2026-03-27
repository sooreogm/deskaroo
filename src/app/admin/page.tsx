'use client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminOverview from '@/views/admin/AdminOverview';
export default function Page() { return <ProtectedRoute requireAdmin><AdminOverview /></ProtectedRoute>; }
