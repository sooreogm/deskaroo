
import { BarChart3, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import ProfileTabs from '@/components/profile/ProfileTabs';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const UserProfile = () => {
  const router = useRouter();
  const { isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="shell-panel p-6 sm:p-8">
          <span className="page-eyebrow">Profile</span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Profile settings and account actions
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Update your personal details, security settings, notifications, and display preferences in one place.
          </p>
        </div>

        <ProfileTabs />

        <Card className="shell-panel border-0 bg-white/90 shadow-none">
          <CardHeader className="border-b border-black/8">
            <CardTitle className="text-xl tracking-tight">Account Actions</CardTitle>
            <CardDescription>Admin access and sign-out now live here instead of the main navigation.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row">
            {isAdmin && (
              <Button asChild className="h-11 rounded-full px-5 sm:flex-1">
                <Link href="/admin">
                  <BarChart3 className="h-4 w-4" />
                  Admin Panel
                </Link>
              </Button>
            )}
            <Button
              variant="outline"
              className="h-11 rounded-full border-black/10 bg-white/80 px-5 sm:flex-1"
              onClick={() => void handleSignOut()}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default UserProfile;
