'use client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminUsers from '@/views/admin/AdminUsers';
export default function Page() { return <ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>; }
