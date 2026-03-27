import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { assertDeskAvailable, toBookingResponse } from '@/lib/db/bookings';
import { ensureSeedData } from '@/lib/db/seed';
import { compareDateKeys, getDateKeysInRange } from '@/lib/date-keys';

const validDurations = new Set(['full-day', 'morning', 'afternoon', 'custom']);

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await ensureSeedData();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') ?? undefined;
    const deskId = searchParams.get('deskId') ?? undefined;
    const dateKey = searchParams.get('dateKey') ?? undefined;
    const dateKeyFrom = searchParams.get('dateKeyFrom') ?? undefined;
    const dateKeyTo = searchParams.get('dateKeyTo') ?? undefined;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Number(limitParam) : undefined;

    const bookings = await prisma.booking.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(deskId ? { deskId } : {}),
        ...(dateKey
          ? { dateKey }
          : dateKeyFrom || dateKeyTo
          ? {
              dateKey: {
                ...(dateKeyFrom ? { gte: dateKeyFrom } : {}),
                ...(dateKeyTo ? { lte: dateKeyTo } : {}),
              },
            }
          : {}),
      },
      include: {
        user: true,
        desk: true,
        room: true,
      },
      orderBy: [{ dateKey: 'desc' }, { createdAt: 'desc' }],
      ...(limit ? { take: limit } : {}),
    });

    return NextResponse.json(bookings.map(toBookingResponse));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to load bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureSeedData();

    const { userId, deskId, roomId, dateKey, startDateKey, endDateKey, duration, timeSlot } = await request.json();
    const normalizedStartDateKey = String(startDateKey ?? dateKey ?? '');
    const normalizedEndDateKey = String(endDateKey ?? startDateKey ?? dateKey ?? '');

    if (!userId || !deskId || !roomId || !normalizedStartDateKey || !normalizedEndDateKey || !validDurations.has(String(duration))) {
      return NextResponse.json({ error: 'Invalid booking request' }, { status: 400 });
    }

    if (compareDateKeys(normalizedStartDateKey, normalizedEndDateKey) > 0) {
      return NextResponse.json({ error: 'End date must be on or after the start date' }, { status: 400 });
    }

    const [user, desk] = await Promise.all([
      prisma.user.findUnique({ where: { id: String(userId) }, select: { id: true } }),
      prisma.desk.findUnique({
        where: { id: String(deskId) },
        select: {
          id: true,
          roomId: true,
          status: true,
        },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!desk || desk.roomId !== String(roomId)) {
      return NextResponse.json({ error: 'Desk not found for the selected room' }, { status: 404 });
    }

    if (desk.status === 'maintenance') {
      return NextResponse.json({ error: 'This desk is currently under maintenance' }, { status: 400 });
    }

    const bookingDateKeys = getDateKeysInRange(normalizedStartDateKey, normalizedEndDateKey);

    const bookings = await prisma.$transaction(async (tx) => {
      for (const bookingDateKey of bookingDateKeys) {
        await assertDeskAvailable({
          db: tx,
          deskId: String(deskId),
          dateKey: bookingDateKey,
          duration: String(duration),
          timeSlot,
        });
      }

      const createdBookings = [];

      for (const bookingDateKey of bookingDateKeys) {
        const booking = await tx.booking.create({
          data: {
            userId: String(userId),
            deskId: String(deskId),
            roomId: String(roomId),
            dateKey: bookingDateKey,
            duration: String(duration),
            timeSlot: timeSlot ?? undefined,
            status: 'confirmed',
          },
          include: {
            user: true,
            desk: true,
            room: true,
          },
        });

        createdBookings.push(booking);
      }

      return createdBookings;
    });

    return NextResponse.json(bookings.map(toBookingResponse), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to create booking' },
      { status: 500 }
    );
  }
}
