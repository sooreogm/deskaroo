'use client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminRooms from '@/views/admin/AdminRooms';
export default function Page() { return <ProtectedRoute requireAdmin><AdminRooms /></ProtectedRoute>; }
