
import { Room, Desk } from '@/types';
import DeskCard from '@/components/DeskCard';
import { motion } from 'framer-motion';

interface CardViewProps {
  selectedRoom: string | null;
  rooms: Room[];
  desks: Desk[];
  bookings: string[];
  selectedDesk: string | null;
  onDeskSelect: (deskId: string) => void;
}

const CardView = ({ 
  selectedRoom, 
  rooms, 
  desks, 
  bookings, 
  selectedDesk, 
  onDeskSelect 
}: CardViewProps) => {
  // Filter desks by room for card view
  const filteredDesks = desks.filter(desk => 
    (selectedRoom ? desk.roomId === selectedRoom : true) && 
    desk.status !== 'maintenance'
  );
  
  // Group desks by room for card view
  const desksByRoom = rooms.map(room => ({
    room,
    desks: filteredDesks.filter(desk => desk.roomId === room.id)
  }));
  
  return (
    <>
      {selectedRoom && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          key={selectedRoom}
          className="space-y-8"
        >
          {desksByRoom
            .filter(item => item.room.id === selectedRoom)
            .map(({ room, desks }) => (
              <div key={room.id} className="space-y-4">
                <h3 className="text-lg font-medium">{room.name}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {desks.map(desk => {
                    const isBooked = bookings.includes(desk.id) || desk.status === 'booked';
                    return (
                      <DeskCard
                        key={desk.id}
                        desk={desk}
                        room={room}
                        isSelected={selectedDesk === desk.id}
                        isBooked={isBooked}
                        onClick={() => onDeskSelect(desk.id)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
        </motion.div>
      )}
    </>
  );
};

export default CardView;
