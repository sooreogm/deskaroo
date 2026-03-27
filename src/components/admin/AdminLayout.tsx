'use client';

import { ReactNode } from 'react';
import { ArrowLeft, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import FloatingAdminNav from './FloatingAdminNav';

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto min-h-screen max-w-[1680px] px-4 pb-32 pt-6 sm:px-6 sm:pb-36 sm:pt-8 lg:px-10 lg:pt-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Button asChild variant="outline" className="h-11 rounded-full border-black/10 bg-white/80 px-5">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to App
            </Link>
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-full border-black/10 bg-white/80 px-5"
            onClick={() => void handleSignOut()}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
        {children}
      </main>
      <FloatingAdminNav />
    </div>
  );
};

export default AdminLayout;
