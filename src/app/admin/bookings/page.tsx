'use client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminBookings from '@/views/admin/AdminBookings';
export default function Page() { return <ProtectedRoute requireAdmin><AdminBookings /></ProtectedRoute>; }
