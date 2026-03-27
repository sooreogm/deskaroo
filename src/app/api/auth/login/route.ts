import { NextResponse } from 'next/server';
import { issueSessionForUser, setRefreshTokenCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ensureSeedData } from '@/lib/db/seed';
import { verifyPassword } from '@/lib/password';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    await ensureSeedData();

    const { email, password } = await request.json();
    const normalizedEmail = String(email ?? '').trim().toLowerCase();

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
        name: true,
        email: true,
        avatarUrl: true,
        phone: true,
        department: true,
        role: true,
        teamId: true,
        emailVerifiedAt: true,
        emailVerificationRequired: true,
        passwordHash: true,
      },
    });

    if (!user || !(await verifyPassword(String(password), user.passwordHash))) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (user.emailVerificationRequired && !user.emailVerifiedAt) {
      return NextResponse.json(
        { error: 'Verify your email before signing in. Check your inbox or request a new verification email.' },
        { status: 403 }
      );
    }

    const { body, refreshToken, refreshExpiresAt } = await issueSessionForUser(user);
    const response = NextResponse.json(body, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });

    setRefreshTokenCookie(response, refreshToken, refreshExpiresAt);

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to sign in' },
      { status: 500 }
    );
  }
}
