import { LayoutDashboard, Building2, Calendar, Users, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Logo from '@/components/navbar/Logo';

const adminLinks = [
  { name: 'Overview', path: '/admin', icon: LayoutDashboard },
  { name: 'Rooms & Desks', path: '/admin/rooms', icon: Building2 },
  { name: 'Bookings', path: '/admin/bookings', icon: Calendar },
  { name: 'Users', path: '/admin/users', icon: Users },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <aside className="w-full border-b border-white/10 bg-black text-white lg:min-h-screen lg:w-[292px] lg:flex-none lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 py-5 lg:px-7 lg:py-8">
        <div className="flex items-center justify-between gap-3">
          <Logo href="/admin" tone="dark" />
          <span className="rounded-full border border-white/15 px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-white/65">
            Admin
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 lg:px-5">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:flex-col">
        {adminLinks.map(link => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.path}
              href={link.path}
              className={cn(
                'flex min-h-[52px] min-w-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors sm:justify-center lg:justify-start',
                isActive
                  ? 'bg-primary text-black'
                  : 'bg-white/[0.05] text-white/70 hover:bg-white/[0.1] hover:text-white'
              )}
            >
              <link.icon className="h-4 w-4" />
              <span className="leading-tight text-left sm:text-center lg:text-left">{link.name}</span>
            </Link>
          );
        })}
        </div>
      </nav>

      <div className="mt-auto border-t border-white/10 p-4 space-y-2 lg:p-5">
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="w-full justify-start border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.1] hover:text-white">
            Back to App
          </Button>
        </Link>
        <Button variant="ghost" size="sm" className="w-full justify-start text-white/70 hover:bg-white/[0.08] hover:text-white" onClick={() => signOut()}>
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>
      </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
