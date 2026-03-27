import { Calendar, Clock3, Home, MessageSquare, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const appLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'Book Desk', path: '/book', icon: Calendar },
  { name: 'My Bookings', path: '/mybookings', icon: Clock3 },
  { name: 'Community', path: '/community', icon: MessageSquare },
  { name: 'Profile', path: '/profile', icon: UserRound },
];

const FloatingAppNav = () => {
  const pathname = usePathname();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:bottom-5 sm:px-6">
      <nav className="pointer-events-auto w-fit rounded-full border border-black/10 bg-white/88 p-2 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.45)] backdrop-blur-xl">
        <div className="flex items-center gap-1 sm:gap-2">
          {appLinks.map((link) => {
            const isActive = pathname === link.path;

            return (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  'flex h-12 w-12 flex-none items-center justify-center rounded-full text-sm font-medium transition-colors sm:w-auto sm:gap-2 sm:px-5',
                  isActive
                    ? 'bg-black text-white shadow-[0_18px_34px_-24px_rgba(15,23,42,0.8)]'
                    : 'text-foreground/70 hover:bg-black/5 hover:text-foreground'
                )}
              >
                <link.icon className="h-4 w-4 flex-none" />
                <span className="hidden sm:inline">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default FloatingAppNav;
