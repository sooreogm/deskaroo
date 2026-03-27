import { Booking, BookingDuration, Desk, Room, TimeSlot, User } from '@/types';
import { combineDateKeyAndTime, dateFromKey, formatDateKey, formatTimeValue } from '@/lib/date-keys';
import { requestJson } from '@/lib/http';

interface BookingResponse {
  id: string;
  userId: string;
  deskId: string;
  roomId: string;
  dateKey: string;
  duration: BookingDuration;
  timeSlot?: {
    start: string;
    end: string;
  } | null;
  status: Booking['status'];
  createdAt: string;
  updatedAt: string;
  checkedInAt?: string | null;
  checkedOutAt?: string | null;
  deskName?: string;
  roomName?: string;
  userName?: string;
  userEmail?: string;
}

export type PersistedBooking = Booking & {
  dateKey?: string;
  deskName?: string;
  roomName?: string;
  userName?: string;
  userEmail?: string;
};

export interface CreateBookingInput {
  userId: string;
  deskId: string;
  roomId: string;
  date: Date;
  duration: BookingDuration;
  timeSlot?: TimeSlot;
}

export interface RoomInput {
  name: string;
  floor: number;
  capacity: number;
}

export interface DeskInput {
  name: string;
  roomId: string;
  status: 'available' | 'maintenance';
  type?: Desk['type'];
}

export interface AdminStats {
  rooms: number;
  desks: number;
  bookings: number;
  users: number;
}

const toPersistedBooking = (booking: BookingResponse): PersistedBooking => {
  return {
    id: booking.id,
    userId: booking.userId,
    deskId: booking.deskId,
    roomId: booking.roomId,
    dateKey: booking.dateKey,
    date: dateFromKey(booking.dateKey),
    duration: booking.duration,
    timeSlot: booking.timeSlot
      ? {
          start: combineDateKeyAndTime(booking.dateKey, booking.timeSlot.start),
          end: combineDateKeyAndTime(booking.dateKey, booking.timeSlot.end),
        }
      : undefined,
    status: booking.status,
    createdAt: new Date(booking.createdAt),
    updatedAt: new Date(booking.updatedAt),
    checkedInAt: booking.checkedInAt ? new Date(booking.checkedInAt) : undefined,
    checkedOutAt: booking.checkedOutAt ? new Date(booking.checkedOutAt) : undefined,
    deskName: booking.deskName,
    roomName: booking.roomName,
    userName: booking.userName,
    userEmail: booking.userEmail,
  };
};

const createSearchParams = (params: Record<string, string | number | undefined>) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

export const fetchRooms = () => {
  return requestJson<Room[]>('/api/rooms');
};

export const createRoomRequest = (payload: RoomInput) => {
  return requestJson<Room>('/api/rooms', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updateRoomRequest = (roomId: string, payload: RoomInput) => {
  return requestJson<Room>(`/api/rooms/${roomId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};

export const deleteRoomRequest = (roomId: string) => {
  return requestJson<{ success: true }>(`/api/rooms/${roomId}`, {
    method: 'DELETE',
  });
};

export const fetchDesks = (roomId?: string) => {
  return requestJson<Desk[]>(`/api/desks${createSearchParams({ roomId })}`);
};

export const createDeskRequest = (payload: DeskInput) => {
  return requestJson<Desk>('/api/desks', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updateDeskRequest = (deskId: string, payload: DeskInput) => {
  return requestJson<Desk>(`/api/desks/${deskId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};

export const deleteDeskRequest = (deskId: string) => {
  return requestJson<{ success: true }>(`/api/desks/${deskId}`, {
    method: 'DELETE',
  });
};

export const fetchUsers = () => {
  return requestJson<User[]>('/api/users');
};

export const fetchAdminStats = () => {
  return requestJson<AdminStats>('/api/admin/stats');
};

export const fetchBookings = async ({
  userId,
  deskId,
  date,
  limit,
}: {
  userId?: string;
  deskId?: string;
  date?: Date;
  limit?: number;
} = {}) => {
  const data = await requestJson<BookingResponse[]>(
    `/api/bookings${createSearchParams({
      userId,
      deskId,
      dateKey: date ? formatDateKey(date) : undefined,
      limit,
    })}`
  );

  return data.map(toPersistedBooking);
};

export const createBookingRequest = async (payload: CreateBookingInput) => {
  const data = await requestJson<BookingResponse>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify({
      userId: payload.userId,
      deskId: payload.deskId,
      roomId: payload.roomId,
      dateKey: formatDateKey(payload.date),
      duration: payload.duration,
      timeSlot: payload.timeSlot
        ? {
            start: formatTimeValue(payload.timeSlot.start),
            end: formatTimeValue(payload.timeSlot.end),
          }
        : undefined,
    }),
  });

  return toPersistedBooking(data);
};

export const updateBookingStatusRequest = async (bookingId: string, status: Booking['status']) => {
  const data = await requestJson<BookingResponse>(`/api/bookings/${bookingId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

  return toPersistedBooking(data);
};

export const cancelBookingRequest = async (bookingId: string) => {
  return updateBookingStatusRequest(bookingId, 'cancelled');
};
