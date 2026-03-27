
import React from 'react';
import { Desk, BookingDuration } from '@/types';
import FloorPlanDesk from '@/components/booking/FloorPlanDesk';

interface DeskPositionerProps {
  roomDesks: Desk[];
  roomSize: { width: number; height: number };
  scale: number;
  padding: number;
  bookings: string[];
  selectedDesk: string | null;
  hoveredDesk: string | null;
  deskBookingMap: Record<string, BookingDuration>;
  onDeskSelect: (deskId: string) => void;
  onHover: (deskId: string | null) => void;
}

const DeskPositioner = ({ 
  roomDesks, 
  roomSize, 
  scale, 
  padding, 
  bookings, 
  selectedDesk, 
  hoveredDesk,
  deskBookingMap,
  onDeskSelect, 
  onHover 
}: DeskPositionerProps) => {
  // Determine if a desk is booked
  const isDeskBooked = (deskId: string) => {
    return bookings.includes(deskId) || roomDesks.find(d => d.id === deskId)?.status === 'booked';
  };

  // Get booking duration for a desk (if booked)
  const getDeskBookingDuration = (deskId: string): BookingDuration | null => {
    if (isDeskBooked(deskId)) {
      return deskBookingMap[deskId] || 'full-day'; // Default to full-day if not specified
    }
    return null;
  };

  return (
    <>
      {roomDesks.map(desk => {
        // Calculate constrained position to ensure desks stay within bounds
        // Add padding based on desk dimensions to prevent edge clipping
        const deskWidth = 50; // Default desk width
        const deskHeight = 30; // Default desk height
        
        // Calculate position with constraints
        const xPos = Math.min(
          Math.max(desk.position.x * scale + padding/2, padding/2 + deskWidth/2),
          roomSize.width - padding/2 - deskWidth/2
        );
        
        const yPos = Math.min(
          Math.max(desk.position.y * scale + padding/2, padding/2 + deskHeight/2),
          roomSize.height - padding/2 - deskHeight/2
        );
        
        return (
          <FloorPlanDesk
            key={desk.id}
            desk={{
              ...desk,
              position: {
                x: xPos / scale,
                y: yPos / scale
              }
            }}
            scale={scale}
            isBooked={isDeskBooked(desk.id)}
            bookingDuration={getDeskBookingDuration(desk.id)}
            isHovered={hoveredDesk === desk.id}
            isSelected={selectedDesk === desk.id}
            onDeskSelect={onDeskSelect}
            onHover={onHover}
          />
        );
      })}
    </>
  );
};

export default DeskPositioner;
