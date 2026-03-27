import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';

export interface BookingTimeSlotPayload {
  start: string;
  end: string;
}

type BookingWithRelations = Prisma.BookingGetPayload<{
  include: {
    user: true;
    desk: true;
    room: true;
  };
}>;

const DEFAULT_DAY_START = 9 * 60;
const DEFAULT_MORNING_END = 13 * 60;
const DEFAULT_DAY_END = 17 * 60;

const timeToMinutes = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

const getRangeForBooking = (duration: string, timeSlot?: BookingTimeSlotPayload | null) => {
  switch (duration) {
    case 'full-day':
      return { start: DEFAULT_DAY_START, end: DEFAULT_DAY_END };
    case 'morning':
      return { start: DEFAULT_DAY_START, end: DEFAULT_MORNING_END };
    case 'afternoon':
      return { start: DEFAULT_MORNING_END, end: DEFAULT_DAY_END };
    case 'custom':
      if (!timeSlot) {
        return null;
      }
      return {
        start: timeToMinutes(timeSlot.start),
        end: timeToMinutes(timeSlot.end),
      };
    default:
      return null;
  }
};

const rangesOverlap = (first: { start: number; end: number }, second: { start: number; end: number }) => {
  return first.start < second.end && second.start < first.end;
};

export const parseBookingTimeSlot = (value: Prisma.JsonValue | null | undefined) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const candidate = value as Prisma.JsonObject;
  if (typeof candidate.start !== 'string' || typeof candidate.end !== 'string') {
    return null;
  }

  return {
    start: candidate.start,
    end: candidate.end,
  };
};

export const assertDeskAvailable = async ({
  deskId,
  dateKey,
  duration,
  timeSlot,
  excludeBookingId,
  db = prisma,
}: {
  deskId: string;
  dateKey: string;
  duration: string;
  timeSlot?: BookingTimeSlotPayload | null;
  excludeBookingId?: string;
  db?: Prisma.TransactionClient | typeof prisma;
}) => {
  const requestedRange = getRangeForBooking(duration, timeSlot);
  if (!requestedRange || requestedRange.start >= requestedRange.end) {
    throw new Error('Invalid booking time slot');
  }

  const existingBookings = await db.booking.findMany({
    where: {
      deskId,
      dateKey,
      status: {
        not: 'cancelled',
      },
      ...(excludeBookingId
        ? {
            id: {
              not: excludeBookingId,
            },
          }
        : {}),
    },
    select: {
      duration: true,
      timeSlot: true,
    },
  });

  const conflictExists = existingBookings.some((booking) => {
    const range = getRangeForBooking(booking.duration, parseBookingTimeSlot(booking.timeSlot));
    return range ? rangesOverlap(range, requestedRange) : true;
  });

  if (conflictExists) {
    throw new Error('This desk is not available for the selected time slot');
  }
};

export const toBookingResponse = (booking: BookingWithRelations) => {
  return {
    id: booking.id,
    userId: booking.userId,
    deskId: booking.deskId,
    roomId: booking.roomId,
    dateKey: booking.dateKey,
    duration: booking.duration,
    timeSlot: parseBookingTimeSlot(booking.timeSlot),
    status: booking.status,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    checkedInAt: booking.checkedInAt?.toISOString() ?? null,
    checkedOutAt: booking.checkedOutAt?.toISOString() ?? null,
    deskName: booking.desk?.name,
    roomName: booking.room?.name,
    userName: booking.user?.name,
    userEmail: booking.user?.email,
  };
};
