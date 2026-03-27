import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeedData } from '@/lib/db/seed';
import { toRoomResponse } from '@/lib/db/transformers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureSeedData();

    const rooms = await prisma.room.findMany({
      orderBy: [{ floor: 'asc' }, { name: 'asc' }],
    });

    return NextResponse.json(rooms.map(toRoomResponse));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to load rooms' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureSeedData();

    const { name, floor, capacity } = await request.json();
    const normalizedName = String(name ?? '').trim();

    if (!normalizedName) {
      return NextResponse.json({ error: 'Room name is required' }, { status: 400 });
    }

    const room = await prisma.room.create({
      data: {
        name: normalizedName,
        floor: Number(floor ?? 1),
        capacity: Number(capacity ?? 1),
      },
    });

    return NextResponse.json(toRoomResponse(room), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to create room' },
      { status: 500 }
    );
  }
}
