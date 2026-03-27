
import React from 'react';
import { Room } from '@/types';

interface RoomFurnitureProps {
  room: Room;
}

const RoomFurniture = ({ room }: RoomFurnitureProps) => {
  // Generate furniture layout based on room type
  const generateFurniture = () => {
    // Add furniture elements appropriate for this room
    const furniture = [];
    
    // Add tables based on room capacity (approximately 1 table per 4 desks)
    const tableCount = Math.ceil(room.capacity / 4);
    
    for (let i = 0; i < tableCount; i++) {
      // Position tables evenly around the room
      const xPos = 50 + (i % 3) * 100;
      const yPos = 75 + Math.floor(i / 3) * 80;
      
      furniture.push(
        <div 
          key={`table-${i}`}
          className="absolute bg-amber-50 border border-amber-200 rounded-md"
          style={{
            left: `${xPos}px`,
            top: `${yPos}px`,
            width: '120px',
            height: '60px',
            zIndex: 1
          }}
        >
          <div className="text-xs text-center text-amber-800 mt-1 opacity-50">Table {i+1}</div>
        </div>
      );
    }
    
    // Add other room elements based on utilities
    if (room.utilities) {
      if (room.utilities.find(u => u.type === 'whiteboard' && u.available)) {
        furniture.push(
          <div 
            key="whiteboard"
            className="absolute bg-gray-100 border-2 border-gray-300"
            style={{
              right: '20px',
              top: '10px',
              width: '80px',
              height: '5px',
              zIndex: 1
            }}
          >
            <div className="text-xs text-center text-gray-500 absolute -bottom-4 left-0 right-0">Whiteboard</div>
          </div>
        );
      }
      
      if (room.utilities.find(u => u.type === 'projector' && u.available)) {
        furniture.push(
          <div 
            key="projector"
            className="absolute bg-gray-300 border border-gray-400 rounded-sm"
            style={{
              right: '50px',
              bottom: '10px',
              width: '20px',
              height: '20px',
              zIndex: 1
            }}
          >
            <div className="text-xs text-center text-gray-500 absolute -bottom-4 left-0 right-0">Projector</div>
          </div>
        );
      }
    }
    
    return furniture;
  };

  return <>{generateFurniture()}</>;
};

export default RoomFurniture;
