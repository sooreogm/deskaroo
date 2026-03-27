import { Prisma } from '@prisma/client';
import { Desk, Room, User } from '@/types';

const isRecord = (value: Prisma.JsonValue | null | undefined): value is Prisma.JsonObject => {
  return !!value && typeof value === 'object' && !Array.isArray(value);
};

export const toUserResponse = (user: {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  phone: string | null;
  department: string | null;
  role: string;
  teamId: string | null;
}): User => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatarUrl ?? undefined,
    phone: user.phone ?? undefined,
    department: user.department ?? undefined,
    role: (user.role as User['role']) ?? 'user',
    teamId: user.teamId ?? undefined,
  };
};

export const toRoomResponse = (room: {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  utilities: Prisma.JsonValue | null;
}): Room => {
  return {
    id: room.id,
    name: room.name,
    floor: room.floor,
    capacity: room.capacity,
    utilities: Array.isArray(room.utilities) ? (room.utilities as unknown as Room['utilities']) : undefined,
  };
};

export const toDeskResponse = (desk: {
  id: string;
  name: string;
  roomId: string;
  status: string;
  position: Prisma.JsonValue;
  width: number | null;
  height: number | null;
  type: string | null;
  rotation: number | null;
  utilities: Prisma.JsonValue | null;
}): Desk => {
  const position = isRecord(desk.position)
    ? {
        x: Number(desk.position.x ?? 0),
        y: Number(desk.position.y ?? 0),
      }
    : { x: 0, y: 0 };

  return {
    id: desk.id,
    name: desk.name,
    roomId: desk.roomId,
    status: (desk.status as Desk['status']) ?? 'available',
    position,
    width: desk.width ?? undefined,
    height: desk.height ?? undefined,
    type: (desk.type as Desk['type']) ?? undefined,
    rotation: desk.rotation ?? undefined,
    utilities: Array.isArray(desk.utilities) ? (desk.utilities as unknown as Desk['utilities']) : undefined,
  };
};
