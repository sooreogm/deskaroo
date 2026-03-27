import { NextResponse } from 'next/server';
import { revokeAllUserRefreshTokens } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ensureSeedData } from '@/lib/db/seed';
import { hashPassword } from '@/lib/password';

export async function POST(request: Request, { params }: { params: { userId: string } }) {
  try {
    await ensureSeedData();

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: params.userId },
      data: {
        passwordHash: await hashPassword(String(password)),
      },
    });

    await revokeAllUserRefreshTokens(params.userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to update password' },
      { status: 500 }
    );
  }
}
