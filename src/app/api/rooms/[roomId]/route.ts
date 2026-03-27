import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeedData } from '@/lib/db/seed';
import { toRoomResponse } from '@/lib/db/transformers';

export async function PATCH(request: Request, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    await ensureSeedData();
    const { roomId } = await params;

    const { name, floor, capacity } = await request.json();
    const normalizedName = String(name ?? '').trim();

    if (!normalizedName) {
      return NextResponse.json({ error: 'Room name is required' }, { status: 400 });
    }

    const room = await prisma.room.update({
      where: { id: roomId },
      data: {
        name: normalizedName,
        floor: Number(floor ?? 1),
        capacity: Number(capacity ?? 1),
      },
    });

    return NextResponse.json(toRoomResponse(room));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to update room' },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    await ensureSeedData();
    const { roomId } = await params;

    await prisma.$transaction(async (tx) => {
      await tx.booking.deleteMany({
        where: {
          roomId,
        },
      });

      await tx.desk.deleteMany({
        where: {
          roomId,
        },
      });

      await tx.room.delete({
        where: {
          id: roomId,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to delete room' },
      { status: 500 }
    );
  }
}
