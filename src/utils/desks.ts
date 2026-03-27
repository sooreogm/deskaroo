import { Desk } from '@/types';

let desks: Desk[] = [
  { 
    id: 'desk-1', 
    name: 'Desk 1A', 
    roomId: 'room-1', 
    status: 'available' as const, 
    position: { x: 10, y: 10 },
    type: 'standard',
    utilities: [
      { type: 'monitor', available: true, quantity: 2 },
      { type: 'dockingStation', available: true },
      { type: 'charger', available: true },
      { type: 'ergonomicChair', available: true }
    ]
  },
  { 
    id: 'desk-2', 
    name: 'Desk 1B', 
    roomId: 'room-1', 
    status: 'available' as const, 
    position: { x: 10, y: 40 },
    type: 'standing',
    utilities: [
      { type: 'monitor', available: true, quantity: 1 },
      { type: 'dockingStation', available: true },
      { type: 'adjustableHeight', available: true },
      { type: 'ergonomicChair', available: true },
      { type: 'headsetHook', available: true }
    ]
  },
  { 
    id: 'desk-3', 
    name: 'Desk 1C', 
    roomId: 'room-1', 
    status: 'available' as const, 
    position: { x: 10, y: 70 },
    type: 'standard',
    utilities: [
      { type: 'monitor', available: true, quantity: 1 },
      { type: 'dockingStation', available: true },
      { type: 'charger', available: true }
    ]
  },
  { 
    id: 'desk-4', 
    name: 'Desk 1D', 
    roomId: 'room-1', 
    status: 'available' as const, 
    position: { x: 10, y: 100 },
    type: 'standing',
    utilities: [
      { type: 'monitor', available: true, quantity: 2 },
      { type: 'dockingStation', available: true },
      { type: 'adjustableHeight', available: true },
      { type: 'headsetHook', available: false }
    ]
  },
  { 
    id: 'desk-5', 
    name: 'Desk 2A', 
    roomId: 'room-1', 
    status: 'available' as const, 
    position: { x: 40, y: 10 },
    type: 'corner',
    utilities: [
      { type: 'monitor', available: true, quantity: 2 },
      { type: 'dockingStation', available: true },
      { type: 'charger', available: true },
      { type: 'ergonomicChair', available: true }
    ]
  },
  { 
    id: 'desk-6', 
    name: 'Desk 2B', 
    roomId: 'room-1', 
    status: 'available' as const, 
    position: { x: 40, y: 40 },
    type: 'huddle',
    utilities: [
      { type: 'monitor', available: false },
      { type: 'dockingStation', available: true },
      { type: 'charger', available: true }
    ]
  },
  { 
    id: 'desk-7', 
    name: 'Desk 2C', 
    roomId: 'room-1', 
    status: 'maintenance' as const, 
    position: { x: 40, y: 70 },
    type: 'standard',
    utilities: [
      { type: 'monitor', available: false },
      { type: 'dockingStation', available: false },
      { type: 'charger', available: false }
    ]
  },
  { 
    id: 'desk-8', 
    name: 'Desk 2D', 
    roomId: 'room-1', 
    status: 'available' as const, 
    position: { x: 40, y: 100 },
    type: 'standing',
    utilities: [
      { type: 'monitor', available: true, quantity: 1 },
      { type: 'adjustableHeight', available: true },
      { type: 'ergonomicChair', available: true }
    ]
  },
  // Remaining desks (abbreviated for brevity)
  { id: 'desk-9', name: 'Desk A1', roomId: 'room-2', status: 'available' as const, position: { x: 10, y: 10 }, type: 'standard', utilities: [{ type: 'monitor', available: true }, { type: 'dockingStation', available: true }] },
  { id: 'desk-10', name: 'Desk A2', roomId: 'room-2', status: 'available' as const, position: { x: 10, y: 40 }, type: 'standard', utilities: [{ type: 'monitor', available: true }, { type: 'charger', available: true }] },
  { id: 'desk-11', name: 'Desk E1', roomId: 'room-3', status: 'available' as const, position: { x: 10, y: 10 }, type: 'standing', utilities: [{ type: 'monitor', available: true }, { type: 'adjustableHeight', available: true }] },
  { id: 'desk-12', name: 'Desk E2', roomId: 'room-3', status: 'available' as const, position: { x: 10, y: 40 }, type: 'standard', utilities: [{ type: 'monitor', available: true }, { type: 'dockingStation', available: true }] },
  { id: 'desk-13', name: 'Desk E3', roomId: 'room-3', status: 'available' as const, position: { x: 40, y: 10 }, type: 'corner', utilities: [{ type: 'monitor', available: true, quantity: 2 }, { type: 'ergonomicChair', available: true }] },
  { id: 'desk-14', name: 'Desk C1', roomId: 'room-4', status: 'available' as const, position: { x: 10, y: 10 }, type: 'huddle', utilities: [{ type: 'monitor', available: true }, { type: 'dockingStation', available: true }] },
  { id: 'desk-15', name: 'Desk C2', roomId: 'room-4', status: 'available' as const, position: { x: 10, y: 40 }, type: 'standard', utilities: [{ type: 'monitor', available: true }, { type: 'charger', available: true }] },
  { id: 'desk-16', name: 'Desk C3', roomId: 'room-4', status: 'available' as const, position: { x: 40, y: 10 }, type: 'standing', utilities: [{ type: 'monitor', available: true }, { type: 'adjustableHeight', available: true }] },
  { id: 'desk-17', name: 'Desk C4', roomId: 'room-4', status: 'available' as const, position: { x: 40, y: 40 }, type: 'standard', utilities: [{ type: 'monitor', available: true }, { type: 'dockingStation', available: true }] },
];

export const getDesks = (roomId?: string): Desk[] => {
  if (!roomId) return [...desks];
  return desks.filter((desk) => desk.roomId === roomId);
};

// Get desk by ID
export const getDeskById = (deskId: string): Desk | undefined => {
  return desks.find((desk) => desk.id === deskId);
};

export const createDesk = (
  desk: Pick<Desk, 'name' | 'roomId' | 'status'> & {
    type?: Desk['type'];
    position?: Desk['position'];
  }
): Desk => {
  const newDesk: Desk = {
    id: `desk-${Date.now()}`,
    name: desk.name,
    roomId: desk.roomId,
    status: desk.status,
    position: desk.position ?? { x: 0, y: 0 },
    type: desk.type ?? 'standard',
  };

  desks.push(newDesk);
  return newDesk;
};

export const updateDesk = (deskId: string, updates: Partial<Omit<Desk, 'id'>>): Desk | null => {
  const desk = getDeskById(deskId);
  if (!desk) return null;

  Object.assign(desk, updates);
  return desk;
};

export const deleteDesk = (deskId: string): boolean => {
  const nextDesks = desks.filter((desk) => desk.id !== deskId);
  const deleted = nextDesks.length !== desks.length;
  desks = nextDesks;
  return deleted;
};

export const deleteDesksByRoom = (roomId: string): void => {
  desks = desks.filter((desk) => desk.roomId !== roomId);
};
