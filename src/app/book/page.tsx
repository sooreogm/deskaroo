'use client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import BookDesk from '@/views/BookDesk';
export default function Page() { return <ProtectedRoute><BookDesk /></ProtectedRoute>; }
