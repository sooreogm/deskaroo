'use client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserProfile from '@/views/UserProfile';
export default function Page() { return <ProtectedRoute><UserProfile /></ProtectedRoute>; }
