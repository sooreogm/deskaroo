
import { Booking, BookingDuration, TimeSlot } from '@/types';
import { toast } from 'sonner';
import { 
  getBookingStore, 
  setBookingStore, 
  findBookingIndex 
} from './bookingStore';
import { isDeskAvailable, checkBookingAvailability } from './bookingAvailability';
import { notifyDeskAvailable, notifyTeamBooking } from './notifications';

// Get bookings for a specific date
export const getBookingsByDate = (date: Date): Booking[] => {
  const bookings = getBookingStore();
  return bookings.filter(
    (booking) => booking.date.toDateString() === date.toDateString()
  );
};

// Get bookings for a specific user
export const getBookingsByUser = (userId: string): Booking[] => {
  const bookings = getBookingStore();
  return bookings.filter((booking) => booking.userId === userId);
};

export const getAllBookings = (): Booking[] => {
  return [...getBookingStore()];
};

export const getBookingById = (bookingId: string): Booking | undefined => {
  return getBookingStore().find((booking) => booking.id === bookingId);
};

export const getBookingForDeskAndUserOnDate = (
  deskId: string,
  userId: string,
  date: Date
): Booking | undefined => {
  return getBookingStore().find(
    (booking) =>
      booking.deskId === deskId &&
      booking.userId === userId &&
      booking.date.toDateString() === date.toDateString() &&
      ['confirmed', 'checked_in', 'checked_out'].includes(booking.status)
  );
};

// Create a new booking
export const createBooking = (
  userId: string,
  deskId: string,
  roomId: string,
  date: Date,
  duration: BookingDuration,
  timeSlot?: TimeSlot
): Booking | null => {
  // Check if the desk is available
  if (!isDeskAvailable(deskId, date, duration, timeSlot)) {
    toast.error('This desk is not available for the selected time slot');
    return null;
  }

  const booking: Booking = {
    id: `booking-${Date.now()}`,
    userId,
    deskId,
    roomId,
    date,
    duration,
    timeSlot,
    status: 'confirmed',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const bookings = getBookingStore();
  setBookingStore([...bookings, booking]);
  toast.success('Booking confirmed!');
  
  // Notify team members about the booking
  notifyTeamBooking(booking);
  
  return booking;
};

// Update an existing booking
export const updateBooking = (
  bookingId: string,
  updates: Partial<Booking>
): Booking | null => {
  const bookings = getBookingStore();
  const index = findBookingIndex(bookingId);
  
  if (index === -1) {
    toast.error('Booking not found');
    return null;
  }

  // Check availability if desk, date or duration is changing
  if (
    (updates.deskId && updates.deskId !== bookings[index].deskId) ||
    (updates.date && updates.date.toDateString() !== bookings[index].date.toDateString()) ||
    updates.duration ||
    updates.timeSlot
  ) {
    if (!checkBookingAvailability(bookingId, updates, bookings[index])) {
      toast.error('This desk is not available for the selected time slot');
      return null;
    }
  }

  const updatedBooking = {
    ...bookings[index],
    ...updates,
    updatedAt: new Date(),
  };
  
  bookings[index] = updatedBooking;
  setBookingStore(bookings);

  toast.success('Booking updated successfully');
  return updatedBooking;
};

// Cancel a booking
export const cancelBooking = (bookingId: string): boolean => {
  const bookings = getBookingStore();
  const index = findBookingIndex(bookingId);
  
  if (index === -1) {
    toast.error('Booking not found');
    return false;
  }

  // Update the booking status to cancelled
  bookings[index] = {
    ...bookings[index],
    status: 'cancelled',
    updatedAt: new Date(),
  };
  
  setBookingStore(bookings);

  // Notify users who might be interested in this desk
  notifyDeskAvailable(bookings[index].deskId, bookings[index].date);

  toast.success('Booking cancelled successfully');
  return true;
};

export const updateBookingStatus = (
  bookingId: string,
  status: Booking['status']
): Booking | null => {
  const bookings = getBookingStore();
  const index = findBookingIndex(bookingId);

  if (index === -1) {
    toast.error('Booking not found');
    return null;
  }

  const updates: Partial<Booking> = {
    status,
    updatedAt: new Date(),
  };

  if (status === 'checked_in') {
    updates.checkedInAt = new Date();
  }

  if (status === 'checked_out') {
    updates.checkedOutAt = new Date();
  }

  bookings[index] = {
    ...bookings[index],
    ...updates,
  };

  setBookingStore(bookings);
  return bookings[index];
};

// Re-export initialization function
export { initializeBookings } from './bookingStore';

// Re-export availability functions
export { isDeskAvailable, checkBookingAvailability } from './bookingAvailability';
