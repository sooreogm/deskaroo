
import { Booking } from '@/types';
import BookingCard from './BookingCard';
import EmptyState from './EmptyState';

interface BookingTabsContentProps {
  bookings: Booking[];
  type: 'active' | 'past' | 'cancelled';
  onEditBooking: (booking: Booking) => void;
  onDeleteBooking: (booking: Booking) => void;
}

const BookingTabsContent = ({ 
  bookings, 
  type, 
  onEditBooking, 
  onDeleteBooking 
}: BookingTabsContentProps) => {
  const isEmpty = bookings.length === 0;
  
  // Show empty state if no bookings
  if (isEmpty) {
    return <EmptyState type={type} />;
  }
  
  // Show booking cards
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
      {bookings.map(booking => (
        <BookingCard
          key={booking.id}
          booking={booking}
          canManage={type !== 'past'}
          onEditBooking={onEditBooking}
          onDeleteBooking={onDeleteBooking}
        />
      ))}
    </div>
  );
};

export default BookingTabsContent;
