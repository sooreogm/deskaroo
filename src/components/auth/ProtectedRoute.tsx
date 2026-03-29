'use client';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { LOGIN_REDIRECT_PARAM } from '@/lib/auth-redirect';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!loading && !user) {
      const currentPath = pathname || '/';
      const currentSearch = searchParams.toString();
      const redirectTarget = currentSearch ? `${currentPath}?${currentSearch}` : currentPath;
      const loginUrl = `/login?${LOGIN_REDIRECT_PARAM}=${encodeURIComponent(redirectTarget)}`;

      router.replace(loginUrl);
      return;
    }

    if (!loading && requireAdmin && !isAdmin) {
      router.replace('/dashboard');
    }
  }, [user, loading, requireAdmin, isAdmin, pathname, router, searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
