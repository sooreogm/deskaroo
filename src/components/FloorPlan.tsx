
import { useState } from 'react';
import { Desk, Room, BookingDuration } from '@/types';
import FloorPlanLegend from '@/components/booking/FloorPlanLegend';
import RoomUtilitiesList from '@/components/icons/RoomUtilities';
import { getBookingsByDate } from '@/utils/bookings';
import RoomLayout from '@/components/floorplan/room/RoomLayout';
import RoomFurniture from '@/components/floorplan/room/RoomFurniture';
import DeskPositioner from '@/components/floorplan/room/DeskPositioner';

interface FloorPlanProps {
  room: Room;
  desks: Desk[];
  bookings: string[];
  selectedDesk: string | null;
  onDeskSelect: (deskId: string) => void;
}

const FloorPlan = ({ room, desks, bookings, selectedDesk, onDeskSelect }: FloorPlanProps) => {
  // Room container dimensions
  const [roomSize] = useState({ width: 400, height: 300 });
  const [hoveredDesk, setHoveredDesk] = useState<string | null>(null);

  // Filter desks for this room
  const roomDesks = desks.filter(desk => desk.roomId === room.id);

  // Get all bookings for today to determine duration
  const todayBookings = getBookingsByDate(new Date());
  
  // Create a map of desk bookings with their durations
  const deskBookingMap: Record<string, BookingDuration> = {};
  todayBookings.forEach(booking => {
    if (booking.status !== 'cancelled') {
      deskBookingMap[booking.deskId] = booking.duration;
    }
  });

  // Calculate appropriate scaling factors to ensure desks fit within container
  // Add padding to avoid desks touching the edges
  const PADDING = 80; // Increased padding to keep desks well within bounds
  const maxX = Math.max(...roomDesks.map(desk => desk.position.x), 100);
  const maxY = Math.max(...roomDesks.map(desk => desk.position.y), 100);
  const scale = Math.min(
    (roomSize.width - PADDING) / maxX,
    (roomSize.height - PADDING) / maxY
  );

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium">{room.name} - Floor {room.floor}</h3>
        <p className="text-sm text-gray-500">Capacity: {room.capacity} desks</p>
        
        {/* Room Utilities */}
        {room.utilities && room.utilities.length > 0 && (
          <div className="mt-2">
            <h4 className="text-sm font-medium">Room Utilities:</h4>
            <RoomUtilitiesList utilities={room.utilities} className="mt-1" />
          </div>
        )}
      </div>
      
      <div 
        className="relative p-6" 
        style={{ 
          width: '100%',
          height: '400px',
          background: 'linear-gradient(to bottom, #f9fafb 0%, #f3f4f6 100%)'
        }}
      >
        {/* Room layout with furniture */}
        <RoomLayout room={room}>
          <RoomFurniture room={room} />
        </RoomLayout>
        
        {/* Render desks with boundary constraints */}
        <DeskPositioner 
          roomDesks={roomDesks}
          roomSize={roomSize}
          scale={scale}
          padding={PADDING}
          bookings={bookings}
          selectedDesk={selectedDesk}
          hoveredDesk={hoveredDesk}
          deskBookingMap={deskBookingMap}
          onDeskSelect={onDeskSelect}
          onHover={setHoveredDesk}
        />
      </div>
      
      <FloorPlanLegend 
        roomDesks={roomDesks} 
        isDeskBooked={(deskId) => bookings.includes(deskId) || 
          desks.find(d => d.id === deskId)?.status === 'booked'} 
      />
    </div>
  );
};

export default FloorPlan;
