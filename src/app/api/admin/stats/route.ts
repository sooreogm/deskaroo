import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeedData } from '@/lib/db/seed';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureSeedData();

    const [rooms, desks, bookings, users] = await Promise.all([
      prisma.room.count(),
      prisma.desk.count(),
      prisma.booking.count(),
      prisma.user.count(),
    ]);

    return NextResponse.json({ rooms, desks, bookings, users });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to load admin stats' },
      { status: 500 }
    );
  }
}
