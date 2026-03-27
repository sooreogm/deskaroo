
import { Booking } from '@/types';

// Gets a formatted time display string for a booking
export const getBookingTimeDisplay = (booking: Booking): string => {
  switch (booking.duration) {
    case 'full-day':
      return '9:00 AM - 5:00 PM';
    case 'morning':
      return '9:00 AM - 1:00 PM';
    case 'afternoon':
      return '1:00 PM - 5:00 PM';
    case 'custom':
      if (booking.timeSlot) {
        const startHour = booking.timeSlot.start.getHours();
        const endHour = booking.timeSlot.end.getHours();
        return `${startHour}:00 - ${endHour}:00`;
      }
      return 'Custom time';
    default:
      return '';
  }
};
