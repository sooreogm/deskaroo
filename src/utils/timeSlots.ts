
import { BookingDuration } from '@/types';

// Generate time slots for booking
export const generateTimeSlots = (date: Date): { label: string; value: BookingDuration }[] => {
  const options = [
    { label: 'Full Day (9:00 AM - 5:00 PM)', value: 'full-day' as BookingDuration },
    { label: 'Morning (9:00 AM - 1:00 PM)', value: 'morning' as BookingDuration },
    { label: 'Afternoon (1:00 PM - 5:00 PM)', value: 'afternoon' as BookingDuration },
    { label: 'Custom Hours', value: 'custom' as BookingDuration },
  ];

  return options;
};
