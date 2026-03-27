
import React from 'react';
import { Room } from '@/types';

interface RoomLayoutProps {
  room: Room;
  children: React.ReactNode;
}

const RoomLayout = ({ room, children }: RoomLayoutProps) => {
  return (
    <div className="absolute inset-6 border-2 border-gray-400 rounded-lg bg-white/80 backdrop-blur-sm shadow-inner">
      {/* Door */}
      <div className="absolute -left-1 top-1/2 w-2 h-10 bg-gray-500 rounded-r-md transform -translate-y-1/2" />
      
      {/* Windows */}
      <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-blue-100 border border-blue-200" />
      
      {/* Room content */}
      {children}
      
      {/* Room name overlay */}
      <div className="absolute bottom-2 right-2 text-sm text-gray-400 italic">
        {room.name}
      </div>
    </div>
  );
};

export default RoomLayout;
