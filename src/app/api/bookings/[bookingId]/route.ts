import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { toBookingResponse } from '@/lib/db/bookings';
import { ensureSeedData } from '@/lib/db/seed';

const validStatuses = new Set(['pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out']);

export async function PATCH(request: Request, { params }: { params: { bookingId: string } }) {
  try {
    await ensureSeedData();

    const { status } = await request.json();
    const normalizedStatus = String(status ?? '');

    if (!validStatuses.has(normalizedStatus)) {
      return NextResponse.json({ error: 'Invalid booking status' }, { status: 400 });
    }

    const booking = await prisma.booking.update({
      where: { id: params.bookingId },
      data: {
        status: normalizedStatus,
        ...(normalizedStatus === 'checked_in'
          ? {
              checkedInAt: new Date(),
            }
          : {}),
        ...(normalizedStatus === 'checked_out'
          ? {
              checkedOutAt: new Date(),
            }
          : {}),
      },
      include: {
        user: true,
        desk: true,
        room: true,
      },
    });

    return NextResponse.json(toBookingResponse(booking));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to update booking' },
      { status: 500 }
    );
  }
}
