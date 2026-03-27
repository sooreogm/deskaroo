import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { assertDeskAvailable, toBookingResponse } from '@/lib/db/bookings';
import { ensureSeedData } from '@/lib/db/seed';

const validDurations = new Set(['full-day', 'morning', 'afternoon', 'custom']);

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await ensureSeedData();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') ?? undefined;
    const deskId = searchParams.get('deskId') ?? undefined;
    const dateKey = searchParams.get('dateKey') ?? undefined;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Number(limitParam) : undefined;

    const bookings = await prisma.booking.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(deskId ? { deskId } : {}),
        ...(dateKey ? { dateKey } : {}),
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

    const { userId, deskId, roomId, dateKey, duration, timeSlot } = await request.json();

    if (!userId || !deskId || !roomId || !dateKey || !validDurations.has(String(duration))) {
      return NextResponse.json({ error: 'Invalid booking request' }, { status: 400 });
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

    await assertDeskAvailable({
      deskId: String(deskId),
      dateKey: String(dateKey),
      duration: String(duration),
      timeSlot,
    });

    const booking = await prisma.booking.create({
      data: {
        userId: String(userId),
        deskId: String(deskId),
        roomId: String(roomId),
        dateKey: String(dateKey),
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

    return NextResponse.json(toBookingResponse(booking), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to create booking' },
      { status: 500 }
    );
  }
}
