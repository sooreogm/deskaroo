
import { Room } from '@/types';
import { cn } from '@/lib/utils';

interface RoomSelectorProps {
  rooms: Room[];
  selectedRoom: string | null;
  onRoomSelect: (roomId: string) => void;
}

const RoomSelector = ({ rooms, selectedRoom, onRoomSelect }: RoomSelectorProps) => {
  return (
    <div className="mb-6 overflow-auto pb-2">
      <div className="flex space-x-2">
        {rooms.map(room => (
          <button
            key={room.id}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              selectedRoom === room.id
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
            onClick={() => onRoomSelect(room.id)}
          >
            {room.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoomSelector;
