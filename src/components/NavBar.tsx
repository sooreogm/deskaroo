import { useState } from 'react';
import { User, Home, Calendar, BarChart, UserRound, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications, useMarkNotificationRead } from '@/hooks/useNotifications';
import Logo from './navbar/Logo';
import DesktopNavLinks from './navbar/DesktopNavLinks';
import NotificationsDropdown from './navbar/NotificationsDropdown';
import MobileMenu from './navbar/MobileMenu';
import { useRouter } from 'next/navigation';
import { Notification } from '@/types';

const NavBar = () => {
  const { signOut, isAdmin: userIsAdmin } = useAuth();
  const { data: notificationsData = [] } = useNotifications();
  const markRead = useMarkNotificationRead();
  const router = useRouter();

  const handleNotificationClick = (notification: Notification) => {
    markRead.mutate(notification.id);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/dashboard', icon: <Home className="h-5 w-5" /> },
    { name: 'Book Desk', path: '/book', icon: <Calendar className="h-5 w-5" /> },
    { name: 'My Bookings', path: '/mybookings', icon: <User className="h-5 w-5" /> },
    { name: 'Profile', path: '/profile', icon: <UserRound className="h-5 w-5" /> },
  ];

  if (userIsAdmin) {
    navLinks.push({ name: 'Admin Panel', path: '/admin', icon: <BarChart className="h-5 w-5" /> });
  }

  return (
    <nav className="w-full bg-background/90 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Logo />
            <DesktopNavLinks links={navLinks} />
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <NotificationsDropdown
              notifications={notificationsData}
              onNotificationClick={handleNotificationClick}
            />
            <div className="ml-3">
              <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <MobileMenu links={navLinks} />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
