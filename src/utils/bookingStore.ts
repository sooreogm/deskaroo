
import { Booking } from '@/types';

// Mock data storage
let bookings: Booking[] = [];

// Get the bookings store
export const getBookingStore = (): Booking[] => {
  return bookings;
};

// Set the bookings store
export const setBookingStore = (newBookings: Booking[]): void => {
  bookings = newBookings;
};

// Find a booking index by ID
export const findBookingIndex = (bookingId: string): number => {
  return bookings.findIndex((booking) => booking.id === bookingId);
};

// Initialize mock booking data
export const initializeBookings = (): void => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Sample user ID
  const sampleUserId = 'user-1';

  // Some pre-existing bookings
  bookings = [
    {
      id: 'booking-1',
      userId: sampleUserId,
      deskId: 'desk-1',
      roomId: 'room-1',
      date: today,
      duration: 'full-day',
      status: 'confirmed',
      createdAt: new Date(today.setHours(today.getHours() - 2)),
      updatedAt: new Date(today.setHours(today.getHours() - 2)),
    },
    {
      id: 'booking-2',
      userId: 'user-2',
      deskId: 'desk-2',
      roomId: 'room-1',
      date: today,
      duration: 'morning',
      status: 'confirmed',
      createdAt: new Date(today.setHours(today.getHours() - 1)),
      updatedAt: new Date(today.setHours(today.getHours() - 1)),
    },
    {
      id: 'booking-3',
      userId: sampleUserId,
      deskId: 'desk-3',
      roomId: 'room-2',
      date: tomorrow,
      duration: 'afternoon',
      status: 'confirmed',
      createdAt: new Date(today.setHours(today.getHours() - 1)),
      updatedAt: new Date(today.setHours(today.getHours() - 1)),
    },
  ];
};
