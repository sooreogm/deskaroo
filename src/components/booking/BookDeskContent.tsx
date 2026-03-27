
import { useState, useEffect } from 'react';
import { 
  getBookingsByDate, 
  getDeskById, 
  getDesks, 
  getRooms 
} from '@/utils';
import { motion } from 'framer-motion';
import { Desk, Room } from '@/types';
import BookingForm from '@/components/BookingForm';
import BookingTabs from '@/components/booking/BookingTabs';
import SelectedDeskInfo from '@/components/booking/SelectedDeskInfo';

interface BookDeskContentProps {
  initialDate: Date;
  initialDeskId: string | null;
}

const BookDeskContent = ({ initialDate, initialDeskId }: BookDeskContentProps) => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedDesk, setSelectedDesk] = useState<string | null>(initialDeskId);
  const [rooms, setRooms] = useState<Room[]>(getRooms());
  const [desks, setDesks] = useState<Desk[]>(getDesks());
  const [bookings, setBookings] = useState<string[]>([]);

  useEffect(() => {
    // If a desk is pre-selected from URL params, also select its room
    if (initialDeskId) {
      const desk = getDeskById(initialDeskId);
      if (desk) {
        setSelectedRoom(desk.roomId);
      }
    } else if (rooms.length > 0 && !selectedRoom) {
      // Default to first room if none selected
      setSelectedRoom(rooms[0].id);
    }
  }, [initialDeskId, rooms, selectedRoom]);

  useEffect(() => {
    // Get all bookings for today
    const currentBookings = getBookingsByDate(new Date());
    // Extract desk IDs from bookings
    const bookedDeskIds = currentBookings.map(booking => booking.deskId);
    setBookings(bookedDeskIds);
  }, []);

  const handleDeskSelect = (deskId: string) => {
    setSelectedDesk(deskId);
    // Find the desk to get its room
    const desk = desks.find(d => d.id === deskId);
    if (desk) {
      setSelectedRoom(desk.roomId);
    }
  };

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoom(roomId);
    // Reset selected desk when changing rooms
    setSelectedDesk(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <BookingTabs
          rooms={rooms}
          desks={desks}
          bookings={bookings}
          selectedRoom={selectedRoom}
          selectedDesk={selectedDesk}
          onRoomSelect={handleRoomSelect}
          onDeskSelect={handleDeskSelect}
        />
      </div>
      
      <div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <BookingForm
            selectedDeskId={selectedDesk}
            selectedRoomId={selectedRoom}
          />
        </motion.div>
        
        <SelectedDeskInfo
          selectedDesk={selectedDesk}
          desks={desks}
        />
      </div>
    </div>
  );
};

export default BookDeskContent;
