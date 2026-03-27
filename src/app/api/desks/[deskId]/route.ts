import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeedData } from '@/lib/db/seed';
import { toDeskResponse } from '@/lib/db/transformers';

export async function PATCH(request: Request, { params }: { params: Promise<{ deskId: string }> }) {
  try {
    await ensureSeedData();
    const { deskId } = await params;

    const { name, roomId, status, type } = await request.json();
    const normalizedName = String(name ?? '').trim();
    const normalizedRoomId = String(roomId ?? '').trim();

    if (!normalizedName || !normalizedRoomId) {
      return NextResponse.json({ error: 'Desk name and room are required' }, { status: 400 });
    }

    const desk = await prisma.desk.update({
      where: { id: deskId },
      data: {
        name: normalizedName,
        roomId: normalizedRoomId,
        status: String(status ?? 'available'),
        type: type ? String(type) : 'standard',
      },
    });

    return NextResponse.json(toDeskResponse(desk));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to update desk' },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ deskId: string }> }) {
  try {
    await ensureSeedData();
    const { deskId } = await params;

    await prisma.$transaction(async (tx) => {
      await tx.booking.deleteMany({
        where: {
          deskId,
        },
      });

      await tx.desk.delete({
        where: {
          id: deskId,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to delete desk' },
      { status: 500 }
    );
  }
}
