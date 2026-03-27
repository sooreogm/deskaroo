import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { BookingDuration, TimeSlot } from '@/types';
import { cancelBookingRequest, createBookingRequest, fetchBookings } from '@/lib/api';

interface CreateBookingInput {
  deskId: string;
  roomId: string;
  startDate: Date;
  endDate?: Date;
  duration: BookingDuration;
  timeSlot?: TimeSlot;
}

export const useUserBookings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['bookings', 'user', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const bookings = await fetchBookings({ userId: user.id });
      return bookings.sort((a, b) => b.date.getTime() - a.date.getTime());
    },
    enabled: !!user,
  });
};

export const useBookingsByDate = (date: Date) => {
  return useBookingsByRange(date, date);
};

export const useBookingsByRange = (startDate: Date, endDate?: Date) => {
  return useQuery({
    queryKey: [
      'bookings',
      'range',
      startDate.toISOString().split('T')[0],
      (endDate ?? startDate).toISOString().split('T')[0],
    ],
    queryFn: async () => {
      const bookings = await fetchBookings({ dateFrom: startDate, dateTo: endDate ?? startDate });
      return bookings.filter((booking) => booking.status !== 'cancelled');
    },
  });
};

export const useCreateBooking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (booking: CreateBookingInput) => {
      if (!user) throw new Error('Not authenticated');
      return createBookingRequest({
        userId: user.id,
        ...booking,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      return cancelBookingRequest(bookingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
