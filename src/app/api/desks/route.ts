import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeedData } from '@/lib/db/seed';
import { toDeskResponse } from '@/lib/db/transformers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await ensureSeedData();

    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

    const desks = await prisma.desk.findMany({
      where: roomId ? { roomId } : undefined,
      orderBy: [{ roomId: 'asc' }, { name: 'asc' }],
    });

    return NextResponse.json(desks.map(toDeskResponse));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to load desks' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureSeedData();

    const { name, roomId, status, type } = await request.json();
    const normalizedName = String(name ?? '').trim();
    const normalizedRoomId = String(roomId ?? '').trim();

    if (!normalizedName || !normalizedRoomId) {
      return NextResponse.json({ error: 'Desk name and room are required' }, { status: 400 });
    }

    const desk = await prisma.desk.create({
      data: {
        name: normalizedName,
        roomId: normalizedRoomId,
        status: String(status ?? 'available'),
        type: type ? String(type) : 'standard',
        position: { x: 0, y: 0 },
      },
    });

    return NextResponse.json(toDeskResponse(desk), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to create desk' },
      { status: 500 }
    );
  }
}
