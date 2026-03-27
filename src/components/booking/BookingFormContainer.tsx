
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookingDuration, Room } from '@/types';
import { createBooking, generateTimeSlots, getRooms, getCurrentUserTeamMembers } from '@/utils';
import { toast } from 'sonner';

// Import our components
import DatePickerField from '@/components/booking/DatePickerField';
import DurationSelector from '@/components/booking/DurationSelector';
import TimeRangeSelector from '@/components/booking/TimeRangeSelector';

interface BookingFormContainerProps {
  selectedDeskId: string | null;
  selectedRoomId: string | null;
}

const BookingFormContainer = ({ selectedDeskId, selectedRoomId }: BookingFormContainerProps) => {
  const router = useRouter();
  const [date, setDate] = useState<Date>(new Date());
  const [duration, setDuration] = useState<BookingDuration>('full-day');
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('17:00');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasTeamMembers, setHasTeamMembers] = useState(false);

  useEffect(() => {
    // Fetch rooms
    setRooms(getRooms());
    
    // Check if user has team members
    const teamMembers = getCurrentUserTeamMembers();
    setHasTeamMembers(teamMembers.length > 0);
  }, []);

  // Time slot options
  const timeSlots = generateTimeSlots(date);
  
  // Generate hour options for custom booking
  const hourOptions = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9; // 9 AM to 5 PM
    return {
      value: `${hour.toString().padStart(2, '0')}:00`,
      label: `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`.replace('12:00 PM', '12:00 PM'),
    };
  });

  const handleSubmit = () => {
    if (!selectedDeskId || !selectedRoomId) {
      toast.error('Please select a desk');
      return;
    }

    setIsSubmitting(true);

    // Create timeSlot object if custom duration
    const timeSlot = duration === 'custom' 
      ? { 
          start: new Date(date.setHours(parseInt(startTime.split(':')[0]), 0, 0, 0)),
          end: new Date(date.setHours(parseInt(endTime.split(':')[0]), 0, 0, 0))
        }
      : undefined;

    // Create the booking
    const booking = createBooking(
      'user-1', // Current user ID (mock)
      selectedDeskId,
      selectedRoomId,
      date,
      duration,
      timeSlot
    );

    setTimeout(() => {
      setIsSubmitting(false);
      if (booking) {
        router.push('/mybookings');
      }
    }, 1000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Book Your Desk</CardTitle>
        <CardDescription>
          Select date and time for your desk booking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Picker */}
        <DatePickerField date={date} onDateChange={setDate} />
      
        {/* Duration Selection */}
        <DurationSelector 
          duration={duration} 
          timeSlots={timeSlots} 
          onDurationChange={setDuration} 
        />
      
        {/* Custom time selection (only if custom is selected) */}
        {duration === 'custom' && (
          <TimeRangeSelector 
            startTime={startTime}
            endTime={endTime}
            hourOptions={hourOptions}
            onStartTimeChange={setStartTime}
            onEndTimeChange={setEndTime}
          />
        )}
        
        {/* Team notification alert */}
        {hasTeamMembers && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
            Your team members will be notified about this booking.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          disabled={!selectedDeskId || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? 'Processing...' : 'Confirm Booking'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingFormContainer;
