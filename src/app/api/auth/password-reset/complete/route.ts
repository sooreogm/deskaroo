import { NextResponse } from 'next/server';
import { revokeAllUserRefreshTokens } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ensureSeedData } from '@/lib/db/seed';
import { hashPassword } from '@/lib/password';

export async function POST(request: Request) {
  try {
    await ensureSeedData();

    const { email, password } = await request.json();
    const normalizedEmail = String(email ?? '').trim();

    if (!normalizedEmail || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
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
      return NextResponse.json({ error: 'No password reset request found' }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hashPassword(String(password)),
      },
    });

    await revokeAllUserRefreshTokens(user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to complete password reset' },
      { status: 500 }
    );
  }
}
