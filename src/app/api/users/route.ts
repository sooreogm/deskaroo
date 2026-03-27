import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeedData } from '@/lib/db/seed';
import { toUserResponse } from '@/lib/db/transformers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureSeedData();

    const users = await prisma.user.findMany({
      orderBy: [{ role: 'desc' }, { name: 'asc' }],
    });

    return NextResponse.json(users.map(toUserResponse));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to load users' },
      { status: 500 }
    );
  }
}
