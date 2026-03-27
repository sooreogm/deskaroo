import { Room } from '@/types';

let rooms: Room[] = [
  { 
    id: 'room-1', 
    name: 'Main Office', 
    floor: 1, 
    capacity: 20,
    utilities: [
      { type: 'wifi', available: true },
      { type: 'airConditioner', available: true },
      { type: 'naturalLight', available: true },
      { type: 'whiteboard', available: true }
    ]
  },
  { 
    id: 'room-2', 
    name: 'Meeting Room A', 
    floor: 1, 
    capacity: 5,
    utilities: [
      { type: 'wifi', available: true },
      { type: 'projector', available: true },
      { type: 'conferencePhone', available: true },
      { type: 'whiteboard', available: true }
    ]
  },
  { 
    id: 'room-3', 
    name: 'Executive Suite', 
    floor: 2, 
    capacity: 8,
    utilities: [
      { type: 'wifi', available: true },
      { type: 'airConditioner', available: true },
      { type: 'naturalLight', available: true },
      { type: 'conferencePhone', available: true },
      { type: 'projector', available: true }
    ]
  },
  { 
    id: 'room-4', 
    name: 'Creative Space', 
    floor: 2, 
    capacity: 15,
    utilities: [
      { type: 'wifi', available: true },
      { type: 'whiteboard', available: true },
      { type: 'naturalLight', available: true }
    ]
  },
];

export const getRooms = (): Room[] => [...rooms];

// Get room by ID
export const getRoomById = (roomId: string): Room | undefined => {
  return rooms.find((room) => room.id === roomId);
};

export const createRoom = (room: Omit<Room, 'id'>): Room => {
  const newRoom: Room = {
    ...room,
    id: `room-${Date.now()}`,
  };

  rooms.push(newRoom);
  return newRoom;
};

export const updateRoom = (roomId: string, updates: Partial<Omit<Room, 'id'>>): Room | null => {
  const room = getRoomById(roomId);
  if (!room) return null;

  Object.assign(room, updates);
  return room;
};

export const deleteRoom = (roomId: string): boolean => {
  const nextRooms = rooms.filter((room) => room.id !== roomId);
  const deleted = nextRooms.length !== rooms.length;
  rooms = nextRooms;
  return deleted;
};
