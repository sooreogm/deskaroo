import {
  Booking,
  BookingDuration,
  CommunityMessage,
  CommunitySnapshot,
  CommunitySpaceMembership,
  CommunitySpaceSummary,
  Desk,
  Room,
  TimeSlot,
  User,
} from '@/types';
import { combineDateKeyAndTime, dateFromKey, formatDateKey, formatTimeValue } from '@/lib/date-keys';
import { requestJson } from '@/lib/http';
import { getCurrentAuthSession, restoreAuthSession } from '@/utils/users';

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

interface CommunitySpaceSummaryResponse {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  memberCount: number;
  messageCount: number;
}

interface CommunityMembershipResponse {
  id: string;
  spaceId: string;
  userId: string;
  joinedAt: string;
  lastReadAt?: string | null;
}

interface CommunityMessageResponse {
  id: string;
  spaceId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isCurrentUser: boolean;
  attachments: Array<{
    id: string;
    kind: 'file' | 'voice_note';
    fileName: string;
    mimeType: string;
    size: number;
    url: string;
  }>;
  sender: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
    department?: string | null;
  };
}

interface CommunitySnapshotResponse {
  space: CommunitySpaceSummaryResponse;
  membership: CommunityMembershipResponse | null;
  requiresAvatar: boolean;
  messages: CommunityMessageResponse[];
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
  startDate: Date;
  endDate?: Date;
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

const toCommunitySpaceSummary = (
  space: CommunitySpaceSummaryResponse
): CommunitySpaceSummary => {
  return {
    id: space.id,
    slug: space.slug,
    name: space.name,
    description: space.description ?? undefined,
    memberCount: space.memberCount,
    messageCount: space.messageCount,
  };
};

const toCommunityMembership = (
  membership: CommunityMembershipResponse
): CommunitySpaceMembership => {
  return {
    id: membership.id,
    spaceId: membership.spaceId,
    userId: membership.userId,
    joinedAt: new Date(membership.joinedAt),
    lastReadAt: membership.lastReadAt ? new Date(membership.lastReadAt) : undefined,
  };
};

const toCommunityMessage = (
  message: CommunityMessageResponse
): CommunityMessage => {
  return {
    id: message.id,
    spaceId: message.spaceId,
    content: message.content,
    createdAt: new Date(message.createdAt),
    updatedAt: new Date(message.updatedAt),
    isCurrentUser: message.isCurrentUser,
    attachments: message.attachments,
    sender: {
      id: message.sender.id,
      name: message.sender.name,
      email: message.sender.email,
      avatar: message.sender.avatarUrl ?? undefined,
      department: message.sender.department ?? undefined,
    },
  };
};

const getAuthorizedInit = async (init: RequestInit = {}) => {
  const { user, error } = await restoreAuthSession();
  const session = getCurrentAuthSession();

  if (!user || !session?.access_token) {
    throw error ?? new Error('Not authenticated');
  }

  return {
    ...init,
    credentials: 'same-origin' as const,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${session.access_token}`,
    },
  };
};

const getErrorMessageFromResponse = async (response: Response, fallback: string) => {
  try {
    const data = await response.json();
    return data.error ?? data.message ?? fallback;
  } catch {
    const text = await response.text();
    return text || fallback;
  }
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
  dateFrom,
  dateTo,
  limit,
}: {
  userId?: string;
  deskId?: string;
  date?: Date;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
} = {}) => {
  const data = await requestJson<BookingResponse[]>(
    `/api/bookings${createSearchParams({
      userId,
      deskId,
      ...(date
        ? {
            dateKey: formatDateKey(date),
          }
        : {
            dateKeyFrom: dateFrom ? formatDateKey(dateFrom) : undefined,
            dateKeyTo: dateTo ? formatDateKey(dateTo) : undefined,
          }),
      limit,
    })}`
  );

  return data.map(toPersistedBooking);
};

export const createBookingRequest = async (payload: CreateBookingInput) => {
  const data = await requestJson<BookingResponse[]>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify({
      userId: payload.userId,
      deskId: payload.deskId,
      roomId: payload.roomId,
      startDateKey: formatDateKey(payload.startDate),
      endDateKey: formatDateKey(payload.endDate ?? payload.startDate),
      duration: payload.duration,
      timeSlot: payload.timeSlot
        ? {
            start: formatTimeValue(payload.timeSlot.start),
            end: formatTimeValue(payload.timeSlot.end),
          }
        : undefined,
    }),
  });

  return data.map(toPersistedBooking);
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

export const fetchCommunitySpace = async (): Promise<CommunitySnapshot> => {
  const data = await requestJson<CommunitySnapshotResponse>(
    '/api/community',
    await getAuthorizedInit({
      cache: 'no-store',
    })
  );

  return {
    space: toCommunitySpaceSummary(data.space),
    membership: data.membership ? toCommunityMembership(data.membership) : null,
    requiresAvatar: data.requiresAvatar,
    messages: data.messages.map(toCommunityMessage),
  };
};

export const joinCommunitySpaceRequest = async (): Promise<CommunitySpaceMembership> => {
  const data = await requestJson<{ membership: CommunityMembershipResponse }>(
    '/api/community/join',
    await getAuthorizedInit({
      method: 'POST',
    })
  );

  return toCommunityMembership(data.membership);
};

export const postCommunityMessageRequest = async (
  payload: {
    content: string;
    attachmentFile?: File | null;
    voiceNoteFile?: File | null;
  }
): Promise<CommunityMessage> => {
  const formData = new FormData();
  formData.set('content', payload.content);

  if (payload.attachmentFile) {
    formData.set('attachment', payload.attachmentFile, payload.attachmentFile.name);
  }

  if (payload.voiceNoteFile) {
    formData.set('voiceNote', payload.voiceNoteFile, payload.voiceNoteFile.name);
  }

  const data = await requestJson<CommunityMessageResponse>(
    '/api/community/messages',
    await getAuthorizedInit({
      method: 'POST',
      body: formData,
    })
  );

  return toCommunityMessage(data);
};

export const fetchCommunityAttachmentBlob = async (url: string): Promise<Blob> => {
  const response = await fetch(
    url,
    await getAuthorizedInit({
      cache: 'no-store',
    })
  );

  if (!response.ok) {
    throw new Error(await getErrorMessageFromResponse(response, 'Unable to load attachment'));
  }

  return response.blob();
};
