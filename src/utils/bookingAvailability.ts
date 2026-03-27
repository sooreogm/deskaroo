
import { Booking, BookingDuration, TimeSlot } from '@/types';
import { getBookingStore } from './bookingStore';

// Check if a desk is available for a specific date and time slot
export const isDeskAvailable = (
  deskId: string,
  date: Date,
  duration: BookingDuration,
  timeSlot?: TimeSlot
): boolean => {
  const bookings = getBookingStore();
  const deskBookings = bookings.filter(
    (booking) =>
      booking.deskId === deskId &&
      booking.date.toDateString() === date.toDateString() &&
      booking.status !== 'cancelled'
  );

  // If there are no bookings for this desk on this date, it's available
  if (deskBookings.length === 0) return true;

  // For full-day bookings, the desk must have no bookings
  if (duration === 'full-day') return deskBookings.length === 0;

  // For half-day or custom bookings, check time slot overlaps
  if (duration === 'morning') {
    return !deskBookings.some(
      (booking) => booking.duration === 'full-day' || booking.duration === 'morning'
    );
  }

  if (duration === 'afternoon') {
    return !deskBookings.some(
      (booking) => booking.duration === 'full-day' || booking.duration === 'afternoon'
    );
  }

  // For custom time slots, check for overlaps
  if (duration === 'custom' && timeSlot) {
    return !deskBookings.some((booking) => {
      if (booking.duration === 'full-day') return true;
      if (booking.duration === 'morning' && timeSlot.start.getHours() < 12) return true;
      if (booking.duration === 'afternoon' && timeSlot.end.getHours() >= 12) return true;
      if (booking.duration === 'custom' && booking.timeSlot) {
        return (
          (timeSlot.start >= booking.timeSlot.start && timeSlot.start < booking.timeSlot.end) ||
          (timeSlot.end > booking.timeSlot.start && timeSlot.end <= booking.timeSlot.end) ||
          (timeSlot.start <= booking.timeSlot.start && timeSlot.end >= booking.timeSlot.end)
        );
      }
      return false;
    });
  }

  return true;
};

// Check availability for an update to an existing booking
export const checkBookingAvailability = (
  bookingId: string,
  updates: Partial<Booking>,
  currentBooking: Booking
): boolean => {
  const bookings = getBookingStore();
  
  const deskId = updates.deskId || currentBooking.deskId;
  const date = updates.date || currentBooking.date;
  const duration = updates.duration || currentBooking.duration;
  const timeSlot = updates.timeSlot || currentBooking.timeSlot;

  // Skip availability check for the same booking
  const otherBookings = bookings.filter((b) => b.id !== bookingId);
  
  const isAvailable = !otherBookings.some(
    (b) =>
      b.deskId === deskId &&
      b.date.toDateString() === date.toDateString() &&
      b.status !== 'cancelled' &&
      // Check for time slot overlap
      ((duration === 'full-day' || b.duration === 'full-day') ||
        (duration === 'morning' && b.duration === 'morning') ||
        (duration === 'afternoon' && b.duration === 'afternoon') ||
        (duration === 'custom' && b.duration === 'custom' && timeSlot && b.timeSlot &&
          ((timeSlot.start >= b.timeSlot.start && timeSlot.start < b.timeSlot.end) ||
            (timeSlot.end > b.timeSlot.start && timeSlot.end <= b.timeSlot.end) ||
            (timeSlot.start <= b.timeSlot.start && timeSlot.end >= b.timeSlot.end))))
  );

  return isAvailable;
};
