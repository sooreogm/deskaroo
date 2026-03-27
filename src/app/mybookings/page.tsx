'use client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import MyBookings from '@/views/MyBookings';
export default function Page() { return <ProtectedRoute><MyBookings /></ProtectedRoute>; }
