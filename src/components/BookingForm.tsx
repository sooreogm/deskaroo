
import BookingFormContainer from '@/components/booking/BookingFormContainer';

interface BookingFormProps {
  selectedDeskId: string | null;
  selectedRoomId: string | null;
}

const BookingForm = ({ selectedDeskId, selectedRoomId }: BookingFormProps) => {
  return (
    <BookingFormContainer 
      selectedDeskId={selectedDeskId} 
      selectedRoomId={selectedRoomId} 
    />
  );
};

export default BookingForm;
