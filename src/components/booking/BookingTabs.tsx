
import { Desk, Room } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FloorPlan from '@/components/FloorPlan';
import RoomSelector from '@/components/booking/RoomSelector';
import CardView from '@/components/booking/CardView';
import { motion } from 'framer-motion';

interface BookingTabsProps {
  rooms: Room[];
  desks: Desk[];
  bookings: string[];
  selectedRoom: string | null;
  selectedDesk: string | null;
  onRoomSelect: (roomId: string) => void;
  onDeskSelect: (deskId: string) => void;
}

const BookingTabs = ({
  rooms,
  desks,
  bookings,
  selectedRoom,
  selectedDesk,
  onRoomSelect,
  onDeskSelect
}: BookingTabsProps) => {
  return (
    <Tabs defaultValue="floor-plan" className="w-full">
      <TabsList className="mb-6 grid h-auto w-full grid-cols-1 gap-2 rounded-2xl bg-muted/70 p-1 sm:grid-cols-2">
        <TabsTrigger value="floor-plan" className="min-h-[48px] whitespace-normal px-4 py-2 text-center">Floor Plan</TabsTrigger>
        <TabsTrigger value="card-view" className="min-h-[48px] whitespace-normal px-4 py-2 text-center">Card View</TabsTrigger>
      </TabsList>
      
      {/* Room selection */}
      <RoomSelector 
        rooms={rooms}
        selectedRoom={selectedRoom}
        onRoomSelect={onRoomSelect}
      />
      
      <TabsContent value="floor-plan" className="mt-0">
        {selectedRoom && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            key={selectedRoom}
          >
            <FloorPlan
              room={rooms.find(r => r.id === selectedRoom)!}
              desks={desks}
              bookings={bookings}
              selectedDesk={selectedDesk}
              onDeskSelect={onDeskSelect}
            />
          </motion.div>
        )}
      </TabsContent>
      
      <TabsContent value="card-view" className="mt-0">
        <CardView
          selectedRoom={selectedRoom}
          rooms={rooms}
          desks={desks}
          bookings={bookings}
          selectedDesk={selectedDesk}
          onDeskSelect={onDeskSelect}
        />
      </TabsContent>
    </Tabs>
  );
};

export default BookingTabs;
