import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeedData } from '@/lib/db/seed';

export async function POST(request: Request) {
  try {
    await ensureSeedData();

    const { email } = await request.json();
    const normalizedEmail = String(email ?? '').trim();

    if (!normalizedEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'No account found for that email' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to request password reset' },
      { status: 500 }
    );
  }
}
