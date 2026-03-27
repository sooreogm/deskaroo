
import { Notification, Booking } from '@/types';
import { toast } from 'sonner';
import { getUserTeamMembers } from './users';
import { getBookingStore } from './bookingStore';
import { getUserById } from './users';

// Mock storage
let notifications: Notification[] = [];

// Notify users about an available desk
export const notifyDeskAvailable = (deskId: string, date: Date): void => {
  // In a real app, this would identify users who have set preferences for this desk
  // or who have searched for availability on this date
  const notification: Notification = {
    id: `notification-${Date.now()}`,
    userId: 'all', // Broadcast to all for this example
    message: `A desk has become available on ${date.toLocaleDateString()}`,
    read: false,
    createdAt: new Date(),
    type: 'desk_available',
    actionUrl: `/book?date=${date.toISOString()}&deskId=${deskId}`,
  };

  notifications.push(notification);
  toast.info(notification.message);
};

// New function: Notify team members about a booking
export const notifyTeamBooking = (booking: Booking): void => {
  const user = getUserById(booking.userId);
  if (!user) return;
  
  // Get team members of the user
  const teamMembers = getUserTeamMembers(booking.userId);
  
  if (teamMembers.length === 0) return;
  
  // Create a notification for each team member
  teamMembers.forEach(member => {
    const bookingDate = booking.date.toLocaleDateString();
    const notification: Notification = {
      id: `notification-${Date.now()}-${member.id}`,
      userId: member.id,
      message: `${user.name} has booked a desk on ${bookingDate}`,
      read: false,
      createdAt: new Date(),
      type: 'team_booking',
      actionUrl: `/mybookings?date=${booking.date.toISOString()}`,
      relatedUserId: booking.userId,
      relatedBookingId: booking.id,
    };
    
    notifications.push(notification);
    
    // In a real app, this would push notifications via websockets or another real-time method
    // For this mock, we just add it to our local store
  });
  
  // Show a toast notification for demo purposes
  toast.success(`Team members notified about your booking`);
};

// Get notifications for a user
export const getUserNotifications = (userId: string): Notification[] => {
  return notifications.filter(
    (notification) => notification.userId === userId || notification.userId === 'all'
  );
};

// Mark a notification as read
export const markNotificationAsRead = (notificationId: string): void => {
  const index = notifications.findIndex((notification) => notification.id === notificationId);
  if (index !== -1) {
    notifications[index].read = true;
  }
};

// Initialize mock notification data
export const initializeNotifications = (): void => {
  const today = new Date();
  
  // Sample notification
  notifications = [
    {
      id: 'notification-1',
      userId: 'user-1',
      message: 'A desk has become available tomorrow',
      read: false,
      createdAt: new Date(today.setMinutes(today.getMinutes() - 30)),
      type: 'desk_available',
      actionUrl: '/book',
    },
  ];
};
