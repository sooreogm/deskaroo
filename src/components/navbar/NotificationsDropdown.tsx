import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Notification } from '@/types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotificationsDropdownProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
}

const NotificationsDropdown = ({
  notifications,
  onNotificationClick,
}: NotificationsDropdownProps) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const count = notifications.filter((n) => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="cursor-pointer"
                onClick={() => onNotificationClick(notification)}
              >
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <span className="text-sm">{notification.message}</span>
                    {!notification.read && (
                      <Badge variant="secondary" className="ml-2">
                        New
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
